/**
 * n8n Workflow JSON Types
 * 
 * These types represent the structure of exported n8n workflow JSON files.
 * Use these for parsing and extracting workflow information.
 */

// =============================================================================
// RAW N8N TYPES (what n8n exports)
// =============================================================================

/**
 * A single node in an n8n workflow
 */
export interface N8nNode {
  id: string;
  name: string;
  type: string;
  typeVersion: number;
  position: [number, number];
  parameters: Record<string, unknown>;
  credentials?: Record<string, { id: string; name: string }>;
  webhookId?: string;
  disabled?: boolean;
}

/**
 * Connection target - where a connection leads to
 */
export interface N8nConnectionTarget {
  node: string;
  type: string;
  index: number;
}

/**
 * Connection output - array of targets for each output
 */
export type N8nConnectionOutput = N8nConnectionTarget[][];

/**
 * Connections map - keyed by source node name
 */
export interface N8nConnections {
  [nodeName: string]: {
    main: N8nConnectionOutput;
  };
}

/**
 * Root n8n workflow structure
 */
export interface N8nWorkflow {
  name: string;
  nodes: N8nNode[];
  connections: N8nConnections;
  active: boolean;
  settings?: {
    executionOrder?: string;
    [key: string]: unknown;
  };
  pinData?: Record<string, unknown>;
  versionId?: string;
  meta?: {
    instanceId?: string;
    [key: string]: unknown;
  };
  id?: string;
  tags?: string[];
}

// =============================================================================
// PARSED/EXTRACTED TYPES (what our app uses)
// =============================================================================

/**
 * Simplified node representation for UI display
 */
export interface ParsedNode {
  id: string;
  name: string;
  type: string;
  typeShort: string;        // e.g., "webhook" from "n8n-nodes-base.webhook"
  category: NodeCategory;
  position: [number, number];
  disabled: boolean;
  hasCredentials: boolean;
}

/**
 * Node categories for grouping/display
 */
export type NodeCategory = 
  | 'trigger'      // Webhook, Schedule, etc.
  | 'logic'        // If, Switch, Merge, etc.
  | 'action'       // HTTP Request, Slack, etc.
  | 'transform'    // Set, Function, Code, etc.
  | 'unknown';

/**
 * Connection edge for flow visualization
 */
export interface ParsedConnection {
  from: string;
  to: string;
  outputIndex: number;
}

/**
 * Webhook information extracted from webhook nodes
 */
export interface ParsedWebhook {
  nodeId: string;
  nodeName: string;
  path: string;
  httpMethod: string;
}

/**
 * Detected required parameter from expressions
 */
export interface DetectedParam {
  key: string;
  source: string;
  expression: string;
}

/**
 * AI Agent node with prompts
 */
export interface DetectedAgent {
  nodeId: string;
  nodeName: string;
  userPrompt: string;
  systemPrompt: string;
}

/**
 * LLM Model node
 */
export interface DetectedModel {
  nodeId: string;
  nodeName: string;
  provider: string;
  model: string;
}

/**
 * Code node with JavaScript
 */
export interface DetectedCode {
  nodeId: string;
  nodeName: string;
  code: string;
}

/**
 * HTTP Request node
 */
export interface DetectedHttp {
  nodeId: string;
  nodeName: string;
  method: string;
  url: string;
  hasBody: boolean;
}

/**
 * Complete parsed workflow for UI consumption
 */
export interface ParsedWorkflow {
  // Basic info
  name: string;
  n8nId: string | null;
  isActive: boolean;
  
  // Nodes
  nodes: ParsedNode[];
  nodeCount: number;
  nodesByCategory: Record<NodeCategory, ParsedNode[]>;
  
  // Connections
  connections: ParsedConnection[];
  flowSummary: string;      // e.g., "Webhook → If → Slack"
  
  // Webhook info
  webhooks: ParsedWebhook[];
  primaryWebhook: ParsedWebhook | null;
  
  // Dynamic data
  detectedParams: DetectedParam[];
  agents: DetectedAgent[];
  models: DetectedModel[];
  codeNodes: DetectedCode[];
  httpNodes: DetectedHttp[];
  
  // Validation
  warnings: string[];
  isValid: boolean;
}

