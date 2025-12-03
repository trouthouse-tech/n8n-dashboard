import { AppThunk } from '../../types';
import { WorkflowResponsesActions } from '../../dumps';
import { WorkflowResponse } from '@/model';
import { getWorkflowResponseByExecutionId } from '@/api';

type ResponseType = Promise<{ status: 200 | 400 | 404 | 500; response?: WorkflowResponse }>;

export const getWorkflowResponseByExecutionIdThunk = (
  executionId: string
): AppThunk<ResponseType> => {
  return async (dispatch, getState): ResponseType => {
    try {
      // Check if response is already in store via execution's responseId
      const execution = getState().workflowExecutions[executionId];
      if (execution?.responseId) {
        const existingResponse = getState().workflowResponses[execution.responseId];
        if (existingResponse) {
          return { status: 200, response: existingResponse };
        }
      }

      // Fetch from Firebase
      const response = await getWorkflowResponseByExecutionId(executionId);

      if (!response.success) {
        console.error('Failed to get response:', response.error);
        return { status: 400 };
      }

      if (!response.data) {
        return { status: 404 };
      }

      dispatch(WorkflowResponsesActions.addWorkflowResponse(response.data));
      return { status: 200, response: response.data };
    } catch (error) {
      console.error('Error getting response:', error);
      return { status: 500 };
    }
  };
};

