export interface WorkflowBodyParam {
  id: string;
  key: string;
  value: string;
}

export interface WorkflowAgentPrompt {
  id: string;
  nodeId: string;
  nodeName: string;
  userPrompt: string;
  systemPrompt: string;
}

export type WorkflowPathStepType = 'input' | 'agent' | 'output' | 'trigger';

export interface WorkflowPathStep {
  id: string;
  type: WorkflowPathStepType;
  label: string;
  nodeId?: string;
  outputType?: string;
}

export interface Workflow {
  id: string;
  userId?: string;
  name: string;
  description: string;
  webhookUrl: string;
  defaultBody: WorkflowBodyParam[];
  agentPrompts: WorkflowAgentPrompt[];
  pathSteps: WorkflowPathStep[];
  createdAt: string;
  updatedAt: string;
}

