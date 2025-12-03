import { AppThunk } from '../../types';
import { WorkflowsActions } from '../../dumps';
import { Workflow } from '@/model';
import { getWorkflowById } from '@/api';

type ResponseType = Promise<{ status: 200 | 400 | 404 | 500; workflow?: Workflow }>;

export const getWorkflowByIdThunk = (workflowId: string): AppThunk<ResponseType> => {
  return async (dispatch, getState): ResponseType => {
    try {
      // Check if workflow is already in store
      const existingWorkflow = getState().workflows[workflowId];
      if (existingWorkflow) {
        return { status: 200, workflow: existingWorkflow };
      }

      // Fetch from Firebase
      const response = await getWorkflowById(workflowId);

      if (!response.success) {
        if (response.statusCode === 404) {
          console.error('Workflow not found:', workflowId);
          return { status: 404 };
        }
        console.error('Failed to get workflow:', response.error);
        return { status: 400 };
      }

      if (!response.data) {
        return { status: 404 };
      }

      dispatch(WorkflowsActions.addWorkflow(response.data as Workflow));
      return { status: 200, workflow: response.data as Workflow };
    } catch (error) {
      console.error('Error getting workflow:', error);
      return { status: 500 };
    }
  };
};

