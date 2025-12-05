import { WorkflowExecution } from '@/model';
import {
  STORAGE_KEYS,
  ApiResponse,
  HTTP_STATUS,
  getStorageData,
  createSuccessResponse,
  createErrorResponse,
} from '@/lib/storage';

export const getAllWorkflowExecutions = async (
  _userId: string
): Promise<ApiResponse<WorkflowExecution[]>> => {
  try {
    const executionsMap =
      getStorageData<Record<string, WorkflowExecution>>(STORAGE_KEYS.WORKFLOW_EXECUTIONS) || {};
    const executions = Object.values(executionsMap);

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

