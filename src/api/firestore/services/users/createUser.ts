import { createDocument } from '../../mutators/createDocument';
import { FIRESTORE_COLLECTIONS } from '../../types';
import { User } from '@/model';

export const createUser = async (user: Omit<User, 'createdAt' | 'updatedAt'>) => {
  return await createDocument(FIRESTORE_COLLECTIONS.USERS, user.id, user);
};
