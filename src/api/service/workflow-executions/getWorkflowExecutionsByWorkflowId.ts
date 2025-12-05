import { WorkflowExecution } from '@/model';
import {
  STORAGE_KEYS,
  ApiResponse,
  HTTP_STATUS,
  getStorageData,
  createSuccessResponse,
  createErrorResponse,
} from '@/lib/storage';

export const getWorkflowExecutionsByWorkflowId = async (
  workflowId: string
): Promise<ApiResponse<WorkflowExecution[]>> => {
  try {
    const executionsMap =
      getStorageData<Record<string, WorkflowExecution>>(STORAGE_KEYS.WORKFLOW_EXECUTIONS) || {};
    const executions = Object.values(executionsMap).filter(
      (execution) => execution.workflowId === workflowId
    );

    return createSuccessResponse(executions);
  } catch (error) {
    return createErrorResponse(
      'INTERNAL_ERROR',
      'Failed to get workflow executions',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

