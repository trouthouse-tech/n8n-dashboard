import { AppThunk } from '../../types';
import { WorkflowsActions } from '../../dumps';
import { Workflow } from '../../../model';

const STORAGE_KEY = 'n8n-workflows';

export const loadWorkflowsThunk = (): AppThunk<void> => {
  return (dispatch) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const workflows: { [key: string]: Workflow } = JSON.parse(stored);
        dispatch(WorkflowsActions.setWorkflows(workflows));
      }
    } catch (error) {
      console.error('Error loading workflows from localStorage:', error);
    }
  };
};

