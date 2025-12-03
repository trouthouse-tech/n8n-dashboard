import { AppThunk } from '../../types';
import { CurrentWorkflowExecutionActions } from '../../current';

type ResponseType = Promise<200 | 404 | 500>;

export const setCurrentWorkflowExecutionThunk = (
  executionId: string
): AppThunk<ResponseType> => {
  return async (dispatch, getState): ResponseType => {
    try {
      const execution = getState().workflowExecutions[executionId];

      if (!execution) {
        console.error('Execution not found:', executionId);
        return 404;
      }

      dispatch(CurrentWorkflowExecutionActions.setWorkflowExecution(execution));
      return 200;
    } catch (error) {
      console.error('Error setting current execution:', error);
      return 500;
    }
  };
};

