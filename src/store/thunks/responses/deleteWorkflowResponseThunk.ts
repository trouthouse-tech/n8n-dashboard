import { AppThunk } from '../../types';
import { WorkflowResponsesActions } from '../../dumps';
import { deleteWorkflowResponse } from '@/api';

type ResponseType = Promise<200 | 400 | 500>;

export const deleteWorkflowResponseThunk = (
  responseId: string
): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await deleteWorkflowResponse(responseId);

      if (!response.success) {
        console.error('Failed to delete response:', response.error);
        return 400;
      }

      dispatch(WorkflowResponsesActions.deleteWorkflowResponse(responseId));
      return 200;
    } catch (error) {
      console.error('Error deleting response:', error);
      return 500;
    }
  };
};

