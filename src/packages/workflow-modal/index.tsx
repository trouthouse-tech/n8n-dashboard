'use client';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { WorkflowBuilderActions } from '@/store/builders';
import { CurrentWorkflowActions } from '@/store/current';
import { saveWorkflowThunk } from '@/store/thunks';
import { UploadZone, ManualForm, ModalFooter } from './components';

export const WorkflowModal = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.workflowBuilder.isModalOpen);
  const currentWorkflow = useAppSelector((state) => state.currentWorkflow);
  const isEditing = Boolean(currentWorkflow.id);

  if (!isOpen) return null;

  const handleClose = () => {
    dispatch(WorkflowBuilderActions.closeModal());
    dispatch(CurrentWorkflowActions.reset());
  };

  const handleSave = () => {
    if (!currentWorkflow.name || !currentWorkflow.webhookUrl) {
      alert('Please fill in name and webhook URL');
      return;
    }
    dispatch(saveWorkflowThunk(currentWorkflow));
    handleClose();
  };

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {isEditing ? 'Edit Workflow' : 'New Workflow'}
          </h2>
          <button onClick={handleClose} className={styles.closeButton}>
            ✕
          </button>
        </div>

        <div className={styles.body}>
          <UploadZone />

          <div className={styles.divider}>
            <span className={styles.dividerText}>or configure manually</span>
          </div>

          <ManualForm />
        </div>

        <ModalFooter isEditing={isEditing} onCancel={handleClose} onSave={handleSave} />
      </div>
    </div>
  );
};

const styles = {
  overlay: `
    fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50
  `,
  modal: `
    bg-white border border-gray-300 rounded-lg w-full max-w-lg 
    shadow-xl flex flex-col max-h-[90vh]
  `,
  header: `flex items-center justify-between px-5 py-4 border-b border-gray-200`,
  title: `text-lg font-semibold text-gray-900`,
  closeButton: `
    w-8 h-8 flex items-center justify-center text-gray-400 
    hover:text-gray-700 hover:bg-gray-100 rounded transition-colors cursor-pointer
  `,
  body: `flex-1 overflow-y-auto p-5 flex flex-col gap-4`,
  divider: `flex items-center gap-3 py-2`,
  dividerText: `text-xs text-gray-400 bg-white px-2`,
};

