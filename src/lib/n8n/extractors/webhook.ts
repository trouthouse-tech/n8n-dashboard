import type { N8nNode, ParsedWebhook } from '../types';
import { getShortType } from './nodes';

/**
 * Check if a node is a webhook trigger
 */
export function isWebhookNode(node: N8nNode): boolean {
  const shortType = getShortType(node.type).toLowerCase();
  return shortType === 'webhook' || shortType.includes('webhook');
}

/**
 * Extract webhook information from a webhook node
 */
export function extractWebhookInfo(node: N8nNode): ParsedWebhook | null {
  if (!isWebhookNode(node)) return null;
  
  const params = node.parameters as {
    path?: string;
    httpMethod?: string;
  };
  
  return {
    nodeId: node.id,
    nodeName: node.name,
    path: params.path || node.webhookId || '',
    httpMethod: (params.httpMethod || 'GET').toUpperCase(),
  };
}

/**
 * Find all webhook nodes and extract their info
 */
export function findWebhooks(nodes: N8nNode[]): ParsedWebhook[] {
  const webhooks: ParsedWebhook[] = [];
  
  for (const node of nodes) {
    const webhook = extractWebhookInfo(node);
    if (webhook) {
      webhooks.push(webhook);
    }
  }
  
  return webhooks;
}

/**
 * Get the primary webhook (first one found, typically the entry point)
 */
export function getPrimaryWebhook(nodes: N8nNode[]): ParsedWebhook | null {
  // Sort by position (leftmost/topmost first) to find the entry webhook
  const sortedNodes = [...nodes].sort((a, b) => {
    const [ax, ay] = a.position;
    const [bx, by] = b.position;
    // Prioritize leftmost, then topmost
    if (ax !== bx) return ax - bx;
    return ay - by;
  });
  
  for (const node of sortedNodes) {
    const webhook = extractWebhookInfo(node);
    if (webhook) return webhook;
  }
  
  return null;
}

/**
 * Build a full webhook URL from base URL and path
 */
export function buildWebhookUrl(baseUrl: string, webhookPath: string): string {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const cleanPath = webhookPath.replace(/^\/+/, '');
  return `${cleanBase}/webhook/${cleanPath}`;
}

