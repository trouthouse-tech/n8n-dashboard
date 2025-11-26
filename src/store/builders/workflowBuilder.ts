import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WorkflowBuilderState {
  isModalOpen: boolean;
  isExecuting: boolean;
}

const initialState: WorkflowBuilderState = {
  isModalOpen: false,
  isExecuting: false,
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
    },
    setIsExecuting: (state, action: PayloadAction<boolean>) => {
      state.isExecuting = action.payload;
    },
    reset: () => initialState,
  },
});

export const WorkflowBuilderActions = workflowBuilderSlice.actions;
export default workflowBuilderSlice.reducer;

