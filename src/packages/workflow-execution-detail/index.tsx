'use client';

import { useAppSelector } from '../../store/hooks';
import { ResponseViewer } from './response';

export const WorkflowExecutionDetail = () => {
  const execution = useAppSelector((state) => state.currentWorkflowExecution);
  const workflow = useAppSelector((state) => state.workflows[execution.workflowId]);
  const response = useAppSelector((state) =>
    execution.responseId ? state.workflowResponses[execution.responseId] : null
  );

  if (!execution.id) {
    return (
      <div className={styles.notFound}>
        <p>Execution not found</p>
      </div>
    );
  }

  // Parse webhook URLs - stored URL could be test or prod
  const getUrls = (url: string) => {
    if (url.includes('/webhook-test/')) {
      // Stored URL is test, derive prod
      return {
        test: url,
        prod: url.replace('/webhook-test/', '/webhook/'),
      };
    } else if (url.includes('/webhook/')) {
      // Stored URL is prod, derive test
      return {
        test: url.replace('/webhook/', '/webhook-test/'),
        prod: url,
      };
    }
    return { test: null, prod: url };
  };

  const urls = workflow?.webhookUrl ? getUrls(workflow.webhookUrl) : { test: null, prod: null };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <h1 className={styles.title}>Execution Details</h1>
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
        </div>
        <p className={styles.date}>
          {new Date(execution.executedAt).toLocaleString()}
        </p>
      </div>

      {/* Compact Request Section */}
      <div className={styles.requestSection}>
        <div className={styles.requestHeader}>
          <h2 className={styles.sectionTitle}>Request</h2>
          <div className={styles.urlBadges}>
            {urls.test && (
              <span className={styles.urlBadge} title={urls.test}>
                Test
              </span>
            )}
            {urls.prod && (
              <span className={styles.urlBadgeProd} title={urls.prod}>
                Prod
              </span>
            )}
          </div>
        </div>
        
        {execution.requestBody.length > 0 && (
          <div className={styles.paramsRow}>
            {execution.requestBody.map((param) => (
              <div key={param.id} className={styles.paramChip}>
                <span className={styles.paramKey}>{param.key}</span>
                <span className={styles.paramValue}>{param.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {execution.errorMessage && (
        <div className={styles.errorSection}>
          <h2 className={styles.sectionTitle}>Error</h2>
          <p className={styles.errorMessage}>{execution.errorMessage}</p>
        </div>
      )}

      {response && <ResponseViewer raw={response.raw} />}
    </div>
  );
};

const styles = {
  container: `
    flex flex-col gap-4
  `,
  notFound: `
    text-center py-12 text-gray-500
  `,
  header: `
    flex flex-col gap-1
  `,
  headerTop: `
    flex items-center justify-between
  `,
  title: `
    text-xl font-bold text-gray-900
  `,
  date: `
    text-gray-500 text-sm
  `,
  statusSuccess: `
    text-xs font-medium text-green-700 bg-green-100 px-3 py-1 rounded-full
  `,
  statusError: `
    text-xs font-medium text-red-700 bg-red-100 px-3 py-1 rounded-full
  `,
  statusPending: `
    text-xs font-medium text-yellow-700 bg-yellow-100 px-3 py-1 rounded-full
  `,
  requestSection: `
    bg-white border border-gray-200 rounded-lg p-3 flex flex-col gap-2
  `,
  requestHeader: `
    flex items-center justify-between
  `,
  sectionTitle: `
    text-xs font-medium text-gray-500 uppercase tracking-wider
  `,
  urlBadges: `
    flex items-center gap-1.5
  `,
  urlBadge: `
    text-[10px] font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded
    cursor-help border border-orange-200
  `,
  urlBadgeProd: `
    text-[10px] font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded
    cursor-help border border-green-200
  `,
  paramsRow: `
    flex flex-wrap gap-1.5
  `,
  paramChip: `
    inline-flex items-center gap-1 px-2 py-1 
    bg-gray-100 rounded text-xs
  `,
  paramKey: `
    font-medium text-gray-700
  `,
  paramValue: `
    text-gray-500
  `,
  errorSection: `
    bg-red-50 border border-red-200 rounded-lg p-3 flex flex-col gap-2
  `,
  errorMessage: `
    text-red-600 text-sm
  `,
};
