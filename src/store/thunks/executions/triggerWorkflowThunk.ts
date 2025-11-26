import { AppThunk } from '../../types';
import { WorkflowExecutionsActions, WorkflowResponsesActions } from '../../dumps';
import { WorkflowBuilderActions } from '../../builders';
import { WorkflowBodyParam, WorkflowExecution, WorkflowResponse } from '../../../model';

const EXECUTIONS_STORAGE_KEY = 'n8n-workflow-executions';
const RESPONSES_STORAGE_KEY = 'n8n-workflow-responses';

interface TriggerParams {
  workflowId: string;
  webhookUrl: string;
  bodyParams: WorkflowBodyParam[];
}

interface TriggerResult {
  status: 200 | 400 | 500;
  responseId?: string;
  error?: string;
}

export const triggerWorkflowThunk = (
  params: TriggerParams
): AppThunk<Promise<TriggerResult>> => {
  return async (dispatch, getState) => {
    const { workflowId, webhookUrl, bodyParams } = params;

    dispatch(WorkflowBuilderActions.setIsExecuting(true));

    const executionId = crypto.randomUUID();
    const now = new Date().toISOString();

    // Create execution record
    const execution: WorkflowExecution = {
      id: executionId,
      workflowId,
      responseId: null,
      requestUrl: webhookUrl,
      requestBody: bodyParams,
      status: 'pending',
      errorMessage: null,
      executedAt: now,
    };

    dispatch(WorkflowExecutionsActions.addWorkflowExecution(execution));

    try {
      // Convert body params to object
      const body: Record<string, string> = {};
      bodyParams.forEach((param) => {
        if (param.key) {
          body[param.key] = param.value;
        }
      });

      // Call the API route
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

      // Create response record
      const responseId = crypto.randomUUID();
      const rawResponse =
        typeof result.data === 'string'
          ? result.data
          : JSON.stringify(result.data, null, 2);

      const response: WorkflowResponse = {
        id: responseId,
        executionId,
        raw: rawResponse,
        receivedAt: new Date().toISOString(),
      };

      dispatch(WorkflowResponsesActions.addWorkflowResponse(response));

      // Update execution with success
      const updatedExecution: WorkflowExecution = {
        ...execution,
        responseId,
        status: 'success',
      };
      dispatch(WorkflowExecutionsActions.updateWorkflowExecution(updatedExecution));

      // Persist to localStorage
      const executions = getState().workflowExecutions;
      const responses = getState().workflowResponses;
      localStorage.setItem(EXECUTIONS_STORAGE_KEY, JSON.stringify(executions));
      localStorage.setItem(RESPONSES_STORAGE_KEY, JSON.stringify(responses));

      dispatch(WorkflowBuilderActions.setIsExecuting(false));
      return { status: 200, responseId };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      // Update execution with error
      const updatedExecution: WorkflowExecution = {
        ...execution,
        status: 'error',
        errorMessage,
      };
      dispatch(WorkflowExecutionsActions.updateWorkflowExecution(updatedExecution));

      // Persist to localStorage
      const executions = getState().workflowExecutions;
      localStorage.setItem(EXECUTIONS_STORAGE_KEY, JSON.stringify(executions));

      dispatch(WorkflowBuilderActions.setIsExecuting(false));
      return { status: 500, error: errorMessage };
    }
  };
};

