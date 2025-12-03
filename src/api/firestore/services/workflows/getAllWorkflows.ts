import { getDocumentsByField } from '../../retrievers/getDocumentsByField';
import { FIRESTORE_COLLECTIONS } from '../../types';
import { Workflow } from '@/model';

export const getAllWorkflows = async (userId: string) => {
  return await getDocumentsByField<Workflow>(FIRESTORE_COLLECTIONS.WORKFLOWS, 'userId', userId);
};

