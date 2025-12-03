import { getDocuments } from '../../retrievers/getDocuments';
import { FIRESTORE_COLLECTIONS } from '../../types';
import { WorkflowExecution } from '@/model';

export const getAllWorkflowExecutions = async () => {
  return await getDocuments<WorkflowExecution>(FIRESTORE_COLLECTIONS.WORKFLOW_EXECUTIONS);
};

