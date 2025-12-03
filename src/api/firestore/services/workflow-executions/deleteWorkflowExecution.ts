import { deleteDocument } from '../../mutators/deleteDocument';
import { FIRESTORE_COLLECTIONS } from '../../types';

export const deleteWorkflowExecution = async (executionId: string) => {
  return await deleteDocument(FIRESTORE_COLLECTIONS.WORKFLOW_EXECUTIONS, executionId);
};

