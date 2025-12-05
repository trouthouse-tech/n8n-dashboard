'use client';

import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { triggerWorkflowThunk } from '@/store/thunks';
import { WorkflowBodyParam } from '@/model';
import { BodyParamRow } from './BodyParamRow';

export const WorkflowTrigger = () => {
  const dispatch = useAppDispatch();
  const workflow = useAppSelector((state) => state.currentWorkflow);
  const responses = useAppSelector((state) => state.workflowResponses);
  const isExecuting = useAppSelector((state) => state.workflowBuilder.isExecuting);

  const [bodyParams, setBodyParams] = useState<WorkflowBodyParam[]>(() =>
    workflow.defaultBody.length > 0
      ? workflow.defaultBody.map((p) => ({ ...p, id: crypto.randomUUID() }))
      : [{ id: crypto.randomUUID(), key: '', value: '' }]
  );
  const [latestResponseId, setLatestResponseId] = useState<string | null>(null);

  const handleTrigger = async () => {
    const result = await dispatch(
      triggerWorkflowThunk({
        workflowId: workflow.id,
        webhookUrl: workflow.webhookUrl,
        bodyParams: bodyParams.filter((p) => p.key),
      })
    );
    if (result.status === 200 && result.responseId) {
      setLatestResponseId(result.responseId);
    }
  };

  const latestResponse = latestResponseId ? responses[latestResponseId] : null;

  return (
    <>
      <div className={styles.section}>
        <div className={styles.header}>
          <h2 className={styles.title}>Request Body</h2>
          <button
            onClick={() => setBodyParams([...bodyParams, { id: crypto.randomUUID(), key: '', value: '' }])}
            className={styles.addButton}
          >
            + Add
          </button>
        </div>

        <div className={styles.paramList}>
          {bodyParams.map((param) => (
            <BodyParamRow
              key={param.id}
              param={param}
              onChange={(updated) => setBodyParams(bodyParams.map((p) => (p.id === updated.id ? updated : p)))}
              onRemove={() => setBodyParams(bodyParams.filter((p) => p.id !== param.id))}
            />
          ))}
        </div>

        <button onClick={handleTrigger} disabled={isExecuting} className={styles.triggerButton}>
          {isExecuting ? <span className={styles.spinner} /> : null}
          {isExecuting ? 'Executing...' : 'Trigger Workflow'}
        </button>
      </div>

      {latestResponse && (
        <div className={styles.section}>
          <h2 className={styles.title}>Latest Response</h2>
          <pre className={styles.responseBox}>{latestResponse.raw}</pre>
        </div>
      )}
    </>
  );
};

const styles = {
  section: `bg-white border border-gray-300 rounded-lg p-4 flex flex-col gap-3`,
  header: `flex items-center justify-between`,
  title: `text-sm font-medium text-gray-600 uppercase tracking-wider`,
  addButton: `text-xs text-blue-600 hover:text-blue-700 cursor-pointer`,
  paramList: `flex flex-col gap-2`,
  triggerButton: `
    w-full py-3 bg-blue-600 text-white font-semibold rounded
    hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
    transition-all cursor-pointer flex items-center justify-center gap-2
  `,
  spinner: `inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin`,
  responseBox: `
    p-3 bg-gray-50 border border-gray-200 rounded
    text-gray-700 text-xs font-mono whitespace-pre-wrap overflow-x-auto max-h-64 overflow-y-auto
  `,
};

