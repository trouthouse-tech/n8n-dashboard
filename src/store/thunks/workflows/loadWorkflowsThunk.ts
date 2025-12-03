import { AppThunk } from '../../types';
import { WorkflowsActions } from '../../dumps';
import { Workflow } from '@/model';
import { getAllWorkflows } from '@/api';

type ResponseType = Promise<200 | 400 | 500>;

export const loadWorkflowsThunk = (userId: string): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await getAllWorkflows(userId);

      if (!response.success || !response.data) {
        console.error('Failed to load workflows:', response.error);
        return 400;
      }

      const workflowsMap: { [key: string]: Workflow } = {};
      response.data.forEach((workflow) => {
        workflowsMap[workflow.id] = workflow;
      });

      dispatch(WorkflowsActions.setWorkflows(workflowsMap));
      return 200;
    } catch (error) {
      console.error('Error loading workflows:', error);
      return 500;
    }
  };
};
