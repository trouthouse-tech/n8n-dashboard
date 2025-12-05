'use client';

import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { CurrentWorkflowActions } from '../../store/current';
import { WorkflowBuilderActions } from '../../store/builders';
import { deleteWorkflowThunk } from '../../store/thunks';
import { WorkflowRowActions } from './components';

export const WorkflowList = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const workflows = useAppSelector((state) => state.workflows);
  const workflowList = Object.values(workflows);

  const handleRowClick = (workflowId: string) => {
    const workflow = workflows[workflowId];
    if (workflow) {
      dispatch(CurrentWorkflowActions.setWorkflow(workflow));
      router.push(`/workflow/${workflowId}`);
    }
  };

  const handleEdit = (workflowId: string) => {
    const workflow = workflows[workflowId];
    if (workflow) {
      dispatch(CurrentWorkflowActions.setWorkflow(workflow));
      dispatch(WorkflowBuilderActions.openModal());
    }
  };

  const handleDelete = (workflowId: string) => {
    if (confirm('Are you sure you want to delete this workflow?')) {
      dispatch(deleteWorkflowThunk(workflowId));
    }
  };

  if (workflowList.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyTitle}>No workflows found</p>
        <p className={styles.emptyDescription}>
          Add a workflow to start triggering N8N webhooks.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Name</th>
            <th className={styles.thActions}></th>
          </tr>
        </thead>
        <tbody>
          {workflowList.map((workflow) => (
            <tr
              key={workflow.id}
              onClick={() => handleRowClick(workflow.id)}
              className={styles.row}
            >
              <td className={styles.td}>
                <span className={styles.name}>{workflow.name}</span>
              </td>
              <td className={styles.tdActions}>
                <WorkflowRowActions
                  onEdit={() => handleEdit(workflow.id)}
                  onDelete={() => handleDelete(workflow.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: `bg-white rounded-lg border border-gray-200`,
  emptyState: `p-12 text-center bg-white rounded-lg border border-gray-200`,
  emptyTitle: `text-base font-semibold text-gray-800`,
  emptyDescription: `text-sm text-gray-500 mt-1`,
  table: `w-full border-collapse text-sm`,
  th: `
    px-4 py-2.5 text-left text-xs font-semibold text-gray-500
    uppercase tracking-wide bg-gray-50 border-b border-gray-200
  `,
  thActions: `
    px-4 py-2.5 text-right text-xs font-semibold text-gray-500
    uppercase tracking-wide bg-gray-50 border-b border-gray-200 w-12
  `,
  row: `
    cursor-pointer hover:bg-blue-50 transition-colors
    border-b border-gray-100 last:border-b-0
  `,
  td: `px-4 py-3`,
  tdActions: `px-4 py-3 text-right`,
  name: `font-medium text-gray-900`,
};
