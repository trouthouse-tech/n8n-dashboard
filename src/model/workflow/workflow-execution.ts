import { WorkflowBodyParam } from './workflow';

export type ExecutionStatus = 'pending' | 'success' | 'error';

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  responseId: string | null;
  requestUrl: string;
  requestBody: WorkflowBodyParam[];
  status: ExecutionStatus;
  errorMessage: string | null;
  executedAt: string;
}

