'use client';

import { useState, useRef, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { WorkflowBuilderActions } from '../../store/builders';
import { CurrentWorkflowActions } from '../../store/current';
import { saveWorkflowThunk } from '../../store/thunks';
import {
  parseN8nWorkflowFromString,
  getCategoryLabel,
  getCategoryColor,
  type ParsedWorkflow,
  type NodeCategory,
} from '../../lib/n8n';

export const WorkflowModal = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.workflowBuilder.isModalOpen);
  const currentWorkflow = useAppSelector((state) => state.currentWorkflow);
  const isEditing = Boolean(currentWorkflow.id);

  // File upload state
  const [parsedWorkflow, setParsedWorkflow] = useState<ParsedWorkflow | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File upload handlers
  const processFile = useCallback(async (file: File) => {
    setUploadError(null);

    if (!file.name.endsWith('.json')) {
      setUploadError('Please upload a JSON file');
      return;
    }

    try {
      const text = await file.text();
      const parsed = parseN8nWorkflowFromString(text);

      if (!parsed.isValid) {
        setUploadError(parsed.warnings[0] || 'Invalid workflow file');
        return;
      }

      setParsedWorkflow(parsed);

      // Auto-populate form fields
      dispatch(CurrentWorkflowActions.setName(parsed.name));

      if (parsed.primaryWebhook) {
        // Use the webhook path directly - user can prepend their n8n base URL
        const webhookUrl = `https://n8n.example.com/webhook/${parsed.primaryWebhook.path}`;
        dispatch(CurrentWorkflowActions.setWebhookUrl(webhookUrl));
      }

      // Auto-add detected params as default body params
      if (parsed.detectedParams.length > 0) {
        for (const param of parsed.detectedParams) {
          dispatch(
            CurrentWorkflowActions.addBodyParam({
              id: crypto.randomUUID(),
              key: param.key,
              value: '',
            })
          );
        }
      }
    } catch (err) {
      setUploadError(`Failed to read file: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, [dispatch]);

  if (!isOpen) return null;

  const handleClose = () => {
    dispatch(WorkflowBuilderActions.closeModal());
    dispatch(CurrentWorkflowActions.reset());
    setParsedWorkflow(null);
    setUploadError(null);
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleClearUpload = () => {
    setParsedWorkflow(null);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Render node category section
  const renderNodeCategory = (category: NodeCategory, nodes: ParsedWorkflow['nodes']) => {
    const categoryNodes = nodes.filter((n) => n.category === category);
    if (categoryNodes.length === 0) return null;

    return (
      <div key={category} className={styles.categorySection}>
        <div className={styles.categoryHeader}>
          <span
            className={styles.categoryDot}
            style={{ backgroundColor: getCategoryColor(category) }}
          />
          <span className={styles.categoryLabel}>{getCategoryLabel(category)}</span>
          <span className={styles.categoryCount}>{categoryNodes.length}</span>
        </div>
        <div className={styles.nodeList}>
          {categoryNodes.map((node) => (
            <div key={node.id} className={styles.nodeItem}>
              <span className={styles.nodeName}>{node.name}</span>
              <span className={styles.nodeType}>{node.typeShort}</span>
            </div>
          ))}
        </div>
      </div>
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
          {/* File Upload Zone */}
          <div className={styles.uploadSection}>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              className={styles.hiddenInput}
            />

            {!parsedWorkflow ? (
              <div
                className={`${styles.dropZone} ${isDragging ? styles.dropZoneActive : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className={styles.dropZoneIcon}>📁</div>
                <div className={styles.dropZoneText}>
                  Drop n8n workflow JSON here
                </div>
                <div className={styles.dropZoneSubtext}>
                  or click to browse
                </div>
              </div>
            ) : (
              <div className={styles.previewContainer}>
                <div className={styles.previewHeader}>
                  <div className={styles.previewTitle}>
                    <span className={styles.previewIcon}>✓</span>
                    Workflow Imported
                  </div>
                  <button onClick={handleClearUpload} className={styles.clearButton}>
                    Clear
                  </button>
                </div>

                {/* Workflow Summary */}
                <div className={styles.workflowSummary}>
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>Name</span>
                    <span className={styles.summaryValue}>{parsedWorkflow.name}</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>Nodes</span>
                    <span className={styles.summaryValue}>{parsedWorkflow.nodeCount}</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>Status</span>
                    <span className={`${styles.statusBadge} ${parsedWorkflow.isActive ? styles.statusActive : styles.statusInactive}`}>
                      {parsedWorkflow.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                {/* Flow Summary */}
                <div className={styles.flowSection}>
                  <div className={styles.flowLabel}>Flow</div>
                  <div className={styles.flowSummary}>{parsedWorkflow.flowSummary}</div>
                </div>

                {/* Nodes by Category */}
                <div className={styles.nodesSection}>
                  {(['trigger', 'logic', 'action', 'transform', 'unknown'] as NodeCategory[]).map(
                    (category) => renderNodeCategory(category, parsedWorkflow.nodes)
                  )}
                </div>

                {/* Webhook Info */}
                {parsedWorkflow.primaryWebhook && (
                  <div className={styles.webhookSection}>
                    <div className={styles.webhookLabel}>Webhook</div>
                    <div className={styles.webhookInfo}>
                      <span className={styles.webhookMethod}>
                        {parsedWorkflow.primaryWebhook.httpMethod}
                      </span>
                      <code className={styles.webhookPath}>
                        /{parsedWorkflow.primaryWebhook.path}
                      </code>
                    </div>
                  </div>
                )}

                {/* Detected Params */}
                {parsedWorkflow.detectedParams.length > 0 && (
                  <div className={styles.paramsSection}>
                    <div className={styles.paramsLabel}>Detected Parameters</div>
                    <div className={styles.paramsList}>
                      {parsedWorkflow.detectedParams.map((param, idx) => (
                        <span key={idx} className={styles.paramBadge}>
                          {param.key}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Warnings */}
                {parsedWorkflow.warnings.length > 0 && (
                  <div className={styles.warningsSection}>
                    {parsedWorkflow.warnings.map((warning, idx) => (
                      <div key={idx} className={styles.warningItem}>
                        ⚠️ {warning}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {uploadError && (
              <div className={styles.errorMessage}>{uploadError}</div>
            )}
          </div>

          {/* Divider */}
          <div className={styles.divider}>
            <span className={styles.dividerText}>or configure manually</span>
          </div>

          {/* Manual Form Fields */}
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
    bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-lg 
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
  // Upload section styles
  uploadSection: `
    flex flex-col gap-2
  `,
  hiddenInput: `
    hidden
  `,
  dropZone: `
    border-2 border-dashed border-slate-600 rounded-xl p-6
    flex flex-col items-center justify-center gap-2
    cursor-pointer transition-all hover:border-amber-500/50 hover:bg-slate-700/30
  `,
  dropZoneActive: `
    border-amber-500 bg-amber-500/10
  `,
  dropZoneIcon: `
    text-3xl
  `,
  dropZoneText: `
    text-sm font-medium text-slate-300
  `,
  dropZoneSubtext: `
    text-xs text-slate-500
  `,
  previewContainer: `
    bg-slate-900/50 border border-slate-700 rounded-xl p-4 flex flex-col gap-3
  `,
  previewHeader: `
    flex items-center justify-between
  `,
  previewTitle: `
    flex items-center gap-2 text-sm font-medium text-emerald-400
  `,
  previewIcon: `
    w-5 h-5 bg-emerald-500/20 rounded-full flex items-center justify-center text-xs
  `,
  clearButton: `
    text-xs text-slate-400 hover:text-white cursor-pointer
  `,
  workflowSummary: `
    flex flex-col gap-1.5
  `,
  summaryRow: `
    flex items-center justify-between text-sm
  `,
  summaryLabel: `
    text-slate-500
  `,
  summaryValue: `
    text-white font-medium
  `,
  statusBadge: `
    px-2 py-0.5 rounded-full text-xs font-medium
  `,
  statusActive: `
    bg-emerald-500/20 text-emerald-400
  `,
  statusInactive: `
    bg-slate-600/50 text-slate-400
  `,
  flowSection: `
    pt-2 border-t border-slate-700/50
  `,
  flowLabel: `
    text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5
  `,
  flowSummary: `
    text-sm text-amber-400 font-mono
  `,
  nodesSection: `
    flex flex-col gap-2
  `,
  categorySection: `
    flex flex-col gap-1
  `,
  categoryHeader: `
    flex items-center gap-2
  `,
  categoryDot: `
    w-2 h-2 rounded-full
  `,
  categoryLabel: `
    text-xs font-medium text-slate-400
  `,
  categoryCount: `
    text-xs text-slate-600
  `,
  nodeList: `
    pl-4 flex flex-col gap-0.5
  `,
  nodeItem: `
    flex items-center justify-between text-xs
  `,
  nodeName: `
    text-slate-300
  `,
  nodeType: `
    text-slate-600 font-mono
  `,
  webhookSection: `
    pt-2 border-t border-slate-700/50
  `,
  webhookLabel: `
    text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5
  `,
  webhookInfo: `
    flex items-center gap-2
  `,
  webhookMethod: `
    px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded
  `,
  webhookPath: `
    text-xs text-slate-400 font-mono
  `,
  paramsSection: `
    pt-2 border-t border-slate-700/50
  `,
  paramsLabel: `
    text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5
  `,
  paramsList: `
    flex flex-wrap gap-1.5
  `,
  paramBadge: `
    px-2 py-0.5 bg-violet-500/20 text-violet-400 text-xs font-mono rounded
  `,
  warningsSection: `
    pt-2 border-t border-slate-700/50 flex flex-col gap-1
  `,
  warningItem: `
    text-xs text-amber-400
  `,
  errorMessage: `
    text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2
  `,
  // Divider
  divider: `
    flex items-center gap-3 py-2
  `,
  dividerText: `
    text-xs text-slate-600 bg-slate-800 px-2
  `,
  // Form fields (unchanged)
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
