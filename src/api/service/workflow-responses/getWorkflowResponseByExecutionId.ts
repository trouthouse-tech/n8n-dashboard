import { WorkflowResponse } from '@/model';
import {
  STORAGE_KEYS,
  ApiResponse,
  getStorageData,
  createSuccessResponse,
  createErrorResponse,
  HTTP_STATUS,
} from '@/lib/storage';

export const getWorkflowResponseByExecutionId = async (
  executionId: string
): Promise<ApiResponse<WorkflowResponse | null>> => {
  try {
    const responsesMap =
      getStorageData<Record<string, WorkflowResponse>>(STORAGE_KEYS.WORKFLOW_RESPONSES) || {};
    const responses = Object.values(responsesMap);

    // Return the first response found (there should only be one per execution)
    const response = responses.find((r) => r.executionId === executionId) || null;

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

