export enum FIRESTORE_COLLECTIONS {
  USERS = 'users',
  WORKFLOWS = 'workflows',
  WORKFLOW_EXECUTIONS = 'workflowExecutions',
  WORKFLOW_RESPONSES = 'workflowResponses',
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

export interface DocumentOptions {
  merge?: boolean;
  timeout?: number;
}

