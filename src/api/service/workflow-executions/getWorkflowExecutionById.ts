import { WorkflowExecution } from '@/model';
import {
  STORAGE_KEYS,
  ApiResponse,
  HTTP_STATUS,
  getStorageData,
  createSuccessResponse,
  createErrorResponse,
} from '@/lib/storage';

export const getWorkflowExecutionById = async (
  executionId: string
): Promise<ApiResponse<WorkflowExecution | null>> => {
  try {
    const executionsMap =
      getStorageData<Record<string, WorkflowExecution>>(STORAGE_KEYS.WORKFLOW_EXECUTIONS) || {};
    const execution = executionsMap[executionId];

    if (!execution) {
      return createErrorResponse(
        'DOCUMENT_NOT_FOUND',
        `Execution with id ${executionId} does not exist`,
        HTTP_STATUS.NOT_FOUND
      );
    }

    return createSuccessResponse(execution);
  } catch (error) {
    return createErrorResponse(
      'INTERNAL_ERROR',
      'Failed to get workflow execution',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

