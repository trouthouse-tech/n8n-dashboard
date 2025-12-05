import { WorkflowResponse } from '@/model';
import {
  STORAGE_KEYS,
  ApiResponse,
  HTTP_STATUS,
  getStorageData,
  setStorageData,
  createSuccessResponse,
  createErrorResponse,
  generateId,
} from '@/lib/storage';

export interface CreateWorkflowResponseInput {
  userId: string;
  executionId: string;
  raw: string;
  receivedAt: string;
}

export const createWorkflowResponse = async (
  input: CreateWorkflowResponseInput
): Promise<ApiResponse<WorkflowResponse>> => {
  try {
    const id = generateId();

    const response: WorkflowResponse = {
      id,
      ...input,
    };

    // Get existing responses
    const existingResponses =
      getStorageData<Record<string, WorkflowResponse>>(STORAGE_KEYS.WORKFLOW_RESPONSES) || {};

    // Add new response
    existingResponses[id] = response;

    const saved = setStorageData(STORAGE_KEYS.WORKFLOW_RESPONSES, existingResponses);

    if (!saved) {
      return createErrorResponse(
        'STORAGE_ERROR',
        'Failed to save response to localStorage',
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }

    return createSuccessResponse(response, HTTP_STATUS.CREATED);
  } catch (error) {
    return createErrorResponse(
      'INTERNAL_ERROR',
      'Failed to create workflow response',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

