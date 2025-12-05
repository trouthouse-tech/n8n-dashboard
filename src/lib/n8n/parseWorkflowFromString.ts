import type { ParsedWorkflow } from './types';
import { parseN8nWorkflow } from './parseWorkflow';
import { createEmptyWorkflow } from './createEmptyWorkflow';

/**
 * Parse a JSON string into a workflow
 */
export function parseN8nWorkflowFromString(jsonString: string): ParsedWorkflow {
  try {
    const json = JSON.parse(jsonString);
    return parseN8nWorkflow(json);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return createEmptyWorkflow('Parse Error', `JSON parse error: ${message}`);
  }
}

