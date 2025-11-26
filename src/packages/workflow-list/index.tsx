'use client';

import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { WorkflowBuilderActions } from '../../store/builders';
import { CurrentWorkflowActions } from '../../store/current';
import { deleteWorkflowThunk } from '../../store/thunks';
import { Workflow } from '../../model';

export const WorkflowList = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const workflows = useAppSelector((state) => state.workflows);
  const workflowList = Object.values(workflows);

  const handleAddNew = () => {
    dispatch(CurrentWorkflowActions.reset());
    dispatch(WorkflowBuilderActions.openModal());
  };

  const handleEdit = (workflow: Workflow) => {
    dispatch(CurrentWorkflowActions.setWorkflow(workflow));
    dispatch(WorkflowBuilderActions.openModal());
  };

  const handleDelete = (workflowId: string) => {
    if (confirm('Are you sure you want to delete this workflow?')) {
      dispatch(deleteWorkflowThunk(workflowId));
    }
  };

  const handleRun = (workflow: Workflow) => {
    dispatch(CurrentWorkflowActions.setWorkflow(workflow));
    router.push(`/workflow/${workflow.id}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Workflows</h2>
        <button onClick={handleAddNew} className={styles.addButton}>
          + Add Workflow
        </button>
      </div>

      {workflowList.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>No workflows yet</p>
          <p className={styles.emptySubtext}>
            Add a workflow to start triggering N8N webhooks
          </p>
        </div>
      ) : (
        <div className={styles.list}>
          {workflowList.map((workflow) => (
            <div key={workflow.id} className={styles.card}>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{workflow.name}</h3>
                {workflow.description && (
                  <p className={styles.cardDescription}>{workflow.description}</p>
                )}
                <p className={styles.cardUrl}>{workflow.webhookUrl}</p>
              </div>
              <div className={styles.cardActions}>
                <button
                  onClick={() => handleRun(workflow)}
                  className={styles.runButton}
                >
                  Run
                </button>
                <button
                  onClick={() => handleEdit(workflow)}
                  className={styles.editButton}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(workflow.id)}
                  className={styles.deleteButton}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: `
    flex flex-col gap-4
  `,
  header: `
    flex items-center justify-between
  `,
  title: `
    text-lg font-semibold text-white
  `,
  addButton: `
    px-4 py-2 bg-amber-500 text-slate-900 font-medium rounded-lg
    hover:bg-amber-400 transition-colors cursor-pointer text-sm
  `,
  emptyState: `
    py-12 text-center
  `,
  emptyText: `
    text-slate-400 text-lg
  `,
  emptySubtext: `
    text-slate-600 text-sm mt-1
  `,
  list: `
    flex flex-col gap-3
  `,
  card: `
    bg-slate-800/60 border border-slate-700/50 rounded-xl p-4
    flex flex-col gap-3
  `,
  cardContent: `
    flex flex-col gap-1
  `,
  cardTitle: `
    text-white font-medium
  `,
  cardDescription: `
    text-slate-400 text-sm
  `,
  cardUrl: `
    text-slate-500 text-xs font-mono truncate
  `,
  cardActions: `
    flex gap-2
  `,
  runButton: `
    flex-1 py-2 bg-emerald-500/20 text-emerald-400 font-medium rounded-lg
    hover:bg-emerald-500/30 transition-colors text-center text-sm cursor-pointer
  `,
  editButton: `
    px-4 py-2 bg-slate-700/50 text-slate-300 font-medium rounded-lg
    hover:bg-slate-700 transition-colors cursor-pointer text-sm
  `,
  deleteButton: `
    px-4 py-2 bg-red-500/10 text-red-400 font-medium rounded-lg
    hover:bg-red-500/20 transition-colors cursor-pointer text-sm
  `,
};

