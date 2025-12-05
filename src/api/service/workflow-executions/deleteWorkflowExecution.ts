import { WorkflowExecution } from '@/model';
import {
  STORAGE_KEYS,
  ApiResponse,
  HTTP_STATUS,
  getStorageData,
  setStorageData,
  createErrorResponse,
} from '@/lib/storage';

export const deleteWorkflowExecution = async (executionId: string): Promise<ApiResponse> => {
  try {
    const executionsMap =
      getStorageData<Record<string, WorkflowExecution>>(STORAGE_KEYS.WORKFLOW_EXECUTIONS) || {};

    if (!executionsMap[executionId]) {
      return createErrorResponse(
        'DOCUMENT_NOT_FOUND',
        `Execution with id ${executionId} does not exist`,
        HTTP_STATUS.NOT_FOUND
      );
    }

    delete executionsMap[executionId];

    const saved = setStorageData(STORAGE_KEYS.WORKFLOW_EXECUTIONS, executionsMap);

    if (!saved) {
      return createErrorResponse(
        'STORAGE_ERROR',
        'Failed to delete execution from localStorage',
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }

    return {
      success: true,
      statusCode: HTTP_STATUS.OK,
    };
  } catch (error) {
    return createErrorResponse(
      'INTERNAL_ERROR',
      'Failed to delete workflow execution',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

