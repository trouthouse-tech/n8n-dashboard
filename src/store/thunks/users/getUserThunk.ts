import { AppThunk } from '../../types';
import { CurrentUserActions } from '../../current';
import { User } from '@/model';
import { getUserById } from '@/api';

type ResponseType = Promise<{ status: 200 | 404 | 500; user?: User }>;

export const getUserThunk = (uid: string): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await getUserById(uid);

      if (!response.success) {
        console.error('Failed to get user:', response.error);
        return { status: 404 };
      }

      if (!response.data) {
        // User document doesn't exist yet
        return { status: 404 };
      }

      const user = response.data as User;
      dispatch(CurrentUserActions.setUser(user));
      return { status: 200, user };
    } catch (error) {
      console.error('Error getting user:', error);
      return { status: 500 };
    }
  };
};

