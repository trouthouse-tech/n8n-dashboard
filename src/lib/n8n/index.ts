// Types
export type {
  N8nWorkflow,
  N8nNode,
  N8nConnections,
  N8nConnectionTarget,
  ParsedWorkflow,
  ParsedNode,
  ParsedConnection,
  ParsedWebhook,
  DetectedParam,
  DetectedAgent,
  DetectedModel,
  DetectedCode,
  DetectedHttp,
  NodeCategory,
} from './types';

// Main parsers
export { parseN8nWorkflow } from './parseWorkflow';
export { parseN8nWorkflowFromString } from './parseWorkflowFromString';
export { createEmptyWorkflow } from './createEmptyWorkflow';

// Validators
export { isN8nWorkflow, generateWarnings } from './validators';

// Node extractors
export {
  parseNode,
  parseNodes,
  getShortType,
  categorizeNode,
  getCategoryLabel,
  getCategoryColor,
} from './extractors/nodes';

// Connection extractors
export {
  parseConnections,
  buildAdjacencyList,
  findEntryNodes,
  generateFlowSummary,
  getWorkflowDepth,
} from './extractors/connections';

// Webhook extractors
export {
  isWebhookNode,
  extractWebhookInfo,
  findWebhooks,
  getPrimaryWebhook,
  buildWebhookUrl,
} from './extractors/webhook';

// Dynamic data extractors
export { extractParams } from './extractors/params';
export { extractAgents } from './extractors/agents';
export { extractModels } from './extractors/models';
export { extractCode } from './extractors/code';
export { extractHttp } from './extractors/http';
export { extractPathSteps } from './extractors/pathSteps';
