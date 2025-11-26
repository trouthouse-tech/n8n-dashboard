import { AppThunk } from '../../types';
import { WorkflowsActions } from '../../dumps';
import { Workflow } from '../../../model';

const STORAGE_KEY = 'n8n-workflows';

export const saveWorkflowThunk = (workflow: Workflow): AppThunk<void> => {
  return (dispatch, getState) => {
    try {
      const isNew = !workflow.id || !getState().workflows[workflow.id];
      const now = new Date().toISOString();

      const workflowToSave: Workflow = {
        ...workflow,
        id: workflow.id || crypto.randomUUID(),
        createdAt: isNew ? now : workflow.createdAt,
        updatedAt: now,
      };

      if (isNew) {
        dispatch(WorkflowsActions.addWorkflow(workflowToSave));
      } else {
        dispatch(WorkflowsActions.updateWorkflow(workflowToSave));
      }

      // Persist to localStorage
      const workflows = getState().workflows;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(workflows));
    } catch (error) {
      console.error('Error saving workflow:', error);
    }
  };
};

