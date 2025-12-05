import { WorkflowExecution, WorkflowBodyParam, ExecutionStatus } from '@/model';
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

export interface CreateWorkflowExecutionInput {
  userId: string;
  workflowId: string;
  responseId: string | null;
  requestUrl: string;
  requestBody: WorkflowBodyParam[];
  status: ExecutionStatus;
  errorMessage: string | null;
  executedAt: string;
}

export const createWorkflowExecution = async (
  input: CreateWorkflowExecutionInput
): Promise<ApiResponse<WorkflowExecution>> => {
  try {
    const id = generateId();

    const execution: WorkflowExecution = {
      id,
      ...input,
    };

    // Get existing executions
    const existingExecutions =
      getStorageData<Record<string, WorkflowExecution>>(STORAGE_KEYS.WORKFLOW_EXECUTIONS) || {};

    // Add new execution
    existingExecutions[id] = execution;

    const saved = setStorageData(STORAGE_KEYS.WORKFLOW_EXECUTIONS, existingExecutions);

    if (!saved) {
      return createErrorResponse(
        'STORAGE_ERROR',
        'Failed to save execution to localStorage',
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }

    return createSuccessResponse(execution, HTTP_STATUS.CREATED);
  } catch (error) {
    return createErrorResponse(
      'INTERNAL_ERROR',
      'Failed to create workflow execution',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

