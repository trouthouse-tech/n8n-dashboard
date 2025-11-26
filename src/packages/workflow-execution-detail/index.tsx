'use client';

import { useAppSelector } from '../../store/hooks';
import Link from 'next/link';

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
        <Link href="/" className={styles.backLink}>
          ← Back to workflows
        </Link>
      </div>
    );
  }

  const parsedResponse = response ? parseResponse(response.raw) : null;

  return (
    <div className={styles.container}>
      <Link
        href={workflow ? `/workflow/${workflow.id}` : '/'}
        className={styles.backLink}
      >
        ← Back to {workflow?.name || 'Workflow'}
      </Link>

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

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Request</h2>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>URL</span>
          <span className={styles.infoValue}>{execution.requestUrl}</span>
        </div>
        {execution.requestBody.length > 0 && (
          <div className={styles.bodyParams}>
            <span className={styles.infoLabel}>Body</span>
            <div className={styles.paramsList}>
              {execution.requestBody.map((param) => (
                <div key={param.id} className={styles.paramItem}>
                  <span className={styles.paramKey}>{param.key}</span>
                  <span className={styles.paramValue}>{param.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {execution.errorMessage && (
        <div className={styles.errorSection}>
          <h2 className={styles.sectionTitle}>Error</h2>
          <p className={styles.errorMessage}>{execution.errorMessage}</p>
        </div>
      )}

      {parsedResponse !== null && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Response</h2>
          <div className={styles.responseContainer}>
            <ResponseTree data={parsedResponse} />
          </div>
        </div>
      )}

      {response && !parsedResponse && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Response (Raw)</h2>
          <pre className={styles.rawResponse}>{response.raw}</pre>
        </div>
      )}
    </div>
  );
};

const parseResponse = (raw: string): unknown | null => {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

interface ResponseTreeProps {
  data: unknown;
  depth?: number;
}

const ResponseTree = ({ data, depth = 0 }: ResponseTreeProps) => {
  if (data === null) {
    return <span className={styles.valueNull}>null</span>;
  }

  if (typeof data === 'boolean') {
    return <span className={styles.valueBoolean}>{data.toString()}</span>;
  }

  if (typeof data === 'number') {
    return <span className={styles.valueNumber}>{data}</span>;
  }

  if (typeof data === 'string') {
    if (data.length > 200) {
      return (
        <div className={styles.valueLongString}>
          <span className={styles.valueString}>{data}</span>
        </div>
      );
    }
    return <span className={styles.valueString}>&quot;{data}&quot;</span>;
  }

  if (Array.isArray(data)) {
    if (data.length === 0) {
      return <span className={styles.valueEmpty}>[]</span>;
    }
    return (
      <div className={styles.arrayContainer}>
        <span className={styles.bracket}>[</span>
        <div className={styles.arrayItems}>
          {data.map((item, index) => (
            <div key={index} className={styles.arrayItem}>
              <span className={styles.arrayIndex}>{index}</span>
              <ResponseTree data={item} depth={depth + 1} />
            </div>
          ))}
        </div>
        <span className={styles.bracket}>]</span>
      </div>
    );
  }

  if (typeof data === 'object') {
    const entries = Object.entries(data as Record<string, unknown>);
    if (entries.length === 0) {
      return <span className={styles.valueEmpty}>{'{}'}</span>;
    }
    return (
      <div className={styles.objectContainer}>
        {entries.map(([key, value]) => (
          <div key={key} className={styles.objectProperty}>
            <span className={styles.propertyKey}>{key}</span>
            <span className={styles.propertySeparator}>:</span>
            <div className={styles.propertyValue}>
              <ResponseTree data={value} depth={depth + 1} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return <span className={styles.valueUnknown}>{String(data)}</span>;
};

const styles = {
  container: `
    flex flex-col gap-6
  `,
  notFound: `
    text-center py-12 text-slate-400
  `,
  backLink: `
    text-sm text-slate-500 hover:text-slate-300 transition-colors
  `,
  header: `
    flex flex-col gap-2
  `,
  headerTop: `
    flex items-center justify-between
  `,
  title: `
    text-2xl font-bold text-white
  `,
  date: `
    text-slate-500 text-sm
  `,
  statusSuccess: `
    text-xs font-medium text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full
  `,
  statusError: `
    text-xs font-medium text-red-400 bg-red-500/10 px-3 py-1 rounded-full
  `,
  statusPending: `
    text-xs font-medium text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full
  `,
  section: `
    bg-slate-800/60 border border-slate-700/50 rounded-xl p-5 md:p-6 flex flex-col gap-4
  `,
  errorSection: `
    bg-red-500/5 border border-red-500/20 rounded-xl p-5 md:p-6 flex flex-col gap-4
  `,
  sectionTitle: `
    text-sm font-medium text-slate-300 uppercase tracking-wider mb-2
  `,
  infoRow: `
    flex flex-col gap-1
  `,
  infoLabel: `
    text-xs text-slate-500 uppercase tracking-wider
  `,
  infoValue: `
    text-sm text-slate-300 font-mono break-all
  `,
  bodyParams: `
    flex flex-col gap-3
  `,
  paramsList: `
    flex flex-col gap-2
  `,
  paramItem: `
    flex items-center gap-3 text-sm bg-slate-900/30 px-3 py-2 rounded-lg
  `,
  paramKey: `
    text-amber-400 font-mono font-medium
  `,
  paramValue: `
    text-slate-300 font-mono flex-1
  `,
  errorMessage: `
    text-red-400 text-sm
  `,
  responseContainer: `
    bg-slate-900/50 border border-slate-700/30 rounded-lg p-5 overflow-x-auto max-h-[70vh] overflow-y-auto
  `,
  rawResponse: `
    text-slate-300 text-sm font-mono whitespace-pre-wrap
  `,
  // Tree styles
  objectContainer: `
    flex flex-col gap-3
  `,
  objectProperty: `
    grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 items-start
  `,
  propertyKey: `
    text-amber-400 font-mono text-sm font-medium whitespace-nowrap
  `,
  propertySeparator: `
    hidden
  `,
  propertyValue: `
    min-w-0
  `,
  arrayContainer: `
    flex flex-col gap-2
  `,
  bracket: `
    text-slate-500 font-mono text-sm
  `,
  arrayItems: `
    pl-4 border-l-2 border-slate-700/50 flex flex-col gap-3 ml-2
  `,
  arrayItem: `
    flex items-start gap-3
  `,
  arrayIndex: `
    text-slate-500 font-mono text-xs min-w-[24px] bg-slate-800/50 px-1.5 py-0.5 rounded
  `,
  valueString: `
    text-emerald-400 font-mono text-sm break-all
  `,
  valueLongString: `
    bg-slate-800/50 rounded-lg p-3 max-h-48 overflow-y-auto w-full
  `,
  valueNumber: `
    text-sky-400 font-mono text-sm
  `,
  valueBoolean: `
    text-purple-400 font-mono text-sm
  `,
  valueNull: `
    text-slate-500 font-mono text-sm italic
  `,
  valueEmpty: `
    text-slate-500 font-mono text-sm
  `,
  valueUnknown: `
    text-slate-400 font-mono text-sm
  `,
};

