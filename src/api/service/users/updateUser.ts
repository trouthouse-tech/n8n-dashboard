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

export type UpdateUserInput = Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>;

export const updateUser = async (
  uid: string,
  updates: UpdateUserInput
): Promise<ApiResponse<User>> => {
  try {
    const existingUser = getStorageData<User>(STORAGE_KEYS.USER);

    if (!existingUser || existingUser.id !== uid) {
      return createErrorResponse(
        'DOCUMENT_NOT_FOUND',
        `User with id ${uid} does not exist`,
        HTTP_STATUS.NOT_FOUND
      );
    }

    const updatedUser: User = {
      ...existingUser,
      ...updates,
      updatedAt: getTimestamp(),
    };

    const saved = setStorageData(STORAGE_KEYS.USER, updatedUser);

    if (!saved) {
      return createErrorResponse(
        'STORAGE_ERROR',
        'Failed to update user in localStorage',
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }

    return createSuccessResponse(updatedUser);
  } catch (error) {
    return createErrorResponse(
      'INTERNAL_ERROR',
      'Failed to update user',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

