import { AppThunk } from '../../types';
import { WorkflowExecutionsActions, WorkflowResponsesActions } from '../../dumps';
import { WorkflowBuilderActions } from '../../builders';
import { WorkflowBodyParam, WorkflowExecution, WorkflowResponse } from '@/model';
import {
  createWorkflowExecution,
  updateWorkflowExecution,
  createWorkflowResponse,
} from '@/api';

interface TriggerParams {
  workflowId: string;
  webhookUrl: string;
  bodyParams: WorkflowBodyParam[];
}

interface TriggerResult {
  status: 200 | 400 | 500;
  executionId?: string;
  responseId?: string;
  error?: string;
}

export const triggerWorkflowThunk = (
  params: TriggerParams
): AppThunk<Promise<TriggerResult>> => {
  return async (dispatch, getState) => {
    const { workflowId, webhookUrl, bodyParams } = params;
    const userId = getState().currentUser.id;

    if (!userId) {
      return { status: 400, error: 'No user ID found' };
    }

    dispatch(WorkflowBuilderActions.setIsExecuting(true));

    const now = new Date().toISOString();

    // Create execution record in Firebase (pending status)
    const executionResponse = await createWorkflowExecution({
      userId,
      workflowId,
      responseId: null,
      requestUrl: webhookUrl,
      requestBody: bodyParams,
      status: 'pending',
      errorMessage: null,
      executedAt: now,
    });

    if (!executionResponse.success || !executionResponse.data) {
      console.error('Failed to create execution:', executionResponse.error);
      dispatch(WorkflowBuilderActions.setIsExecuting(false));
      return { status: 400, error: 'Failed to create execution record' };
    }

    const execution = executionResponse.data as WorkflowExecution;
    dispatch(WorkflowExecutionsActions.addWorkflowExecution(execution));

    try {
      // Convert body params to object
      const body: Record<string, string> = {};
      bodyParams.forEach((param) => {
        if (param.key) {
          body[param.key] = param.value;
        }
      });

      // Call the API route to trigger the webhook
      const res = await fetch('/api/trigger-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ webhookUrl, body }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || `HTTP error! status: ${res.status}`);
      }

      // Create response record in Firebase
      const rawResponse =
        typeof result.data === 'string'
          ? result.data
          : JSON.stringify(result.data, null, 2);

      const responseResponse = await createWorkflowResponse({
        userId,
        executionId: execution.id,
        raw: rawResponse,
        receivedAt: new Date().toISOString(),
      });

      if (!responseResponse.success || !responseResponse.data) {
        console.error('Failed to create response:', responseResponse.error);
        throw new Error('Failed to save response');
      }

      const workflowResponse = responseResponse.data as WorkflowResponse;
      dispatch(WorkflowResponsesActions.addWorkflowResponse(workflowResponse));

      // Update execution with success status and response ID
      const updateResponse = await updateWorkflowExecution(execution.id, {
        responseId: workflowResponse.id,
        status: 'success',
      });

      if (updateResponse.success && updateResponse.data) {
        dispatch(
          WorkflowExecutionsActions.updateWorkflowExecution(
            updateResponse.data as WorkflowExecution
          )
        );
      }

      dispatch(WorkflowBuilderActions.setIsExecuting(false));
      return {
        status: 200,
        executionId: execution.id,
        responseId: workflowResponse.id,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      // Update execution with error status
      const updateResponse = await updateWorkflowExecution(execution.id, {
        status: 'error',
        errorMessage,
      });

      if (updateResponse.success && updateResponse.data) {
        dispatch(
          WorkflowExecutionsActions.updateWorkflowExecution(
            updateResponse.data as WorkflowExecution
          )
        );
      }

      dispatch(WorkflowBuilderActions.setIsExecuting(false));
      return { status: 500, executionId: execution.id, error: errorMessage };
    }
  };
};
