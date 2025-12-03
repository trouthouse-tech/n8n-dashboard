import { doc, setDoc, DocumentData, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FIRESTORE_COLLECTIONS, ApiResponse, HTTP_STATUS, DocumentOptions } from '../types';
import {
  handleFirebaseError,
  handleGenericError,
  createSuccessResponse,
  validateRequiredParams,
} from '../utils/errorHandler';

export const createDocument = async <T = DocumentData>(
  collection: FIRESTORE_COLLECTIONS,
  documentId: string,
  data: T,
  options: DocumentOptions = {}
): Promise<ApiResponse<T>> => {
  try {
    const validationError = validateRequiredParams({ collection, documentId, data }, [
      'collection',
      'documentId',
      'data',
    ]);
    if (validationError) return validationError;

    const docRef = doc(db, collection, documentId);

    const dataWithTimestamps = {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    } as DocumentData;

    await setDoc(docRef, dataWithTimestamps, {
      merge: options.merge || false,
    });

    return createSuccessResponse(dataWithTimestamps as T, HTTP_STATUS.CREATED);
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error) {
      return handleFirebaseError(error as { code?: string; message?: string }, `createDocument:${collection}:${documentId}`);
    }
    return handleGenericError(error as Error, `createDocument:${collection}:${documentId}`);
  }
};

