import type { N8nNode, DetectedCode } from '../types';

const CODE_TYPE = 'n8n-nodes-base.code';

/**
 * Extract code nodes with their JavaScript
 */
export function extractCode(nodes: N8nNode[]): DetectedCode[] {
  const codeNodes: DetectedCode[] = [];

  for (const node of nodes) {
    if (!node.type.includes(CODE_TYPE)) continue;

    const code = (node.parameters.jsCode as string) || '';

    codeNodes.push({
      nodeId: node.id,
      nodeName: node.name,
      code,
    });
  }

  return codeNodes;
}

