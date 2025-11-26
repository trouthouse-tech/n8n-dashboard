import { AppThunk } from '../../types';
import { WorkflowExecutionsActions, WorkflowResponsesActions } from '../../dumps';
import { WorkflowExecution, WorkflowResponse } from '../../../model';

const EXECUTIONS_STORAGE_KEY = 'n8n-workflow-executions';
const RESPONSES_STORAGE_KEY = 'n8n-workflow-responses';

export const loadExecutionsThunk = (): AppThunk<void> => {
  return (dispatch) => {
    try {
      const storedExecutions = localStorage.getItem(EXECUTIONS_STORAGE_KEY);
      if (storedExecutions) {
        const executions: { [key: string]: WorkflowExecution } =
          JSON.parse(storedExecutions);
        dispatch(WorkflowExecutionsActions.setWorkflowExecutions(executions));
      }

      const storedResponses = localStorage.getItem(RESPONSES_STORAGE_KEY);
      if (storedResponses) {
        const responses: { [key: string]: WorkflowResponse } =
          JSON.parse(storedResponses);
        dispatch(WorkflowResponsesActions.setWorkflowResponses(responses));
      }
    } catch (error) {
      console.error('Error loading executions from localStorage:', error);
    }
  };
};

