import { doc, updateDoc, getDoc, DocumentData, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FIRESTORE_COLLECTIONS, ApiResponse, HTTP_STATUS, DocumentOptions } from '../types';
import {
  handleFirebaseError,
  handleGenericError,
  createSuccessResponse,
  validateRequiredParams,
} from '../utils/errorHandler';
import { removeUndefinedValues } from '../utils/removeUndefinedValues';

export const updateDocument = async <T = DocumentData>(
  collection: FIRESTORE_COLLECTIONS,
  documentId: string,
  data: Partial<T>,
  _options: DocumentOptions = {}
): Promise<ApiResponse<T>> => {
  try {
    const validationError = validateRequiredParams({ collection, documentId, data }, [
      'collection',
      'documentId',
      'data',
    ]);
    if (validationError) return validationError;

    const docRef = doc(db, collection, documentId);

    const docSnapshot = await getDoc(docRef);
    if (!docSnapshot.exists()) {
      return {
        success: false,
        error: {
          code: 'DOCUMENT_NOT_FOUND',
          message: `Document with id ${documentId} does not exist in collection ${collection}`,
        },
        statusCode: HTTP_STATUS.NOT_FOUND,
      };
    }

    const currentData = docSnapshot.data() as T;

    const dataWithTimestamp = {
      ...data,
      updatedAt: Timestamp.now(),
    } as DocumentData;

    // Remove undefined values before sending to Firestore
    const cleanedData = removeUndefinedValues(dataWithTimestamp);

    await updateDoc(docRef, cleanedData);

    const updatedData = { ...currentData, ...cleanedData };
    return createSuccessResponse(updatedData as T, HTTP_STATUS.OK);
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error) {
      return handleFirebaseError(error as { code?: string; message?: string }, `updateDocument:${collection}:${documentId}`);
    }
    return handleGenericError(error as Error, `updateDocument:${collection}:${documentId}`);
  }
};

