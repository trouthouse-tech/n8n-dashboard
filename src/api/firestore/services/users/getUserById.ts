import { getDocumentById } from '../../retrievers/getDocumentById';
import { FIRESTORE_COLLECTIONS } from '../../types';
import { User } from '@/model';

export const getUserById = async (uid: string) => {
  return await getDocumentById<User>(FIRESTORE_COLLECTIONS.USERS, uid);
};

