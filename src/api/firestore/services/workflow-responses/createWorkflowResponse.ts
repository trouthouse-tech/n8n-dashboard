import { createDocument } from '../../mutators/createDocument';
import { FIRESTORE_COLLECTIONS } from '../../types';
import { WorkflowResponse } from '@/model';
import { generateFirebaseId } from '../../utils/generateFirebaseId';

export const createWorkflowResponse = async (
  responseData: Omit<WorkflowResponse, 'id'>
) => {
  const id = generateFirebaseId(FIRESTORE_COLLECTIONS.WORKFLOW_RESPONSES);

  const response: WorkflowResponse = {
    id,
    executionId: responseData.executionId,
    raw: responseData.raw,
    receivedAt: responseData.receivedAt,
  };

  return await createDocument(FIRESTORE_COLLECTIONS.WORKFLOW_RESPONSES, id, response);
};

