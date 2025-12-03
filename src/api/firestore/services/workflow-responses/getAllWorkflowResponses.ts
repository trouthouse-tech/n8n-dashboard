import { getDocumentsByField } from '../../retrievers/getDocumentsByField';
import { FIRESTORE_COLLECTIONS } from '../../types';
import { WorkflowResponse } from '@/model';

export const getAllWorkflowResponses = async (userId: string) => {
  return await getDocumentsByField<WorkflowResponse>(FIRESTORE_COLLECTIONS.WORKFLOW_RESPONSES, 'userId', userId);
};

