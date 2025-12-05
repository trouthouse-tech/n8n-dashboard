import type { ParsedWorkflow } from './types';
import { parseNodes } from './extractors/nodes';
import { parseConnections, generateFlowSummary } from './extractors/connections';
import { findWebhooks, getPrimaryWebhook } from './extractors/webhook';
import { extractParams } from './extractors/params';
import { extractAgents } from './extractors/agents';
import { extractModels } from './extractors/models';
import { extractCode } from './extractors/code';
import { extractHttp } from './extractors/http';
import { isN8nWorkflow, generateWarnings } from './validators';
import { createEmptyWorkflow } from './createEmptyWorkflow';

/**
 * Parse an n8n workflow JSON into our app's format
 */
export function parseN8nWorkflow(json: unknown): ParsedWorkflow {
  if (!isN8nWorkflow(json)) {
    return createEmptyWorkflow('Invalid Workflow', 'Invalid n8n workflow JSON format');
  }
  
  const { parsed: nodes, byCategory } = parseNodes(json.nodes);
  const connections = parseConnections(json.connections || {}, json.nodes);
  const flowSummary = generateFlowSummary(json.nodes, connections);
  const webhooks = findWebhooks(json.nodes);
  const primaryWebhook = getPrimaryWebhook(json.nodes);
  const detectedParams = extractParams(json.nodes);
  const agents = extractAgents(json.nodes);
  const models = extractModels(json.nodes);
  const codeNodes = extractCode(json.nodes);
  const httpNodes = extractHttp(json.nodes);
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
    agents,
    models,
    codeNodes,
    httpNodes,
    warnings,
    isValid: true,
  };
}
