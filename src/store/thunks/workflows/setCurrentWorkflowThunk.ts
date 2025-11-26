import { AppThunk } from '../../types';
import { CurrentWorkflowActions } from '../../current';

export const setCurrentWorkflowThunk = (workflowId: string): AppThunk<void> => {
  return (dispatch, getState) => {
    const workflow = getState().workflows[workflowId];
    if (workflow) {
      dispatch(CurrentWorkflowActions.setWorkflow(workflow));
    }
  };
};

