import type { N8nNode, DetectedModel } from '../types';

const LLM_PATTERNS: Record<string, string> = {
  '@n8n/n8n-nodes-langchain.lmChatOpenAi': 'OpenAI',
  '@n8n/n8n-nodes-langchain.lmChatAnthropic': 'Anthropic',
  '@n8n/n8n-nodes-langchain.lmChatGoogleGemini': 'Google',
  '@n8n/n8n-nodes-langchain.lmChatOllama': 'Ollama',
};

/**
 * Extract LLM model nodes with their configuration
 */
export function extractModels(nodes: N8nNode[]): DetectedModel[] {
  const models: DetectedModel[] = [];

  for (const node of nodes) {
    const provider = LLM_PATTERNS[node.type];
    if (!provider) continue;

    const params = node.parameters;
    const modelConfig = params.model as { value?: string } | undefined;
    const model = modelConfig?.value || (params.model as string) || 'unknown';

    models.push({
      nodeId: node.id,
      nodeName: node.name,
      provider,
      model,
    });
  }

  return models;
}

