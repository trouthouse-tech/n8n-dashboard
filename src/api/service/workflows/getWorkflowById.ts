import { Workflow } from '@/model';
import {
  STORAGE_KEYS,
  ApiResponse,
  HTTP_STATUS,
  getStorageData,
  createSuccessResponse,
  createErrorResponse,
} from '@/lib/storage';

export const getWorkflowById = async (
  workflowId: string
): Promise<ApiResponse<Workflow | null>> => {
  try {
    const workflowsMap = getStorageData<Record<string, Workflow>>(STORAGE_KEYS.WORKFLOWS) || {};
    const workflow = workflowsMap[workflowId];

    if (!workflow) {
      return createErrorResponse(
        'DOCUMENT_NOT_FOUND',
        `Workflow with id ${workflowId} does not exist`,
        HTTP_STATUS.NOT_FOUND
      );
    }

    return createSuccessResponse(workflow);
  } catch (error) {
    return createErrorResponse(
      'INTERNAL_ERROR',
      'Failed to get workflow',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

