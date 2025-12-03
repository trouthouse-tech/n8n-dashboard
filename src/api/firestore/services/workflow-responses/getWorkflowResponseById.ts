import { getDocumentById } from '../../retrievers/getDocumentById';
import { FIRESTORE_COLLECTIONS } from '../../types';
import { WorkflowResponse } from '@/model';

export const getWorkflowResponseById = async (responseId: string) => {
  return await getDocumentById<WorkflowResponse>(FIRESTORE_COLLECTIONS.WORKFLOW_RESPONSES, responseId);
};

