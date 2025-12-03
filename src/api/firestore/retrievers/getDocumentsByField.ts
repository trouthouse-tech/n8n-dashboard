import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FIRESTORE_COLLECTIONS, ApiResponse, HTTP_STATUS } from '../types';
import { handleFirebaseError, handleGenericError, createSuccessResponse } from '../utils/errorHandler';

export const getDocumentsByField = async <T>(
  collectionName: FIRESTORE_COLLECTIONS,
  fieldName: string,
  fieldValue: string
): Promise<ApiResponse<T[]>> => {
  try {
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, where(fieldName, '==', fieldValue));
    const snapshot = await getDocs(q);

    const documents: T[] = [];
    snapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() } as T);
    });

    return createSuccessResponse(documents, HTTP_STATUS.OK);
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error) {
      return handleFirebaseError(error as { code?: string; message?: string }, `getDocumentsByField:${collectionName}:${fieldName}`);
    }
    return handleGenericError(error as Error, `getDocumentsByField:${collectionName}:${fieldName}`);
  }
};

