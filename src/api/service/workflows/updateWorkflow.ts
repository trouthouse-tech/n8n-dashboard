import { Workflow } from '@/model';
import {
  STORAGE_KEYS,
  ApiResponse,
  HTTP_STATUS,
  getStorageData,
  setStorageData,
  createSuccessResponse,
  createErrorResponse,
  getTimestamp,
} from '@/lib/storage';

export const updateWorkflow = async (
  workflowId: string,
  updates: Partial<Omit<Workflow, 'id' | 'createdAt'>>
): Promise<ApiResponse<Workflow>> => {
  try {
    const workflowsMap = getStorageData<Record<string, Workflow>>(STORAGE_KEYS.WORKFLOWS) || {};
    const existingWorkflow = workflowsMap[workflowId];

    if (!existingWorkflow) {
      return createErrorResponse(
        'DOCUMENT_NOT_FOUND',
        `Workflow with id ${workflowId} does not exist`,
        HTTP_STATUS.NOT_FOUND
      );
    }

    const updatedWorkflow: Workflow = {
      ...existingWorkflow,
      ...updates,
      updatedAt: getTimestamp(),
    };

    workflowsMap[workflowId] = updatedWorkflow;

    const saved = setStorageData(STORAGE_KEYS.WORKFLOWS, workflowsMap);

    if (!saved) {
      return createErrorResponse(
        'STORAGE_ERROR',
        'Failed to update workflow in localStorage',
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }

    return createSuccessResponse(updatedWorkflow);
  } catch (error) {
    return createErrorResponse(
      'INTERNAL_ERROR',
      'Failed to update workflow',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

