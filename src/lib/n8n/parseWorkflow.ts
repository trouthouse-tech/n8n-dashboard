import type { N8nWorkflow, ParsedWorkflow, DetectedParam } from './types';
import { parseNodes } from './extractors/nodes';
import { parseConnections, generateFlowSummary } from './extractors/connections';
import { findWebhooks, getPrimaryWebhook } from './extractors/webhook';

/**
 * Validate that an object looks like an n8n workflow
 */
export function isN8nWorkflow(obj: unknown): obj is N8nWorkflow {
  if (!obj || typeof obj !== 'object') return false;
  
  const workflow = obj as Record<string, unknown>;
  
  // Must have nodes array
  if (!Array.isArray(workflow.nodes)) return false;
  
  // Must have name (string)
  if (typeof workflow.name !== 'string') return false;
  
  // Connections should be an object (can be empty)
  if (workflow.connections && typeof workflow.connections !== 'object') return false;
  
  return true;
}

/**
 * Detect required parameters from If/Switch node conditions
 * This is a basic implementation - can be expanded for more complex patterns
 */
function detectRequiredParams(workflow: N8nWorkflow): DetectedParam[] {
  const params: DetectedParam[] = [];
  const seenKeys = new Set<string>();
  
  for (const node of workflow.nodes) {
    // Check If nodes
    if (node.type.includes('.if')) {
      const conditions = node.parameters?.conditions as {
        conditions?: Array<{
          leftValue?: string;
          rightValue?: string;
        }>;
      } | undefined;
      
      if (conditions?.conditions) {
        for (const condition of conditions.conditions) {
          // Look for body parameter references like {{ $json.body.paramName }}
          const leftValue = condition.leftValue || '';
          const match = leftValue.match(/\$json\.body\.(\w+)/);
          
          if (match && match[1] && !seenKeys.has(match[1])) {
            seenKeys.add(match[1]);
            params.push({
              key: match[1],
              source: node.name,
              expression: leftValue,
            });
          }
        }
      }
    }
  }
  
  return params;
}

/**
 * Generate validation warnings for the workflow
 */
function generateWarnings(workflow: N8nWorkflow): string[] {
  const warnings: string[] = [];
  
  // Check for empty workflow
  if (workflow.nodes.length === 0) {
    warnings.push('Workflow has no nodes');
  }
  
  // Check for webhook trigger
  const webhooks = findWebhooks(workflow.nodes);
  if (webhooks.length === 0) {
    warnings.push('No webhook trigger found - workflow may not be triggerable via HTTP');
  }
  
  // Check for disabled nodes
  const disabledNodes = workflow.nodes.filter(n => n.disabled);
  if (disabledNodes.length > 0) {
    warnings.push(`${disabledNodes.length} node(s) are disabled`);
  }
  
  // Check if workflow is inactive
  if (!workflow.active) {
    warnings.push('Workflow is not active in n8n');
  }
  
  return warnings;
}

/**
 * Parse an n8n workflow JSON into our app's format
 */
export function parseN8nWorkflow(json: unknown): ParsedWorkflow {
  // Validate input
  if (!isN8nWorkflow(json)) {
    return {
      name: 'Invalid Workflow',
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
      flowSummary: 'Invalid workflow JSON',
      webhooks: [],
      primaryWebhook: null,
      detectedParams: [],
      warnings: ['Invalid n8n workflow JSON format'],
      isValid: false,
    };
  }
  
  // Parse nodes
  const { parsed: nodes, byCategory } = parseNodes(json.nodes);
  
  // Parse connections
  const connections = parseConnections(json.connections || {}, json.nodes);
  const flowSummary = generateFlowSummary(json.nodes, connections);
  
  // Find webhooks
  const webhooks = findWebhooks(json.nodes);
  const primaryWebhook = getPrimaryWebhook(json.nodes);
  
  // Detect required params
  const detectedParams = detectRequiredParams(json);
  
  // Generate warnings
  const warnings = generateWarnings(json);
  
  return {
    name: json.name,
    n8nId: json.id || null,
    isActive: json.active,
    nodes,
    nodeCount: nodes.length,
    nodesByCategory: byCategory,
    connections,
    flowSummary,
    webhooks,
    primaryWebhook,
    detectedParams,
    warnings,
    isValid: true,
  };
}

/**
 * Parse a JSON string into a workflow
 */
export function parseN8nWorkflowFromString(jsonString: string): ParsedWorkflow {
  try {
    const json = JSON.parse(jsonString);
    return parseN8nWorkflow(json);
  } catch (error) {
    return {
      name: 'Parse Error',
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
      flowSummary: 'Failed to parse JSON',
      webhooks: [],
      primaryWebhook: null,
      detectedParams: [],
      warnings: [`JSON parse error: ${error instanceof Error ? error.message : 'Unknown error'}`],
      isValid: false,
    };
  }
}

