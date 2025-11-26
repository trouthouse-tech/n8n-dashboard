import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WorkflowResponse } from '../../model';

type InitialState = {
  [key: string]: WorkflowResponse;
};

const initialState: InitialState = {};

export const workflowResponsesSlice = createSlice({
  name: 'workflowResponses',
  initialState,
  reducers: {
    setWorkflowResponses: (_state, action: PayloadAction<InitialState>) => action.payload,
    addWorkflowResponse: (state, action: PayloadAction<WorkflowResponse>) => {
      state[action.payload.id] = action.payload;
    },
    updateWorkflowResponse: (state, action: PayloadAction<WorkflowResponse>) => {
      state[action.payload.id] = action.payload;
    },
    deleteWorkflowResponse: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
    reset: () => initialState,
  },
});

export const WorkflowResponsesActions = workflowResponsesSlice.actions;
export default workflowResponsesSlice.reducer;

