import { AppThunk } from '../../types';
import { WorkflowsActions } from '../../dumps';

const STORAGE_KEY = 'n8n-workflows';

export const deleteWorkflowThunk = (workflowId: string): AppThunk<void> => {
  return (dispatch, getState) => {
    try {
      dispatch(WorkflowsActions.deleteWorkflow(workflowId));

      // Persist to localStorage
      const workflows = getState().workflows;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(workflows));
    } catch (error) {
      console.error('Error deleting workflow:', error);
    }
  };
};

