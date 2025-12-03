import { getDocumentById } from '../../retrievers/getDocumentById';
import { FIRESTORE_COLLECTIONS } from '../../types';
import { WorkflowExecution } from '@/model';

export const getWorkflowExecutionById = async (executionId: string) => {
  return await getDocumentById<WorkflowExecution>(FIRESTORE_COLLECTIONS.WORKFLOW_EXECUTIONS, executionId);
};

