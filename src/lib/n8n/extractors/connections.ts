import type { N8nConnections, N8nNode, ParsedConnection } from '../types';

/**
 * Parse n8n connections into a flat list of edges
 */
export function parseConnections(
  connections: N8nConnections,
  nodes: N8nNode[]
): ParsedConnection[] {
  const edges: ParsedConnection[] = [];
  
  for (const [fromNodeName, outputs] of Object.entries(connections)) {
    if (!outputs.main) continue;
    
    for (let outputIndex = 0; outputIndex < outputs.main.length; outputIndex++) {
      const targets = outputs.main[outputIndex];
      if (!targets) continue;
      
      for (const target of targets) {
        edges.push({
          from: fromNodeName,
          to: target.node,
          outputIndex,
        });
      }
    }
  }
  
  return edges;
}

/**
 * Build an adjacency list for traversal
 */
export function buildAdjacencyList(
  connections: ParsedConnection[]
): Map<string, string[]> {
  const adjacency = new Map<string, string[]>();
  
  for (const edge of connections) {
    const existing = adjacency.get(edge.from) || [];
    existing.push(edge.to);
    adjacency.set(edge.from, existing);
  }
  
  return adjacency;
}

/**
 * Find nodes with no incoming connections (entry points)
 */
export function findEntryNodes(
  nodes: N8nNode[],
  connections: ParsedConnection[]
): string[] {
  const allNodeNames = new Set(nodes.map(n => n.name));
  const nodesWithIncoming = new Set(connections.map(c => c.to));
  
  const entryNodes: string[] = [];
  for (const name of allNodeNames) {
    if (!nodesWithIncoming.has(name)) {
      entryNodes.push(name);
    }
  }
  
  return entryNodes;
}

/**
 * Generate a simple flow summary string
 * e.g., "Webhook → If → Slack, Email"
 */
export function generateFlowSummary(
  nodes: N8nNode[],
  connections: ParsedConnection[]
): string {
  if (nodes.length === 0) return 'Empty workflow';
  if (nodes.length === 1) return nodes[0].name;
  
  const adjacency = buildAdjacencyList(connections);
  const entryNodes = findEntryNodes(nodes, connections);
  
  if (entryNodes.length === 0) {
    // Circular or no clear entry point
    return nodes.map(n => n.name).join(' ↔ ');
  }
  
  // BFS from entry nodes to build flow
  const visited = new Set<string>();
  const flowParts: string[] = [];
  const queue = [...entryNodes];
  
  // Process level by level for a cleaner summary
  while (queue.length > 0 && flowParts.length < 6) {
    const current = queue.shift()!;
    if (visited.has(current)) continue;
    visited.add(current);
    
    flowParts.push(current);
    
    const nextNodes = adjacency.get(current) || [];
    for (const next of nextNodes) {
      if (!visited.has(next)) {
        queue.push(next);
      }
    }
  }
  
  // Add ellipsis if there are more nodes
  if (visited.size < nodes.length) {
    flowParts.push('...');
  }
  
  return flowParts.join(' → ');
}

/**
 * Count the depth of the workflow (longest path)
 */
export function getWorkflowDepth(
  nodes: N8nNode[],
  connections: ParsedConnection[]
): number {
  const adjacency = buildAdjacencyList(connections);
  const entryNodes = findEntryNodes(nodes, connections);
  
  let maxDepth = 0;
  
  function dfs(nodeName: string, depth: number, visited: Set<string>) {
    if (visited.has(nodeName)) return;
    visited.add(nodeName);
    
    maxDepth = Math.max(maxDepth, depth);
    
    const nextNodes = adjacency.get(nodeName) || [];
    for (const next of nextNodes) {
      dfs(next, depth + 1, visited);
    }
  }
  
  for (const entry of entryNodes) {
    dfs(entry, 1, new Set());
  }
  
  return maxDepth || nodes.length;
}

