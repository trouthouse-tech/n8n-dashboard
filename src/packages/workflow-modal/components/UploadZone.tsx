'use client';

import { useAppSelector } from '@/store/hooks';
import { useWorkflowUpload } from '../hooks/useWorkflowUpload';
import { WorkflowPreview } from './WorkflowPreview';

export const UploadZone = () => {
  const { parsedWorkflow, uploadError, isDragging } = useAppSelector(
    (state) => state.workflowBuilder
  );

  const {
    fileInputRef,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileSelect,
    handleClearUpload,
    openFilePicker,
  } = useWorkflowUpload();

  return (
    <div className={styles.container}>
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
          onClick={openFilePicker}
        >
          <div className={styles.dropZoneIcon}>📁</div>
          <div className={styles.dropZoneText}>Drop n8n workflow JSON here</div>
          <div className={styles.dropZoneSubtext}>or click to browse</div>
        </div>
      ) : (
        <WorkflowPreview onClear={handleClearUpload} />
      )}

      {uploadError && <div className={styles.errorMessage}>{uploadError}</div>}
    </div>
  );
};

const styles = {
  container: `flex flex-col gap-2`,
  hiddenInput: `hidden`,
  dropZone: `
    border-2 border-dashed border-gray-300 rounded-lg p-6
    flex flex-col items-center justify-center gap-2
    cursor-pointer transition-all hover:border-blue-400 hover:bg-blue-50
  `,
  dropZoneActive: `border-blue-500 bg-blue-50`,
  dropZoneIcon: `text-3xl`,
  dropZoneText: `text-sm font-medium text-gray-700`,
  dropZoneSubtext: `text-xs text-gray-500`,
  errorMessage: `text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2`,
};

