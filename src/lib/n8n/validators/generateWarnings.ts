import type { N8nWorkflow } from '../types';
import { findWebhooks } from '../extractors/webhook';

/**
 * Generate validation warnings for the workflow
 */
export function generateWarnings(workflow: N8nWorkflow): string[] {
  const warnings: string[] = [];
  
  if (workflow.nodes.length === 0) {
    warnings.push('Workflow has no nodes');
  }
  
  const webhooks = findWebhooks(workflow.nodes);
  if (webhooks.length === 0) {
    warnings.push('No webhook trigger found - workflow may not be triggerable via HTTP');
  }
  
  const disabledNodes = workflow.nodes.filter(n => n.disabled);
  if (disabledNodes.length > 0) {
    warnings.push(`${disabledNodes.length} node(s) are disabled`);
  }
  
  if (!workflow.active) {
    warnings.push('Workflow is not active in n8n');
  }
  
  return warnings;
}

