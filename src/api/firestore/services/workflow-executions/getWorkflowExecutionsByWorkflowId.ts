import { getDocumentsByField } from '../../retrievers/getDocumentsByField';
import { FIRESTORE_COLLECTIONS } from '../../types';
import { WorkflowExecution } from '@/model';

export const getWorkflowExecutionsByWorkflowId = async (workflowId: string) => {
  return await getDocumentsByField<WorkflowExecution>(
    FIRESTORE_COLLECTIONS.WORKFLOW_EXECUTIONS,
    'workflowId',
    workflowId
  );
};

