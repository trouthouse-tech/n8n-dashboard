import { combineReducers } from '@reduxjs/toolkit';
import {
  workflowsReducer,
  workflowExecutionsReducer,
  workflowResponsesReducer,
} from './dumps';
import { currentWorkflowReducer, currentWorkflowExecutionReducer } from './current';
import { workflowBuilderReducer } from './builders';

const rootReducer = combineReducers({
  // Dumps
  workflows: workflowsReducer,
  workflowExecutions: workflowExecutionsReducer,
  workflowResponses: workflowResponsesReducer,

  // Current
  currentWorkflow: currentWorkflowReducer,
  currentWorkflowExecution: currentWorkflowExecutionReducer,

  // Builders
  workflowBuilder: workflowBuilderReducer,
});

export default rootReducer;

