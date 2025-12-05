import type { N8nNode, DetectedParam } from '../types';

const BODY_PARAM_PATTERN = /\$json\.body\.(\w+)/g;
const NODE_REF_BODY_PATTERN = /\$\(['"]?\w+['"]?\)\.item\.json\.body\.(\w+)/g;

/**
 * Extract all body parameters referenced across all nodes
 */
export function extractParams(nodes: N8nNode[]): DetectedParam[] {
  const params: DetectedParam[] = [];
  const seenKeys = new Set<string>();

  for (const node of nodes) {
    const paramsJson = JSON.stringify(node.parameters);
    
    // Find direct $json.body.X patterns
    for (const match of paramsJson.matchAll(BODY_PARAM_PATTERN)) {
      const key = match[1];
      if (key && !seenKeys.has(key)) {
        seenKeys.add(key);
        params.push({
          key,
          source: node.name,
          expression: match[0],
        });
      }
    }

    // Find $('NodeName').item.json.body.X patterns
    for (const match of paramsJson.matchAll(NODE_REF_BODY_PATTERN)) {
      const key = match[1];
      if (key && !seenKeys.has(key)) {
        seenKeys.add(key);
        params.push({
          key,
          source: node.name,
          expression: match[0],
        });
      }
    }
  }

  return params;
}

