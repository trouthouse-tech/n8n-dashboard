import { AppThunk } from '../../types';
import { CurrentUserActions } from '../../current';
import { User } from '@/model';
import { createUser } from '@/api';
import { generateId } from '@/lib/storage';

type ResponseType = Promise<{ status: 200 | 400 | 500; user?: User }>;

export const createUserThunk = (uid?: string): AppThunk<ResponseType> => {
  return async (dispatch, getState): ResponseType => {
    try {
      const currentUser = getState().currentUser;
      const userId = uid || generateId();

      const user: Omit<User, 'createdAt' | 'updatedAt'> = {
        id: userId,
        email: currentUser.email,
        name: currentUser.name,
        companyName: currentUser.companyName,
        industry: currentUser.industry,
        industryOther: currentUser.industryOther,
      };

      const response = await createUser(user);

      if (!response.success || !response.data) {
        console.error('Failed to create user:', response.error);
        return { status: 400 };
      }

      const createdUser = response.data as User;
      dispatch(CurrentUserActions.setUser(createdUser));
      return { status: 200, user: createdUser };
    } catch (error) {
      console.error('Error creating user:', error);
      return { status: 500 };
    }
  };
};
