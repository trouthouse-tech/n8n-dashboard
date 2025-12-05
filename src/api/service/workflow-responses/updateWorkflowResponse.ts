import { WorkflowResponse } from '@/model';
import {
  STORAGE_KEYS,
  ApiResponse,
  HTTP_STATUS,
  getStorageData,
  setStorageData,
  createSuccessResponse,
  createErrorResponse,
} from '@/lib/storage';

export const updateWorkflowResponse = async (
  responseId: string,
  updates: Partial<Omit<WorkflowResponse, 'id'>>
): Promise<ApiResponse<WorkflowResponse>> => {
  try {
    const responsesMap =
      getStorageData<Record<string, WorkflowResponse>>(STORAGE_KEYS.WORKFLOW_RESPONSES) || {};
    const existingResponse = responsesMap[responseId];

    if (!existingResponse) {
      return createErrorResponse(
        'DOCUMENT_NOT_FOUND',
        `Response with id ${responseId} does not exist`,
        HTTP_STATUS.NOT_FOUND
      );
    }

    const updatedResponse: WorkflowResponse = {
      ...existingResponse,
      ...updates,
    };

    responsesMap[responseId] = updatedResponse;

    const saved = setStorageData(STORAGE_KEYS.WORKFLOW_RESPONSES, responsesMap);

    if (!saved) {
      return createErrorResponse(
        'STORAGE_ERROR',
        'Failed to update response in localStorage',
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }

    return createSuccessResponse(updatedResponse);
  } catch (error) {
    return createErrorResponse(
      'INTERNAL_ERROR',
      'Failed to update workflow response',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

