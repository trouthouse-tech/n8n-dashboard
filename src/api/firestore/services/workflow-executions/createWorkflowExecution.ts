import { createDocument } from '../../mutators/createDocument';
import { FIRESTORE_COLLECTIONS } from '../../types';
import { WorkflowExecution, WorkflowBodyParam, ExecutionStatus } from '@/model';
import { generateFirebaseId } from '../../utils/generateFirebaseId';

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

export const createWorkflowExecution = async (input: CreateWorkflowExecutionInput) => {
  const id = generateFirebaseId(FIRESTORE_COLLECTIONS.WORKFLOW_EXECUTIONS);

  const execution: WorkflowExecution = {
    id,
    ...input,
  };

  return await createDocument(FIRESTORE_COLLECTIONS.WORKFLOW_EXECUTIONS, id, execution);
};
