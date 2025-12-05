import { WorkflowResponse } from '@/model';
import {
  STORAGE_KEYS,
  ApiResponse,
  HTTP_STATUS,
  getStorageData,
  createSuccessResponse,
  createErrorResponse,
} from '@/lib/storage';

export const getAllWorkflowResponses = async (
  _userId: string
): Promise<ApiResponse<WorkflowResponse[]>> => {
  try {
    const responsesMap =
      getStorageData<Record<string, WorkflowResponse>>(STORAGE_KEYS.WORKFLOW_RESPONSES) || {};
    const responses = Object.values(responsesMap);

    return createSuccessResponse(responses);
  } catch (error) {
    return createErrorResponse(
      'INTERNAL_ERROR',
      'Failed to get workflow responses',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

