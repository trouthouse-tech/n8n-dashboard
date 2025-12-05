import type { N8nNode, DetectedHttp } from '../types';

const HTTP_TYPE = 'n8n-nodes-base.httpRequest';

/**
 * Extract HTTP request nodes with their configuration
 */
export function extractHttp(nodes: N8nNode[]): DetectedHttp[] {
  const httpNodes: DetectedHttp[] = [];

  for (const node of nodes) {
    if (!node.type.includes(HTTP_TYPE)) continue;

    const params = node.parameters;
    const method = (params.method as string) || 'GET';
    const url = (params.url as string) || '';
    const hasBody = Boolean(params.sendBody || params.jsonBody || params.body);

    httpNodes.push({
      nodeId: node.id,
      nodeName: node.name,
      method,
      url,
      hasBody,
    });
  }

  return httpNodes;
}

