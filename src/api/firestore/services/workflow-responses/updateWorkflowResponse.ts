import { updateDocument } from '../../mutators/updateDocument';
import { FIRESTORE_COLLECTIONS } from '../../types';
import { WorkflowResponse } from '@/model';

export const updateWorkflowResponse = async (
  responseId: string,
  updates: Partial<Omit<WorkflowResponse, 'id'>>
) => {
  return await updateDocument<WorkflowResponse>(
    FIRESTORE_COLLECTIONS.WORKFLOW_RESPONSES,
    responseId,
    updates
  );
};

