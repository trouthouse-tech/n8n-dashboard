'use client';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { CurrentWorkflowActions } from '@/store/current';
import { BodyParamsField } from './BodyParamsField';

export const ManualForm = () => {
  const dispatch = useAppDispatch();
  const { name, description, webhookUrl } = useAppSelector((state) => state.currentWorkflow);

  return (
    <div className={styles.container}>
      <div className={styles.field}>
        <label className={styles.label}>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => dispatch(CurrentWorkflowActions.setName(e.target.value))}
          placeholder="My Workflow"
          className={styles.input}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => dispatch(CurrentWorkflowActions.setDescription(e.target.value))}
          placeholder="Optional description"
          className={styles.input}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Webhook URL</label>
        <input
          type="url"
          value={webhookUrl}
          onChange={(e) => dispatch(CurrentWorkflowActions.setWebhookUrl(e.target.value))}
          placeholder="https://n8n.example.com/webhook/..."
          className={styles.input}
        />
      </div>

      <BodyParamsField />
    </div>
  );
};

const styles = {
  container: `flex flex-col gap-4`,
  field: `flex flex-col gap-2`,
  label: `text-xs font-medium text-gray-600 tracking-wider uppercase`,
  input: `
    w-full px-3 py-2.5 bg-white border border-gray-300 rounded
    text-gray-900 placeholder-gray-400 text-sm
    focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
    transition-all
  `,
};

