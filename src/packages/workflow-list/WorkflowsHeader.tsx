'use client';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { WorkflowBuilderActions } from '../../store/builders';
import { CurrentWorkflowActions } from '../../store/current';

export const WorkflowsHeader = () => {
  const dispatch = useAppDispatch();
  const workflows = useAppSelector((state) => state.workflows);
  const workflowsArray = Object.values(workflows);

  const workflowCountLabel = `${workflowsArray.length} workflow${workflowsArray.length !== 1 ? 's' : ''}`;

  const handleCreateWorkflow = () => {
    dispatch(CurrentWorkflowActions.reset());
    dispatch(WorkflowBuilderActions.openModal());
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeaderRow}>
        <div className={styles.sectionSummary}>
          <span className={styles.sectionTitle}>{workflowCountLabel}</span>
          <span className={styles.sectionDivider}>•</span>
          <span className={styles.sectionMeta}>
            Manage and trigger N8N webhook workflows
          </span>
        </div>
        <div className={styles.buttonGroup}>
          <button
            onClick={handleCreateWorkflow}
            className={styles.createButton}
          >
            + Add Workflow
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  section: `
    mb-3
  `,
  sectionHeaderRow: `
    flex justify-between items-center mb-3
  `,
  sectionSummary: `
    flex items-center gap-1.5
  `,
  sectionTitle: `
    text-base font-semibold text-gray-900
  `,
  sectionDivider: `
    text-gray-300 text-sm
  `,
  sectionMeta: `
    text-xs text-gray-500
  `,
  buttonGroup: `
    flex gap-2
  `,
  createButton: `
    px-3 py-1.5 
    text-xs font-medium 
    text-white 
    bg-blue-600 
    rounded 
    hover:bg-blue-700 
    transition-colors
    focus:outline-none 
    focus:ring-1 
    focus:ring-blue-500
    cursor-pointer
  `,
};

