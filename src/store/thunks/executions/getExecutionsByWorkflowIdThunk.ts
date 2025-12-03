import { AppThunk } from '../../types';
import { WorkflowExecutionsActions } from '../../dumps';
import { WorkflowExecution } from '@/model';
import { getWorkflowExecutionsByWorkflowId } from '@/api';

type ResponseType = Promise<{ status: 200 | 400 | 500; executions?: WorkflowExecution[] }>;

export const getExecutionsByWorkflowIdThunk = (
  workflowId: string
): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await getWorkflowExecutionsByWorkflowId(workflowId);

      if (!response.success || !response.data) {
        console.error('Failed to get executions:', response.error);
        return { status: 400 };
      }

      // Add executions to store (merge with existing)
      response.data.forEach((execution) => {
        dispatch(WorkflowExecutionsActions.addWorkflowExecution(execution));
      });

      return { status: 200, executions: response.data };
    } catch (error) {
      console.error('Error getting executions:', error);
      return { status: 500 };
    }
  };
};

