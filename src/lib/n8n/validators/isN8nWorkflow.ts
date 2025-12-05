import type { N8nWorkflow } from '../types';

/**
 * Validate that an object looks like an n8n workflow
 */
export function isN8nWorkflow(obj: unknown): obj is N8nWorkflow {
  if (!obj || typeof obj !== 'object') return false;
  
  const workflow = obj as Record<string, unknown>;
  
  if (!Array.isArray(workflow.nodes)) return false;
  if (typeof workflow.name !== 'string') return false;
  if (workflow.connections && typeof workflow.connections !== 'object') return false;
  
  return true;
}

