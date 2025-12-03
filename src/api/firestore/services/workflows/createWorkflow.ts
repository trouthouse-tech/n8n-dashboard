import { createDocument } from '../../mutators/createDocument';
import { FIRESTORE_COLLECTIONS } from '../../types';
import { Workflow, WorkflowBodyParam } from '@/model';
import { generateFirebaseId } from '../../utils/generateFirebaseId';

export interface CreateWorkflowInput {
  userId: string;
  name: string;
  description: string;
  webhookUrl: string;
  defaultBody: WorkflowBodyParam[];
}

export const createWorkflow = async (input: CreateWorkflowInput) => {
  const id = generateFirebaseId(FIRESTORE_COLLECTIONS.WORKFLOWS);

  const workflow: Omit<Workflow, 'createdAt' | 'updatedAt'> = {
    id,
    ...input,
  };

  return await createDocument(FIRESTORE_COLLECTIONS.WORKFLOWS, id, workflow);
};
