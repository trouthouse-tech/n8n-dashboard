import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Workflow } from '../../model';

type InitialState = {
  [key: string]: Workflow;
};

const initialState: InitialState = {};

export const workflowsSlice = createSlice({
  name: 'workflows',
  initialState,
  reducers: {
    setWorkflows: (_state, action: PayloadAction<InitialState>) => action.payload,
    addWorkflow: (state, action: PayloadAction<Workflow>) => {
      state[action.payload.id] = action.payload;
    },
    updateWorkflow: (state, action: PayloadAction<Workflow>) => {
      state[action.payload.id] = action.payload;
    },
    deleteWorkflow: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
    reset: () => initialState,
  },
});

export const WorkflowsActions = workflowsSlice.actions;
export default workflowsSlice.reducer;

