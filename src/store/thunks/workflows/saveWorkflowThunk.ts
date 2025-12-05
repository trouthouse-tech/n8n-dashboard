import { AppThunk } from '../../types';
import { WorkflowsActions } from '../../dumps';
import { Workflow } from '@/model';
import { createWorkflow, updateWorkflow } from '@/api';

type ResponseType = Promise<{ status: 200 | 400 | 500; workflowId?: string }>;

export const saveWorkflowThunk = (
  workflow: Omit<Workflow, 'createdAt' | 'updatedAt'> & { id?: string }
): AppThunk<ResponseType> => {
  return async (dispatch, getState): ResponseType => {
    try {
      // Use local-user as default userId for local storage
      const userId = getState().currentUser.id || 'local-user';

      const isNew = !workflow.id || !getState().workflows[workflow.id];

      if (isNew) {
        // Create new workflow
        const response = await createWorkflow({
          userId,
          name: workflow.name,
          description: workflow.description,
          webhookUrl: workflow.webhookUrl,
          defaultBody: workflow.defaultBody,
          agentPrompts: workflow.agentPrompts ?? [],
          pathSteps: workflow.pathSteps ?? [],
        });

        if (!response.success || !response.data) {
          console.error('Failed to create workflow:', response.error);
          return { status: 400 };
        }

        dispatch(WorkflowsActions.addWorkflow(response.data as Workflow));
        return { status: 200, workflowId: response.data.id };
      } else {
        // Update existing workflow
        const response = await updateWorkflow(workflow.id!, {
          name: workflow.name,
          description: workflow.description,
          webhookUrl: workflow.webhookUrl,
          defaultBody: workflow.defaultBody,
          agentPrompts: workflow.agentPrompts ?? [],
          pathSteps: workflow.pathSteps ?? [],
        });

        if (!response.success || !response.data) {
          console.error('Failed to update workflow:', response.error);
          return { status: 400 };
        }

        dispatch(WorkflowsActions.updateWorkflow(response.data as Workflow));
        return { status: 200, workflowId: response.data.id };
      }
    } catch (error) {
      console.error('Error saving workflow:', error);
      return { status: 500 };
    }
  };
};
