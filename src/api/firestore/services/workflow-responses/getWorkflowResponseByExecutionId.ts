import { getDocumentsByField } from '../../retrievers/getDocumentsByField';
import { FIRESTORE_COLLECTIONS, ApiResponse } from '../../types';
import { WorkflowResponse } from '@/model';

export const getWorkflowResponseByExecutionId = async (
  executionId: string
): Promise<ApiResponse<WorkflowResponse | null>> => {
  const result = await getDocumentsByField<WorkflowResponse>(
    FIRESTORE_COLLECTIONS.WORKFLOW_RESPONSES,
    'executionId',
    executionId
  );

  if (!result.success) {
    return {
      success: false,
      error: result.error,
      statusCode: result.statusCode,
    };
  }

  // Return the first response found (there should only be one per execution)
  const response = result.data && result.data.length > 0 ? result.data[0] : null;

  return {
    success: true,
    data: response,
    statusCode: result.statusCode,
  };
};

