'use client';

import { useAppSelector } from '@/store/hooks';
import { AgentPromptEditor } from './AgentPromptEditor';

export const AgentPromptsSection = () => {
  const agentPrompts = useAppSelector((state) => state.currentWorkflow.agentPrompts ?? []);

  if (agentPrompts.length === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>AI Agent Prompts</h2>
      <p className={styles.subtitle}>
        Configure the prompts for each AI agent in this workflow
      </p>
      <div className={styles.list}>
        {agentPrompts.map((prompt) => (
          <AgentPromptEditor key={prompt.id} prompt={prompt} />
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: `bg-white border border-gray-300 rounded-lg p-4 flex flex-col gap-3`,
  title: `text-sm font-medium text-gray-600 uppercase tracking-wider`,
  subtitle: `text-sm text-gray-500`,
  list: `flex flex-col gap-3`,
};

