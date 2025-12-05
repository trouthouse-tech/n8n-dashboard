'use client';

import { useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { CurrentWorkflowActions } from '@/store/current';
import { WorkflowAgentPrompt } from '@/model';

interface AgentPromptEditorProps {
  prompt: WorkflowAgentPrompt;
}

export const AgentPromptEditor = ({ prompt }: AgentPromptEditorProps) => {
  const dispatch = useAppDispatch();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleUpdate = (field: 'userPrompt' | 'systemPrompt', value: string) => {
    dispatch(CurrentWorkflowActions.updateAgentPrompt({ ...prompt, [field]: value }));
  };

  return (
    <div className={styles.container}>
      <button onClick={() => setIsExpanded(!isExpanded)} className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.icon}>🤖</span>
          <span className={styles.nodeName}>{prompt.nodeName}</span>
        </div>
        <span className={styles.chevron}>{isExpanded ? '▼' : '▶'}</span>
      </button>

      {isExpanded && (
        <div className={styles.content}>
          <div className={styles.field}>
            <label className={styles.label}>System Prompt</label>
            <textarea
              value={prompt.systemPrompt}
              onChange={(e) => handleUpdate('systemPrompt', e.target.value)}
              placeholder="You are a helpful assistant..."
              className={styles.textarea}
              rows={4}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>User Prompt</label>
            <textarea
              value={prompt.userPrompt}
              onChange={(e) => handleUpdate('userPrompt', e.target.value)}
              placeholder="Process the following data..."
              className={styles.textarea}
              rows={4}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: `border border-gray-200 rounded-lg overflow-hidden`,
  header: `
    w-full px-4 py-3 bg-gray-50 flex items-center justify-between
    hover:bg-gray-100 transition-colors cursor-pointer
  `,
  headerLeft: `flex items-center gap-2`,
  icon: `text-lg`,
  nodeName: `font-medium text-gray-900`,
  chevron: `text-gray-400 text-xs`,
  content: `p-4 flex flex-col gap-4 bg-white`,
  field: `flex flex-col gap-2`,
  label: `text-xs font-medium text-gray-600 uppercase tracking-wider`,
  textarea: `
    w-full px-3 py-2 bg-white border border-gray-300 rounded
    text-gray-900 placeholder-gray-400 text-sm font-mono
    focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
    transition-all resize-y min-h-[80px]
  `,
};

