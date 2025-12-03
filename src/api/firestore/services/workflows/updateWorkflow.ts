import { updateDocument } from '../../mutators/updateDocument';
import { FIRESTORE_COLLECTIONS } from '../../types';
import { Workflow } from '@/model';

export const updateWorkflow = async (
  workflowId: string,
  updates: Partial<Omit<Workflow, 'id' | 'createdAt'>>
) => {
  return await updateDocument<Workflow>(FIRESTORE_COLLECTIONS.WORKFLOWS, workflowId, updates);
};

