import type { N8nNode, ParsedNode, NodeCategory } from '../types';

/**
 * Known trigger node types that start workflows
 */
const TRIGGER_TYPES = new Set([
  'webhook',
  'schedule',
  'cron',
  'manualTrigger',
  'emailTrigger',
  'formTrigger',
  'chatTrigger',
]);

/**
 * Known logic/flow control node types
 */
const LOGIC_TYPES = new Set([
  'if',
  'switch',
  'merge',
  'splitInBatches',
  'wait',
  'filter',
  'removeDuplicates',
  'limit',
  'sort',
  'compareDatasets',
]);

/**
 * Known transform/data manipulation node types
 */
const TRANSFORM_TYPES = new Set([
  'set',
  'function',
  'functionItem',
  'code',
  'itemLists',
  'spreadsheetFile',
  'xml',
  'html',
  'markdown',
  'crypto',
  'dateTime',
  'renameKeys',
]);

/**
 * Extract the short type name from full n8n type
 * e.g., "n8n-nodes-base.webhook" → "webhook"
 */
export function getShortType(fullType: string): string {
  const parts = fullType.split('.');
  return parts[parts.length - 1] || fullType;
}

/**
 * Categorize a node based on its type
 */
export function categorizeNode(shortType: string): NodeCategory {
  const normalized = shortType.toLowerCase();
  
  if (TRIGGER_TYPES.has(normalized) || normalized.includes('trigger')) {
    return 'trigger';
  }
  
  if (LOGIC_TYPES.has(normalized)) {
    return 'logic';
  }
  
  if (TRANSFORM_TYPES.has(normalized)) {
    return 'transform';
  }
  
  // Most other nodes are action nodes (integrations, HTTP, etc.)
  return 'action';
}

/**
 * Parse a single n8n node into our simplified format
 */
export function parseNode(node: N8nNode): ParsedNode {
  const typeShort = getShortType(node.type);
  
  return {
    id: node.id,
    name: node.name,
    type: node.type,
    typeShort,
    category: categorizeNode(typeShort),
    position: node.position,
    disabled: node.disabled ?? false,
    hasCredentials: Boolean(node.credentials && Object.keys(node.credentials).length > 0),
  };
}

/**
 * Parse all nodes and group by category
 */
export function parseNodes(nodes: N8nNode[]): {
  parsed: ParsedNode[];
  byCategory: Record<NodeCategory, ParsedNode[]>;
} {
  const parsed = nodes.map(parseNode);
  
  const byCategory: Record<NodeCategory, ParsedNode[]> = {
    trigger: [],
    logic: [],
    action: [],
    transform: [],
    unknown: [],
  };
  
  for (const node of parsed) {
    byCategory[node.category].push(node);
  }
  
  return { parsed, byCategory };
}

/**
 * Get a human-readable label for a node category
 */
export function getCategoryLabel(category: NodeCategory): string {
  const labels: Record<NodeCategory, string> = {
    trigger: '🚀 Triggers',
    logic: '🔀 Logic',
    action: '⚡ Actions',
    transform: '🔧 Transform',
    unknown: '❓ Other',
  };
  return labels[category];
}

/**
 * Get a color for a node category (for UI)
 */
export function getCategoryColor(category: NodeCategory): string {
  const colors: Record<NodeCategory, string> = {
    trigger: '#10b981',   // emerald
    logic: '#8b5cf6',     // violet
    action: '#f59e0b',    // amber
    transform: '#3b82f6', // blue
    unknown: '#6b7280',   // gray
  };
  return colors[category];
}

