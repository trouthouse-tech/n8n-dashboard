'use client';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { CurrentWorkflowActions } from '@/store/current';

interface AgentStepContentProps {
  nodeId: string;
}

export const AgentStepContent = ({ nodeId }: AgentStepContentProps) => {
  const dispatch = useAppDispatch();
  const agentPrompts = useAppSelector((state) => state.currentWorkflow.agentPrompts ?? []);
  const prompt = agentPrompts.find((p) => p.nodeId === nodeId);

  if (!prompt) {
    return (
      <div className={styles.container}>
        <p className={styles.notFound}>Agent configuration not found</p>
      </div>
    );
  }

  const handleUpdate = (field: 'userPrompt' | 'systemPrompt', value: string) => {
    dispatch(CurrentWorkflowActions.updateAgentPrompt({ ...prompt, [field]: value }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>{prompt.nodeName}</h3>
        <p className={styles.subtitle}>Configure the AI agent prompts</p>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>System Prompt</label>
        <textarea
          value={prompt.systemPrompt}
          onChange={(e) => handleUpdate('systemPrompt', e.target.value)}
          placeholder="You are a helpful assistant..."
          className={styles.textarea}
          rows={5}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>User Prompt</label>
        <textarea
          value={prompt.userPrompt}
          onChange={(e) => handleUpdate('userPrompt', e.target.value)}
          placeholder="Process the following data..."
          className={styles.textarea}
          rows={5}
        />
      </div>
    </div>
  );
};

const styles = {
  container: `flex flex-col gap-4`,
  header: ``,
  title: `text-lg font-semibold text-gray-900`,
  subtitle: `text-sm text-gray-500 mt-0.5`,
  notFound: `text-sm text-gray-400 italic`,
  field: `flex flex-col gap-2`,
  label: `text-xs font-medium text-gray-600 uppercase tracking-wider`,
  textarea: `
    w-full px-3 py-2 bg-white border border-gray-300 rounded
    text-gray-900 placeholder-gray-400 text-sm font-mono
    focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
    transition-all resize-y min-h-[100px]
  `,
};

