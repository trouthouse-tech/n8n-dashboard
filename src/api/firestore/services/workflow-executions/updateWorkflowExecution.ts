import { updateDocument } from '../../mutators/updateDocument';
import { FIRESTORE_COLLECTIONS } from '../../types';
import { WorkflowExecution } from '@/model';

export const updateWorkflowExecution = async (
  executionId: string,
  updates: Partial<Omit<WorkflowExecution, 'id'>>
) => {
  return await updateDocument<WorkflowExecution>(
    FIRESTORE_COLLECTIONS.WORKFLOW_EXECUTIONS,
    executionId,
    updates
  );
};

