import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Workflow, WorkflowBodyParam } from '../../model';

const initialState: Workflow = {
  id: '',
  name: '',
  description: '',
  webhookUrl: '',
  defaultBody: [],
  createdAt: '',
  updatedAt: '',
};

export const currentWorkflowSlice = createSlice({
  name: 'currentWorkflow',
  initialState,
  reducers: {
    setWorkflow: (_state, action: PayloadAction<Workflow>) => action.payload,
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    },
    setWebhookUrl: (state, action: PayloadAction<string>) => {
      state.webhookUrl = action.payload;
    },
    setDefaultBody: (state, action: PayloadAction<WorkflowBodyParam[]>) => {
      state.defaultBody = action.payload;
    },
    addBodyParam: (state, action: PayloadAction<WorkflowBodyParam>) => {
      state.defaultBody.push(action.payload);
    },
    updateBodyParam: (state, action: PayloadAction<WorkflowBodyParam>) => {
      const index = state.defaultBody.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.defaultBody[index] = action.payload;
      }
    },
    removeBodyParam: (state, action: PayloadAction<string>) => {
      state.defaultBody = state.defaultBody.filter((p) => p.id !== action.payload);
    },
    updateWorkflow: (state, action: PayloadAction<Partial<Workflow>>) => {
      return { ...state, ...action.payload };
    },
    reset: () => initialState,
  },
});

export const CurrentWorkflowActions = currentWorkflowSlice.actions;
export default currentWorkflowSlice.reducer;

