'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { triggerWorkflowThunk } from '../../store/thunks';
import { CurrentWorkflowExecutionActions } from '../../store/current';
import { WorkflowBodyParam, WorkflowExecution } from '../../model';
import Link from 'next/link';

const getInitialBodyParams = (defaultBody: WorkflowBodyParam[]): WorkflowBodyParam[] => {
  if (defaultBody.length > 0) {
    return defaultBody.map((p) => ({ ...p, id: crypto.randomUUID() }));
  }
  return [{ id: crypto.randomUUID(), key: '', value: '' }];
};

export const WorkflowDetail = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const workflow = useAppSelector((state) => state.currentWorkflow);
  const executions = useAppSelector((state) => state.workflowExecutions);
  const responses = useAppSelector((state) => state.workflowResponses);
  const isExecuting = useAppSelector((state) => state.workflowBuilder.isExecuting);

  const [bodyParams, setBodyParams] = useState<WorkflowBodyParam[]>(() =>
    getInitialBodyParams(workflow.defaultBody)
  );
  const [latestResponseId, setLatestResponseId] = useState<string | null>(null);

  const handleViewExecution = (execution: WorkflowExecution) => {
    dispatch(CurrentWorkflowExecutionActions.setWorkflowExecution(execution));
    router.push(`/workflow-execution/${execution.id}`);
  };

  if (!workflow.id) {
    return (
      <div className={styles.notFound}>
        <p>Workflow not found</p>
        <Link href="/" className={styles.backLink}>
          ← Back to workflows
        </Link>
      </div>
    );
  }

  const workflowExecutions = Object.values(executions)
    .filter((e) => e.workflowId === workflow.id)
    .sort((a, b) => new Date(b.executedAt).getTime() - new Date(a.executedAt).getTime());

  const handleAddParam = () => {
    setBodyParams([...bodyParams, { id: crypto.randomUUID(), key: '', value: '' }]);
  };

  const handleUpdateParam = (id: string, field: 'key' | 'value', value: string) => {
    setBodyParams(
      bodyParams.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleRemoveParam = (id: string) => {
    setBodyParams(bodyParams.filter((p) => p.id !== id));
  };

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
    <div className={styles.container}>
      <Link href="/" className={styles.backLink}>
        ← Back
      </Link>

      <div className={styles.header}>
        <h1 className={styles.title}>{workflow.name}</h1>
        {workflow.description && (
          <p className={styles.description}>{workflow.description}</p>
        )}
        <p className={styles.webhookUrl}>{workflow.webhookUrl}</p>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Request Body</h2>
          <button onClick={handleAddParam} className={styles.addButton}>
            + Add
          </button>
        </div>
        <div className={styles.paramList}>
          {bodyParams.map((param) => (
            <div key={param.id} className={styles.paramRow}>
              <input
                type="text"
                value={param.key}
                onChange={(e) => handleUpdateParam(param.id, 'key', e.target.value)}
                placeholder="key"
                className={styles.paramInput}
              />
              <input
                type="text"
                value={param.value}
                onChange={(e) => handleUpdateParam(param.id, 'value', e.target.value)}
                placeholder="value"
                className={styles.paramInput}
              />
              <button
                onClick={() => handleRemoveParam(param.id)}
                className={styles.removeButton}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={handleTrigger}
          disabled={isExecuting}
          className={styles.triggerButton}
        >
          {isExecuting ? (
            <span className={styles.buttonContent}>
              <span className={styles.spinner} />
              Executing...
            </span>
          ) : (
            'Trigger Workflow'
          )}
        </button>
      </div>

      {latestResponse && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Latest Response</h2>
          <pre className={styles.responseBox}>{latestResponse.raw}</pre>
        </div>
      )}

      {workflowExecutions.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Execution History</h2>
          <div className={styles.historyList}>
            {workflowExecutions.slice(0, 10).map((execution) => {
              const response = execution.responseId
                ? responses[execution.responseId]
                : null;
              return (
                <button
                  key={execution.id}
                  onClick={() => handleViewExecution(execution)}
                  className={styles.historyItem}
                >
                  <div className={styles.historyHeader}>
                    <span
                      className={
                        execution.status === 'success'
                          ? styles.statusSuccess
                          : execution.status === 'error'
                          ? styles.statusError
                          : styles.statusPending
                      }
                    >
                      {execution.status}
                    </span>
                    <span className={styles.historyDate}>
                      {new Date(execution.executedAt).toLocaleString()}
                    </span>
                  </div>
                  {execution.errorMessage && (
                    <p className={styles.errorMessage}>{execution.errorMessage}</p>
                  )}
                  {response && (
                    <pre className={styles.historyResponse}>
                      {response.raw.slice(0, 200)}
                      {response.raw.length > 200 ? '...' : ''}
                    </pre>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: `
    flex flex-col gap-5
  `,
  notFound: `
    text-center py-12 text-slate-400
  `,
  backLink: `
    text-sm text-slate-500 hover:text-slate-300 transition-colors
  `,
  header: `
    flex flex-col gap-1
  `,
  title: `
    text-xl font-bold text-white
  `,
  description: `
    text-slate-400 text-sm
  `,
  webhookUrl: `
    text-slate-600 text-xs font-mono truncate
  `,
  section: `
    bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 flex flex-col gap-3
  `,
  sectionHeader: `
    flex items-center justify-between
  `,
  sectionTitle: `
    text-sm font-medium text-slate-300 uppercase tracking-wider
  `,
  addButton: `
    text-xs text-amber-500 hover:text-amber-400 cursor-pointer
  `,
  paramList: `
    flex flex-col gap-2
  `,
  paramRow: `
    flex gap-2
  `,
  paramInput: `
    flex-1 px-3 py-2 bg-slate-900/70 border border-slate-600/50 rounded-lg
    text-white placeholder-slate-500 text-sm
    focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/40
    transition-all
  `,
  removeButton: `
    w-8 h-8 flex items-center justify-center text-slate-500 
    hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer text-sm
  `,
  triggerButton: `
    w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 
    text-slate-900 font-semibold rounded-lg
    hover:from-amber-400 hover:to-orange-400
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-all shadow-lg shadow-orange-500/20 cursor-pointer
  `,
  buttonContent: `
    flex items-center justify-center gap-2
  `,
  spinner: `
    inline-block w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 
    rounded-full animate-spin
  `,
  responseBox: `
    p-3 bg-slate-900/70 border border-slate-600/30 rounded-lg
    text-slate-300 text-xs font-mono whitespace-pre-wrap overflow-x-auto max-h-64 overflow-y-auto
  `,
  historyList: `
    flex flex-col gap-3
  `,
  historyItem: `
    w-full p-3 bg-slate-900/50 border border-slate-700/30 rounded-lg flex flex-col gap-2
    text-left cursor-pointer hover:bg-slate-800/50 hover:border-slate-600/50 transition-colors
  `,
  historyHeader: `
    flex items-center justify-between
  `,
  statusSuccess: `
    text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded
  `,
  statusError: `
    text-xs font-medium text-red-400 bg-red-500/10 px-2 py-0.5 rounded
  `,
  statusPending: `
    text-xs font-medium text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded
  `,
  historyDate: `
    text-xs text-slate-500
  `,
  errorMessage: `
    text-xs text-red-400
  `,
  historyResponse: `
    text-xs text-slate-500 font-mono truncate
  `,
};

