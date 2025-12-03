import { getDocuments } from '../../retrievers/getDocuments';
import { FIRESTORE_COLLECTIONS } from '../../types';
import { Workflow } from '@/model';

export const getAllWorkflows = async () => {
  return await getDocuments<Workflow>(FIRESTORE_COLLECTIONS.WORKFLOWS);
};

