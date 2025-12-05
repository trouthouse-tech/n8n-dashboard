'use client';

import { useAppSelector } from '@/store/hooks';
import { getCategoryLabel, getCategoryColor, type NodeCategory } from '@/lib/n8n';

interface WorkflowPreviewProps {
  onClear: () => void;
}

export const WorkflowPreview = ({ onClear }: WorkflowPreviewProps) => {
  const parsedWorkflow = useAppSelector((state) => state.workflowBuilder.parsedWorkflow);

  if (!parsedWorkflow) return null;

  const categories: NodeCategory[] = ['trigger', 'logic', 'action', 'transform', 'unknown'];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>
          <span className={styles.icon}>✓</span>
          Workflow Imported
        </div>
        <button onClick={onClear} className={styles.clearButton}>
          Clear
        </button>
      </div>

      {/* Workflow Summary */}
      <div className={styles.summary}>
        <div className={styles.row}>
          <span className={styles.label}>Name</span>
          <span className={styles.value}>{parsedWorkflow.name}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Nodes</span>
          <span className={styles.value}>{parsedWorkflow.nodeCount}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Status</span>
          <span className={`${styles.badge} ${parsedWorkflow.isActive ? styles.badgeActive : styles.badgeInactive}`}>
            {parsedWorkflow.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {/* Flow Summary */}
      <div className={styles.section}>
        <div className={styles.sectionLabel}>Flow</div>
        <div className={styles.flowText}>{parsedWorkflow.flowSummary}</div>
      </div>

      {/* Nodes by Category */}
      <div className={styles.nodesSection}>
        {categories.map((category) => {
          const nodes = parsedWorkflow.nodes.filter((n) => n.category === category);
          if (nodes.length === 0) return null;

          return (
            <div key={category} className={styles.categorySection}>
              <div className={styles.categoryHeader}>
                <span className={styles.dot} style={{ backgroundColor: getCategoryColor(category) }} />
                <span className={styles.categoryLabel}>{getCategoryLabel(category)}</span>
                <span className={styles.count}>{nodes.length}</span>
              </div>
              <div className={styles.nodeList}>
                {nodes.map((node) => (
                  <div key={node.id} className={styles.nodeItem}>
                    <span className={styles.nodeName}>{node.name}</span>
                    <span className={styles.nodeType}>{node.typeShort}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Webhook Info */}
      {parsedWorkflow.primaryWebhook && (
        <div className={styles.section}>
          <div className={styles.sectionLabel}>Webhook</div>
          <div className={styles.webhookInfo}>
            <span className={styles.method}>{parsedWorkflow.primaryWebhook.httpMethod}</span>
            <code className={styles.path}>/{parsedWorkflow.primaryWebhook.path}</code>
          </div>
        </div>
      )}

      {/* Detected Params */}
      {parsedWorkflow.detectedParams.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionLabel}>Detected Parameters</div>
          <div className={styles.paramsList}>
            {parsedWorkflow.detectedParams.map((param, idx) => (
              <span key={idx} className={styles.paramBadge}>{param.key}</span>
            ))}
          </div>
        </div>
      )}

      {/* Warnings */}
      {parsedWorkflow.warnings.length > 0 && (
        <div className={styles.warningsSection}>
          {parsedWorkflow.warnings.map((warning, idx) => (
            <div key={idx} className={styles.warning}>⚠️ {warning}</div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: `bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col gap-3`,
  header: `flex items-center justify-between`,
  title: `flex items-center gap-2 text-sm font-medium text-green-600`,
  icon: `w-5 h-5 bg-green-100 rounded-full flex items-center justify-center text-xs`,
  clearButton: `text-xs text-gray-500 hover:text-gray-700 cursor-pointer`,
  summary: `flex flex-col gap-1.5`,
  row: `flex items-center justify-between text-sm`,
  label: `text-gray-500`,
  value: `text-gray-900 font-medium`,
  badge: `px-2 py-0.5 rounded-full text-xs font-medium`,
  badgeActive: `bg-green-100 text-green-700`,
  badgeInactive: `bg-gray-100 text-gray-500`,
  section: `pt-2 border-t border-gray-200`,
  sectionLabel: `text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5`,
  flowText: `text-sm text-blue-600 font-mono`,
  nodesSection: `flex flex-col gap-2`,
  categorySection: `flex flex-col gap-1`,
  categoryHeader: `flex items-center gap-2`,
  dot: `w-2 h-2 rounded-full`,
  categoryLabel: `text-xs font-medium text-gray-600`,
  count: `text-xs text-gray-400`,
  nodeList: `pl-4 flex flex-col gap-0.5`,
  nodeItem: `flex items-center justify-between text-xs`,
  nodeName: `text-gray-700`,
  nodeType: `text-gray-400 font-mono`,
  webhookInfo: `flex items-center gap-2`,
  method: `px-1.5 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded`,
  path: `text-xs text-gray-600 font-mono`,
  paramsList: `flex flex-wrap gap-1.5`,
  paramBadge: `px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-mono rounded`,
  warningsSection: `pt-2 border-t border-gray-200 flex flex-col gap-1`,
  warning: `text-xs text-yellow-600`,
};

