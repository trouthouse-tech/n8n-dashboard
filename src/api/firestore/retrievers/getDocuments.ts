import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FIRESTORE_COLLECTIONS, ApiResponse, HTTP_STATUS } from '../types';
import { handleFirebaseError, handleGenericError, createSuccessResponse } from '../utils/errorHandler';

export const getDocuments = async <T>(
  collectionName: FIRESTORE_COLLECTIONS
): Promise<ApiResponse<T[]>> => {
  try {
    const collectionRef = collection(db, collectionName);
    const snapshot = await getDocs(collectionRef);

    const documents: T[] = [];
    snapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() } as T);
    });

    return createSuccessResponse(documents, HTTP_STATUS.OK);
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error) {
      return handleFirebaseError(error as { code?: string; message?: string }, `getDocuments:${collectionName}`);
    }
    return handleGenericError(error as Error, `getDocuments:${collectionName}`);
  }
};

