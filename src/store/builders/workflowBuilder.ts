import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ParsedWorkflow } from '../../lib/n8n';

interface WorkflowBuilderState {
  isModalOpen: boolean;
  isExecuting: boolean;
  parsedWorkflow: ParsedWorkflow | null;
  uploadError: string | null;
  isDragging: boolean;
}

const initialState: WorkflowBuilderState = {
  isModalOpen: false,
  isExecuting: false,
  parsedWorkflow: null,
  uploadError: null,
  isDragging: false,
};

const workflowBuilderSlice = createSlice({
  name: 'workflowBuilder',
  initialState,
  reducers: {
    openModal: (state) => {
      state.isModalOpen = true;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
      state.parsedWorkflow = null;
      state.uploadError = null;
      state.isDragging = false;
    },
    setIsExecuting: (state, action: PayloadAction<boolean>) => {
      state.isExecuting = action.payload;
    },
    setParsedWorkflow: (state, action: PayloadAction<ParsedWorkflow | null>) => {
      state.parsedWorkflow = action.payload;
    },
    setUploadError: (state, action: PayloadAction<string | null>) => {
      state.uploadError = action.payload;
    },
    setIsDragging: (state, action: PayloadAction<boolean>) => {
      state.isDragging = action.payload;
    },
    clearUpload: (state) => {
      state.parsedWorkflow = null;
      state.uploadError = null;
    },
    reset: () => initialState,
  },
});

export const WorkflowBuilderActions = workflowBuilderSlice.actions;
export default workflowBuilderSlice.reducer;

