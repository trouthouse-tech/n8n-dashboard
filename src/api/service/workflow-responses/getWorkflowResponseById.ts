import { WorkflowResponse } from '@/model';
import {
  STORAGE_KEYS,
  ApiResponse,
  HTTP_STATUS,
  getStorageData,
  createSuccessResponse,
  createErrorResponse,
} from '@/lib/storage';

export const getWorkflowResponseById = async (
  responseId: string
): Promise<ApiResponse<WorkflowResponse | null>> => {
  try {
    const responsesMap =
      getStorageData<Record<string, WorkflowResponse>>(STORAGE_KEYS.WORKFLOW_RESPONSES) || {};
    const response = responsesMap[responseId];

    if (!response) {
      return createErrorResponse(
        'DOCUMENT_NOT_FOUND',
        `Response with id ${responseId} does not exist`,
        HTTP_STATUS.NOT_FOUND
      );
    }

    return createSuccessResponse(response);
  } catch (error) {
    return createErrorResponse(
      'INTERNAL_ERROR',
      'Failed to get workflow response',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

