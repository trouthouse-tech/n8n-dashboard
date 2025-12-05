import { combineReducers } from '@reduxjs/toolkit';
import {
  workflowsReducer,
  workflowExecutionsReducer,
  workflowResponsesReducer,
} from './dumps';
import {
  currentUserReducer,
  currentWorkflowReducer,
  currentWorkflowExecutionReducer,
} from './current';
import { workflowBuilderReducer, layoutBuilderReducer } from './builders';

const rootReducer = combineReducers({
  // Dumps
  workflows: workflowsReducer,
  workflowExecutions: workflowExecutionsReducer,
  workflowResponses: workflowResponsesReducer,

  // Current
  currentUser: currentUserReducer,
  currentWorkflow: currentWorkflowReducer,
  currentWorkflowExecution: currentWorkflowExecutionReducer,

  // Builders
  workflowBuilder: workflowBuilderReducer,
  layoutBuilder: layoutBuilderReducer,
});

export default rootReducer;

