import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WorkflowExecution } from '../../model';

type InitialState = {
  [key: string]: WorkflowExecution;
};

const initialState: InitialState = {};

export const workflowExecutionsSlice = createSlice({
  name: 'workflowExecutions',
  initialState,
  reducers: {
    setWorkflowExecutions: (_state, action: PayloadAction<InitialState>) => action.payload,
    addWorkflowExecution: (state, action: PayloadAction<WorkflowExecution>) => {
      state[action.payload.id] = action.payload;
    },
    updateWorkflowExecution: (state, action: PayloadAction<WorkflowExecution>) => {
      state[action.payload.id] = action.payload;
    },
    deleteWorkflowExecution: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
    reset: () => initialState,
  },
});

export const WorkflowExecutionsActions = workflowExecutionsSlice.actions;
export default workflowExecutionsSlice.reducer;

