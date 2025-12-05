import { Workflow } from '@/model';
import {
  STORAGE_KEYS,
  ApiResponse,
  getStorageData,
  createSuccessResponse,
  createErrorResponse,
  HTTP_STATUS,
} from '@/lib/storage';

export const getAllWorkflows = async (_userId: string): Promise<ApiResponse<Workflow[]>> => {
  try {
    const workflowsMap = getStorageData<Record<string, Workflow>>(STORAGE_KEYS.WORKFLOWS) || {};
    const workflows = Object.values(workflowsMap);

    return createSuccessResponse(workflows);
  } catch (error) {
    return createErrorResponse(
      'INTERNAL_ERROR',
      'Failed to get workflows',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

