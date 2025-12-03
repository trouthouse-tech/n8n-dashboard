import { getDocumentById } from '../../retrievers/getDocumentById';
import { FIRESTORE_COLLECTIONS } from '../../types';
import { Workflow } from '@/model';

export const getWorkflowById = async (workflowId: string) => {
  return await getDocumentById<Workflow>(FIRESTORE_COLLECTIONS.WORKFLOWS, workflowId);
};

