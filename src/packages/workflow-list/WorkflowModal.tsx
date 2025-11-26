'use client';

import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { WorkflowBuilderActions } from '../../store/builders';
import { CurrentWorkflowActions } from '../../store/current';
import { saveWorkflowThunk } from '../../store/thunks';

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

  const handleAddParam = () => {
    dispatch(
      CurrentWorkflowActions.addBodyParam({
        id: crypto.randomUUID(),
        key: '',
        value: '',
      })
    );
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
          <div className={styles.field}>
            <label className={styles.label}>Name</label>
            <input
              type="text"
              value={currentWorkflow.name}
              onChange={(e) => dispatch(CurrentWorkflowActions.setName(e.target.value))}
              placeholder="My Workflow"
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Description</label>
            <input
              type="text"
              value={currentWorkflow.description}
              onChange={(e) =>
                dispatch(CurrentWorkflowActions.setDescription(e.target.value))
              }
              placeholder="Optional description"
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Webhook URL</label>
            <input
              type="url"
              value={currentWorkflow.webhookUrl}
              onChange={(e) =>
                dispatch(CurrentWorkflowActions.setWebhookUrl(e.target.value))
              }
              placeholder="https://n8n.example.com/webhook/..."
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <div className={styles.paramHeader}>
              <label className={styles.label}>Default Body Parameters</label>
              <button onClick={handleAddParam} className={styles.addParamButton}>
                + Add
              </button>
            </div>
            <div className={styles.paramList}>
              {currentWorkflow.defaultBody.map((param) => (
                <div key={param.id} className={styles.paramRow}>
                  <input
                    type="text"
                    value={param.key}
                    onChange={(e) =>
                      dispatch(
                        CurrentWorkflowActions.updateBodyParam({
                          ...param,
                          key: e.target.value,
                        })
                      )
                    }
                    placeholder="key"
                    className={styles.paramInput}
                  />
                  <input
                    type="text"
                    value={param.value}
                    onChange={(e) =>
                      dispatch(
                        CurrentWorkflowActions.updateBodyParam({
                          ...param,
                          value: e.target.value,
                        })
                      )
                    }
                    placeholder="value"
                    className={styles.paramInput}
                  />
                  <button
                    onClick={() =>
                      dispatch(CurrentWorkflowActions.removeBodyParam(param.id))
                    }
                    className={styles.removeParamButton}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <button onClick={handleClose} className={styles.cancelButton}>
            Cancel
          </button>
          <button onClick={handleSave} className={styles.saveButton}>
            {isEditing ? 'Save Changes' : 'Create Workflow'}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: `
    fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50
  `,
  modal: `
    bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md 
    shadow-2xl flex flex-col max-h-[90vh]
  `,
  header: `
    flex items-center justify-between px-5 py-4 border-b border-slate-700
  `,
  title: `
    text-lg font-semibold text-white
  `,
  closeButton: `
    w-8 h-8 flex items-center justify-center text-slate-400 
    hover:text-white hover:bg-slate-700 rounded-lg transition-colors cursor-pointer
  `,
  body: `
    flex-1 overflow-y-auto p-5 flex flex-col gap-4
  `,
  field: `
    flex flex-col gap-2
  `,
  label: `
    text-xs font-medium text-slate-400 tracking-wider uppercase
  `,
  input: `
    w-full px-3 py-2.5 bg-slate-900/70 border border-slate-600/50 rounded-lg
    text-white placeholder-slate-500 text-sm
    focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/40
    transition-all
  `,
  paramHeader: `
    flex items-center justify-between
  `,
  addParamButton: `
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
  removeParamButton: `
    w-8 h-8 flex items-center justify-center text-slate-500 
    hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer text-sm
  `,
  footer: `
    flex gap-3 px-5 py-4 border-t border-slate-700
  `,
  cancelButton: `
    flex-1 py-2.5 bg-slate-700/50 text-slate-300 font-medium rounded-lg
    hover:bg-slate-700 transition-colors cursor-pointer
  `,
  saveButton: `
    flex-1 py-2.5 bg-amber-500 text-slate-900 font-medium rounded-lg
    hover:bg-amber-400 transition-colors cursor-pointer
  `,
};

