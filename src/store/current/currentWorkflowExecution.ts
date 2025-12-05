import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WorkflowExecution } from '../../model';

const initialState: WorkflowExecution = {
  id: '',
  userId: '',
  workflowId: '',
  responseId: null,
  requestUrl: '',
  requestBody: [],
  status: 'pending',
  errorMessage: null,
  executedAt: '',
};

export const currentWorkflowExecutionSlice = createSlice({
  name: 'currentWorkflowExecution',
  initialState,
  reducers: {
    setWorkflowExecution: (_state, action: PayloadAction<WorkflowExecution>) =>
      action.payload,
    reset: () => initialState,
  },
});

export const CurrentWorkflowExecutionActions = currentWorkflowExecutionSlice.actions;
export default currentWorkflowExecutionSlice.reducer;

