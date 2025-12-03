import { ApiResponse, HTTP_STATUS } from '../types';

export const handleFirebaseError = (error: { code?: string; message?: string }, context: string): ApiResponse => {
  console.error(`Firebase error in ${context}:`, error);

  const errorMap: Record<string, { code: string; message: string; status: number }> = {
    'permission-denied': {
      code: 'PERMISSION_DENIED',
      message: 'You do not have permission to perform this operation',
      status: HTTP_STATUS.FORBIDDEN,
    },
    'not-found': {
      code: 'DOCUMENT_NOT_FOUND',
      message: 'The requested document was not found',
      status: HTTP_STATUS.NOT_FOUND,
    },
    'already-exists': {
      code: 'ALREADY_EXISTS',
      message: 'A document with this ID already exists',
      status: HTTP_STATUS.CONFLICT,
    },
    'invalid-argument': {
      code: 'INVALID_ARGUMENT',
      message: 'The provided argument is invalid',
      status: HTTP_STATUS.BAD_REQUEST,
    },
    'unavailable': {
      code: 'UNAVAILABLE',
      message: 'The service is currently unavailable',
      status: HTTP_STATUS.SERVICE_UNAVAILABLE,
    },
  };

  const errorInfo = (error.code && errorMap[error.code]) || {
    code: 'INTERNAL_ERROR',
    message: 'An unexpected error occurred',
    status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  };

  return {
    success: false,
    error: {
      code: errorInfo.code,
      message: errorInfo.message,
      details: error.message,
    },
    statusCode: errorInfo.status,
  };
};

export const handleGenericError = (error: Error, context: string): ApiResponse => {
  console.error(`Generic error in ${context}:`, error);

  return {
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
      details: error.message,
    },
    statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  };
};

export const createSuccessResponse = <T>(data: T, statusCode: number = HTTP_STATUS.OK): ApiResponse<T> => {
  return {
    success: true,
    data,
    statusCode,
  };
};

export const validateRequiredParams = (
  params: Record<string, unknown>,
  requiredFields: string[]
): ApiResponse | null => {
  for (const field of requiredFields) {
    if (params[field] === undefined || params[field] === null) {
      return {
        success: false,
        error: {
          code: 'INVALID_ARGUMENT',
          message: `Missing required parameter: ${field}`,
        },
        statusCode: HTTP_STATUS.BAD_REQUEST,
      };
    }
  }
  return null;
};

