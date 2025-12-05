import { WorkflowExecution } from '@/model';
import {
  STORAGE_KEYS,
  ApiResponse,
  HTTP_STATUS,
  getStorageData,
  setStorageData,
  createSuccessResponse,
  createErrorResponse,
} from '@/lib/storage';

export const updateWorkflowExecution = async (
  executionId: string,
  updates: Partial<Omit<WorkflowExecution, 'id'>>
): Promise<ApiResponse<WorkflowExecution>> => {
  try {
    const executionsMap =
      getStorageData<Record<string, WorkflowExecution>>(STORAGE_KEYS.WORKFLOW_EXECUTIONS) || {};
    const existingExecution = executionsMap[executionId];

    if (!existingExecution) {
      return createErrorResponse(
        'DOCUMENT_NOT_FOUND',
        `Execution with id ${executionId} does not exist`,
        HTTP_STATUS.NOT_FOUND
      );
    }

    const updatedExecution: WorkflowExecution = {
      ...existingExecution,
      ...updates,
    };

    executionsMap[executionId] = updatedExecution;

    const saved = setStorageData(STORAGE_KEYS.WORKFLOW_EXECUTIONS, executionsMap);

    if (!saved) {
      return createErrorResponse(
        'STORAGE_ERROR',
        'Failed to update execution in localStorage',
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }

    return createSuccessResponse(updatedExecution);
  } catch (error) {
    return createErrorResponse(
      'INTERNAL_ERROR',
      'Failed to update workflow execution',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

