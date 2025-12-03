import { createDocument } from '../../mutators/createDocument';
import { FIRESTORE_COLLECTIONS } from '../../types';
import { WorkflowExecution } from '@/model';
import { generateFirebaseId } from '../../utils/generateFirebaseId';

export const createWorkflowExecution = async (
  executionData: Omit<WorkflowExecution, 'id'>
) => {
  const id = generateFirebaseId(FIRESTORE_COLLECTIONS.WORKFLOW_EXECUTIONS);

  const execution: WorkflowExecution = {
    id,
    workflowId: executionData.workflowId,
    responseId: executionData.responseId,
    requestUrl: executionData.requestUrl,
    requestBody: executionData.requestBody,
    status: executionData.status,
    errorMessage: executionData.errorMessage,
    executedAt: executionData.executedAt,
  };

  return await createDocument(FIRESTORE_COLLECTIONS.WORKFLOW_EXECUTIONS, id, execution);
};

