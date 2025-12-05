'use client';

import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { CurrentWorkflowExecutionActions } from '../../../store/current';
import { WorkflowExecution } from '../../../model';

interface ExecutionHistoryProps {
  workflowId: string;
}

export const ExecutionHistory = ({ workflowId }: ExecutionHistoryProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const executions = useAppSelector((state) => state.workflowExecutions);
  const responses = useAppSelector((state) => state.workflowResponses);

  const workflowExecutions = Object.values(executions)
    .filter((e) => e.workflowId === workflowId)
    .sort((a, b) => new Date(b.executedAt).getTime() - new Date(a.executedAt).getTime());

  const handleViewExecution = (execution: WorkflowExecution) => {
    dispatch(CurrentWorkflowExecutionActions.setWorkflowExecution(execution));
    router.push(`/workflow-execution/${execution.id}`);
  };

  if (workflowExecutions.length === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
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
  );
};

const styles = {
  container: `
    bg-white border border-gray-300 rounded-lg p-4 flex flex-col gap-3
  `,
  sectionTitle: `
    text-sm font-medium text-gray-600 uppercase tracking-wider
  `,
  historyList: `
    flex flex-col gap-3
  `,
  historyItem: `
    w-full p-3 bg-gray-50 border border-gray-200 rounded flex flex-col gap-2
    text-left cursor-pointer hover:bg-gray-100 hover:border-gray-300 transition-colors
  `,
  historyHeader: `
    flex items-center justify-between
  `,
  statusSuccess: `
    text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded
  `,
  statusError: `
    text-xs font-medium text-red-700 bg-red-100 px-2 py-0.5 rounded
  `,
  statusPending: `
    text-xs font-medium text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded
  `,
  historyDate: `
    text-xs text-gray-500
  `,
  errorMessage: `
    text-xs text-red-600
  `,
  historyResponse: `
    text-xs text-gray-500 font-mono truncate
  `,
};

