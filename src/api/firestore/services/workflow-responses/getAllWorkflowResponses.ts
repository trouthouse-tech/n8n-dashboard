import { getDocuments } from '../../retrievers/getDocuments';
import { FIRESTORE_COLLECTIONS } from '../../types';
import { WorkflowResponse } from '@/model';

export const getAllWorkflowResponses = async () => {
  return await getDocuments<WorkflowResponse>(FIRESTORE_COLLECTIONS.WORKFLOW_RESPONSES);
};

