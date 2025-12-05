import { Workflow } from '@/model';
import {
  STORAGE_KEYS,
  ApiResponse,
  HTTP_STATUS,
  getStorageData,
  setStorageData,
  createErrorResponse,
} from '@/lib/storage';

export const deleteWorkflow = async (workflowId: string): Promise<ApiResponse> => {
  try {
    const workflowsMap = getStorageData<Record<string, Workflow>>(STORAGE_KEYS.WORKFLOWS) || {};

    if (!workflowsMap[workflowId]) {
      return createErrorResponse(
        'DOCUMENT_NOT_FOUND',
        `Workflow with id ${workflowId} does not exist`,
        HTTP_STATUS.NOT_FOUND
      );
    }

    delete workflowsMap[workflowId];

    const saved = setStorageData(STORAGE_KEYS.WORKFLOWS, workflowsMap);

    if (!saved) {
      return createErrorResponse(
        'STORAGE_ERROR',
        'Failed to delete workflow from localStorage',
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
      'Failed to delete workflow',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

