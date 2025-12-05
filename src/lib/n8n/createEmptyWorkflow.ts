import type { ParsedWorkflow } from './types';

/**
 * Create an empty/error workflow with a message
 */
export function createEmptyWorkflow(name: string, warning: string): ParsedWorkflow {
  return {
    name,
    n8nId: null,
    isActive: false,
    nodes: [],
    nodeCount: 0,
    nodesByCategory: {
      trigger: [],
      logic: [],
      action: [],
      transform: [],
      unknown: [],
    },
    connections: [],
    flowSummary: warning,
    webhooks: [],
    primaryWebhook: null,
    detectedParams: [],
    agents: [],
    models: [],
    codeNodes: [],
    httpNodes: [],
    warnings: [warning],
    isValid: false,
  };
}

