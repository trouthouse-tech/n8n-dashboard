import { AppThunk } from '../../types';
import { CurrentUserActions } from '../../current';
import { User } from '@/model';
import { updateUser, UpdateUserInput } from '@/api';

type ResponseType = Promise<{ status: 200 | 400 | 500; user?: User }>;

export const updateUserThunk = (
  uid: string,
  updates: UpdateUserInput
): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await updateUser(uid, updates);

      if (!response.success || !response.data) {
        console.error('Failed to update user:', response.error);
        return { status: 400 };
      }

      const user = response.data as User;
      dispatch(CurrentUserActions.setUser(user));
      return { status: 200, user };
    } catch (error) {
      console.error('Error updating user:', error);
      return { status: 500 };
    }
  };
};

