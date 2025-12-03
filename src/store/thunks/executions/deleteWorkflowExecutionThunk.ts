import { AppThunk } from '../../types';
import { WorkflowExecutionsActions, WorkflowResponsesActions } from '../../dumps';
import { deleteWorkflowExecution, deleteWorkflowResponse } from '@/api';

type ResponseType = Promise<200 | 400 | 500>;

export const deleteWorkflowExecutionThunk = (
  executionId: string
): AppThunk<ResponseType> => {
  return async (dispatch, getState): ResponseType => {
    try {
      // Get the execution to find associated response
      const execution = getState().workflowExecutions[executionId];

      // Delete associated response if exists
      if (execution?.responseId) {
        const responseDeleteResult = await deleteWorkflowResponse(execution.responseId);
        if (responseDeleteResult.success) {
          dispatch(WorkflowResponsesActions.deleteWorkflowResponse(execution.responseId));
        }
      }

      // Delete the execution
      const response = await deleteWorkflowExecution(executionId);

      if (!response.success) {
        console.error('Failed to delete execution:', response.error);
        return 400;
      }

      dispatch(WorkflowExecutionsActions.deleteWorkflowExecution(executionId));
      return 200;
    } catch (error) {
      console.error('Error deleting execution:', error);
      return 500;
    }
  };
};

