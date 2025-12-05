import { WorkflowResponse } from '@/model';
import {
  STORAGE_KEYS,
  ApiResponse,
  HTTP_STATUS,
  getStorageData,
  setStorageData,
  createErrorResponse,
} from '@/lib/storage';

export const deleteWorkflowResponse = async (responseId: string): Promise<ApiResponse> => {
  try {
    const responsesMap =
      getStorageData<Record<string, WorkflowResponse>>(STORAGE_KEYS.WORKFLOW_RESPONSES) || {};

    if (!responsesMap[responseId]) {
      return createErrorResponse(
        'DOCUMENT_NOT_FOUND',
        `Response with id ${responseId} does not exist`,
        HTTP_STATUS.NOT_FOUND
      );
    }

    delete responsesMap[responseId];

    const saved = setStorageData(STORAGE_KEYS.WORKFLOW_RESPONSES, responsesMap);

    if (!saved) {
      return createErrorResponse(
        'STORAGE_ERROR',
        'Failed to delete response from localStorage',
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
      'Failed to delete workflow response',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

