import { deleteDocument } from '../../mutators/deleteDocument';
import { FIRESTORE_COLLECTIONS } from '../../types';

export const deleteWorkflow = async (workflowId: string) => {
  return await deleteDocument(FIRESTORE_COLLECTIONS.WORKFLOWS, workflowId);
};

