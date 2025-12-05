'use client';

import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { triggerWorkflowThunk } from '@/store/thunks';

export const TriggerButton = () => {
  const dispatch = useAppDispatch();
  const workflow = useAppSelector((state) => state.currentWorkflow);
  const responses = useAppSelector((state) => state.workflowResponses);
  const isExecuting = useAppSelector((state) => state.workflowBuilder.isExecuting);

  const [latestResponseId, setLatestResponseId] = useState<string | null>(null);

  const handleTrigger = async () => {
    const result = await dispatch(
      triggerWorkflowThunk({
        workflowId: workflow.id,
        webhookUrl: workflow.webhookUrl,
        bodyParams: workflow.defaultBody.filter((p) => p.key),
      })
    );
    if (result.status === 200 && result.responseId) {
      setLatestResponseId(result.responseId);
    }
  };

  const latestResponse = latestResponseId ? responses[latestResponseId] : null;

  return (
    <div className={styles.container}>
      <button onClick={handleTrigger} disabled={isExecuting} className={styles.button}>
        {isExecuting ? <span className={styles.spinner} /> : null}
        {isExecuting ? 'Executing...' : 'Trigger Workflow'}
      </button>

      {latestResponse && (
        <div className={styles.responseSection}>
          <h3 className={styles.responseTitle}>Latest Response</h3>
          <pre className={styles.responseBox}>{latestResponse.raw}</pre>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: `flex flex-col gap-4`,
  button: `
    w-full py-3 bg-blue-600 text-white font-semibold rounded-lg
    hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
    transition-all cursor-pointer flex items-center justify-center gap-2
  `,
  spinner: `inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin`,
  responseSection: `bg-white border border-gray-300 rounded-lg p-4`,
  responseTitle: `text-sm font-medium text-gray-600 uppercase tracking-wider mb-2`,
  responseBox: `
    p-3 bg-gray-50 border border-gray-200 rounded
    text-gray-700 text-xs font-mono whitespace-pre-wrap overflow-x-auto max-h-64 overflow-y-auto
  `,
};

