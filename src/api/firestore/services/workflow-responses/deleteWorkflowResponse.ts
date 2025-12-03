import { deleteDocument } from '../../mutators/deleteDocument';
import { FIRESTORE_COLLECTIONS } from '../../types';

export const deleteWorkflowResponse = async (responseId: string) => {
  return await deleteDocument(FIRESTORE_COLLECTIONS.WORKFLOW_RESPONSES, responseId);
};

