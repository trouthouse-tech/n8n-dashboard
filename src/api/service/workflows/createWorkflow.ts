import { Workflow, WorkflowBodyParam, WorkflowAgentPrompt, WorkflowPathStep } from '@/model';
import {
  STORAGE_KEYS,
  ApiResponse,
  HTTP_STATUS,
  getStorageData,
  setStorageData,
  createSuccessResponse,
  createErrorResponse,
  generateId,
  getTimestamp,
} from '@/lib/storage';

export interface CreateWorkflowInput {
  userId: string;
  name: string;
  description: string;
  webhookUrl: string;
  defaultBody: WorkflowBodyParam[];
  agentPrompts: WorkflowAgentPrompt[];
  pathSteps: WorkflowPathStep[];
}

export const createWorkflow = async (
  input: CreateWorkflowInput
): Promise<ApiResponse<Workflow>> => {
  try {
    const id = generateId();
    const now = getTimestamp();

    const workflow: Workflow = {
      id,
      ...input,
      createdAt: now,
      updatedAt: now,
    };

    // Get existing workflows
    const existingWorkflows = getStorageData<Record<string, Workflow>>(STORAGE_KEYS.WORKFLOWS) || {};
    
    // Add new workflow
    existingWorkflows[id] = workflow;

    const saved = setStorageData(STORAGE_KEYS.WORKFLOWS, existingWorkflows);

    if (!saved) {
      return createErrorResponse(
        'STORAGE_ERROR',
        'Failed to save workflow to localStorage',
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }

    return createSuccessResponse(workflow, HTTP_STATUS.CREATED);
  } catch (error) {
    return createErrorResponse(
      'INTERNAL_ERROR',
      'Failed to create workflow',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

