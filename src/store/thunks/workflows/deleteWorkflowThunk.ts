import { AppThunk } from '../../types';
import { WorkflowsActions } from '../../dumps';
import { deleteWorkflow } from '@/api';

type ResponseType = Promise<200 | 400 | 500>;

export const deleteWorkflowThunk = (workflowId: string): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await deleteWorkflow(workflowId);

      if (!response.success) {
        console.error('Failed to delete workflow:', response.error);
        return 400;
      }

      dispatch(WorkflowsActions.deleteWorkflow(workflowId));
      return 200;
    } catch (error) {
      console.error('Error deleting workflow:', error);
      return 500;
    }
  };
};
