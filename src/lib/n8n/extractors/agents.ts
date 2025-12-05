import type { N8nNode, DetectedAgent } from '../types';

const AGENT_TYPE = '@n8n/n8n-nodes-langchain.agent';

/**
 * Extract AI agent nodes with their prompts
 */
export function extractAgents(nodes: N8nNode[]): DetectedAgent[] {
  const agents: DetectedAgent[] = [];

  for (const node of nodes) {
    if (node.type !== AGENT_TYPE) continue;

    const params = node.parameters;
    const userPrompt = (params.text as string) || '';
    const options = params.options as { systemMessage?: string } | undefined;
    const systemPrompt = options?.systemMessage || '';

    agents.push({
      nodeId: node.id,
      nodeName: node.name,
      userPrompt,
      systemPrompt,
    });
  }

  return agents;
}

