export enum STORAGE_KEYS {
  WORKFLOWS = 'n8n_workflows',
  WORKFLOW_EXECUTIONS = 'n8n_workflow_executions',
  WORKFLOW_RESPONSES = 'n8n_workflow_responses',
  USER = 'n8n_user',
  APP_STATE = 'n8n_app_state',
}

export enum HTTP_STATUS {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  statusCode: number;
}

