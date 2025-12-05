import { User } from '@/model';
import {
  STORAGE_KEYS,
  ApiResponse,
  HTTP_STATUS,
  getStorageData,
  setStorageData,
  createSuccessResponse,
  createErrorResponse,
  getTimestamp,
} from '@/lib/storage';

export const createUser = async (
  user: Omit<User, 'createdAt' | 'updatedAt'>
): Promise<ApiResponse<User>> => {
  try {
    const now = getTimestamp();
    const userWithTimestamps: User = {
      ...user,
      createdAt: now,
      updatedAt: now,
    };

    const saved = setStorageData(STORAGE_KEYS.USER, userWithTimestamps);

    if (!saved) {
      return createErrorResponse(
        'STORAGE_ERROR',
        'Failed to save user to localStorage',
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }

    return createSuccessResponse(userWithTimestamps, HTTP_STATUS.CREATED);
  } catch (error) {
    return createErrorResponse(
      'INTERNAL_ERROR',
      'Failed to create user',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

