import type { ParsedWorkflow } from '../types';
import type { WorkflowPathStep } from '@/model';

const WRITE_NODE_LABELS: Record<string, string> = {
  googleSheets: 'Google Sheets',
  slack: 'Slack',
  gmail: 'Gmail',
  notion: 'Notion',
  airtable: 'Airtable',
  trello: 'Trello',
};

/**
 * Extract path steps from a parsed workflow
 */
export function extractPathSteps(parsed: ParsedWorkflow): WorkflowPathStep[] {
  const steps: WorkflowPathStep[] = [];

  // Step 1: Input (always present)
  steps.push({
    id: crypto.randomUUID(),
    type: 'input',
    label: 'Input',
  });

  // Step 2+: AI Agents
  for (const agent of parsed.agents) {
    steps.push({
      id: crypto.randomUUID(),
      type: 'agent',
      label: agent.nodeName,
      nodeId: agent.nodeId,
    });
  }

  // Final Step: Output (detect write nodes)
  const writeNode = parsed.nodes.find((node) => {
    const shortType = node.typeShort.toLowerCase();
    return Object.keys(WRITE_NODE_LABELS).some((key) => shortType.includes(key));
  });

  if (writeNode) {
    const shortType = writeNode.typeShort.toLowerCase();
    const outputType = Object.keys(WRITE_NODE_LABELS).find((key) => shortType.includes(key));

    steps.push({
      id: crypto.randomUUID(),
      type: 'output',
      label: writeNode.name,
      nodeId: writeNode.id,
      outputType: outputType ? WRITE_NODE_LABELS[outputType] : 'External',
    });
  }

  // Final Step: Trigger (always present)
  steps.push({
    id: crypto.randomUUID(),
    type: 'trigger',
    label: 'Trigger',
  });

  return steps;
}

