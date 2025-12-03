import { AppThunk } from '../../types';
import { WorkflowExecutionsActions, WorkflowResponsesActions } from '../../dumps';
import { WorkflowExecution, WorkflowResponse } from '@/model';
import { getAllWorkflowExecutions, getAllWorkflowResponses } from '@/api';

type ResponseType = Promise<200 | 400 | 500>;

export const loadExecutionsThunk = (): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      // Load executions
      const executionsResponse = await getAllWorkflowExecutions();

      if (!executionsResponse.success || !executionsResponse.data) {
        console.error('Failed to load executions:', executionsResponse.error);
        return 400;
      }

      const executionsMap: { [key: string]: WorkflowExecution } = {};
      executionsResponse.data.forEach((execution) => {
        executionsMap[execution.id] = execution;
      });

      dispatch(WorkflowExecutionsActions.setWorkflowExecutions(executionsMap));

      // Load responses
      const responsesResponse = await getAllWorkflowResponses();

      if (!responsesResponse.success || !responsesResponse.data) {
        console.error('Failed to load responses:', responsesResponse.error);
        return 400;
      }

      const responsesMap: { [key: string]: WorkflowResponse } = {};
      responsesResponse.data.forEach((response) => {
        responsesMap[response.id] = response;
      });

      dispatch(WorkflowResponsesActions.setWorkflowResponses(responsesMap));

      return 200;
    } catch (error) {
      console.error('Error loading executions:', error);
      return 500;
    }
  };
};
