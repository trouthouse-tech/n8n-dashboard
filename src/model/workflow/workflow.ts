export interface WorkflowBodyParam {
  id: string;
  key: string;
  value: string;
}

export interface Workflow {
  id: string;
  userId: string;
  name: string;
  description: string;
  webhookUrl: string;
  defaultBody: WorkflowBodyParam[];
  createdAt: string;
  updatedAt: string;
}

