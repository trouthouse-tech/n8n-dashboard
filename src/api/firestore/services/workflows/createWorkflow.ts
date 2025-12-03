import { createDocument } from '../../mutators/createDocument';
import { FIRESTORE_COLLECTIONS } from '../../types';
import { Workflow } from '@/model';
import { generateFirebaseId } from '../../utils/generateFirebaseId';

export const createWorkflow = async (
  workflowData: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'>
) => {
  const id = generateFirebaseId(FIRESTORE_COLLECTIONS.WORKFLOWS);

  const workflow: Omit<Workflow, 'createdAt' | 'updatedAt'> = {
    id,
    name: workflowData.name,
    description: workflowData.description,
    webhookUrl: workflowData.webhookUrl,
    defaultBody: workflowData.defaultBody,
  };

  return await createDocument(FIRESTORE_COLLECTIONS.WORKFLOWS, id, workflow);
};

