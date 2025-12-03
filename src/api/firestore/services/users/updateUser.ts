import { updateDocument } from '../../mutators/updateDocument';
import { FIRESTORE_COLLECTIONS } from '../../types';
import { User } from '@/model';

export type UpdateUserInput = Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>;

export const updateUser = async (uid: string, updates: UpdateUserInput) => {
  return await updateDocument(FIRESTORE_COLLECTIONS.USERS, uid, updates);
};

