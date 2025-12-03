import { createDocument } from '../../mutators/createDocument';
import { FIRESTORE_COLLECTIONS } from '../../types';
import { WorkflowResponse } from '@/model';
import { generateFirebaseId } from '../../utils/generateFirebaseId';

export interface CreateWorkflowResponseInput {
  userId: string;
  executionId: string;
  raw: string;
  receivedAt: string;
}

export const createWorkflowResponse = async (input: CreateWorkflowResponseInput) => {
  const id = generateFirebaseId(FIRESTORE_COLLECTIONS.WORKFLOW_RESPONSES);

  const response: WorkflowResponse = {
    id,
    ...input,
  };

  return await createDocument(FIRESTORE_COLLECTIONS.WORKFLOW_RESPONSES, id, response);
};
