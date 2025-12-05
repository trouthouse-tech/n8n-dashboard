'use client';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { CurrentWorkflowActions } from '@/store/current';
import { BodyParamRow } from './BodyParamRow';

export const InputStepContent = () => {
  const dispatch = useAppDispatch();
  const defaultBody = useAppSelector((state) => state.currentWorkflow.defaultBody);
  const webhookUrl = useAppSelector((state) => state.currentWorkflow.webhookUrl);

  const handleAddParam = () => {
    dispatch(
      CurrentWorkflowActions.addBodyParam({
        id: crypto.randomUUID(),
        key: '',
        value: '',
      })
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Input Configuration</h3>
        <p className={styles.subtitle}>Define the required data for this workflow</p>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Webhook URL</label>
        <code className={styles.webhookUrl}>{webhookUrl}</code>
      </div>

      <div className={styles.field}>
        <div className={styles.paramHeader}>
          <label className={styles.label}>Required Parameters</label>
          <button onClick={handleAddParam} className={styles.addButton}>+ Add</button>
        </div>
        <div className={styles.paramList}>
          {defaultBody.map((param) => (
            <BodyParamRow
              key={param.id}
              param={param}
              onChange={(updated) =>
                dispatch(CurrentWorkflowActions.updateBodyParam(updated))
              }
              onRemove={() =>
                dispatch(CurrentWorkflowActions.removeBodyParam(param.id))
              }
            />
          ))}
          {defaultBody.length === 0 && (
            <p className={styles.emptyText}>No parameters defined</p>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: `flex flex-col gap-4`,
  header: ``,
  title: `text-lg font-semibold text-gray-900`,
  subtitle: `text-sm text-gray-500 mt-0.5`,
  field: `flex flex-col gap-2`,
  label: `text-xs font-medium text-gray-600 uppercase tracking-wider`,
  webhookUrl: `text-sm text-blue-600 font-mono bg-gray-50 px-3 py-2 rounded border border-gray-200`,
  paramHeader: `flex items-center justify-between`,
  addButton: `text-xs text-blue-600 hover:text-blue-700 cursor-pointer`,
  paramList: `flex flex-col gap-2`,
  emptyText: `text-sm text-gray-400 italic`,
};

