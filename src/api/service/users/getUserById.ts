import { User } from '@/model';
import {
  STORAGE_KEYS,
  ApiResponse,
  HTTP_STATUS,
  getStorageData,
  createSuccessResponse,
  createErrorResponse,
} from '@/lib/storage';

export const getUserById = async (uid: string): Promise<ApiResponse<User | null>> => {
  try {
    const user = getStorageData<User>(STORAGE_KEYS.USER);

    if (!user || user.id !== uid) {
      return createErrorResponse(
        'DOCUMENT_NOT_FOUND',
        `User with id ${uid} does not exist`,
        HTTP_STATUS.NOT_FOUND
      );
    }

    return createSuccessResponse(user);
  } catch (error) {
    return createErrorResponse(
      'INTERNAL_ERROR',
      'Failed to get user',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

