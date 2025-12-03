import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FIRESTORE_COLLECTIONS, ApiResponse, HTTP_STATUS } from '../types';
import { handleFirebaseError, handleGenericError, createSuccessResponse } from '../utils/errorHandler';

export const getDocumentById = async <T>(
  collectionName: FIRESTORE_COLLECTIONS,
  documentId: string
): Promise<ApiResponse<T | null>> => {
  try {
    const docRef = doc(db, collectionName, documentId);
    const docSnapshot = await getDoc(docRef);

    if (!docSnapshot.exists()) {
      return {
        success: false,
        error: {
          code: 'DOCUMENT_NOT_FOUND',
          message: `Document with id ${documentId} does not exist in collection ${collectionName}`,
        },
        statusCode: HTTP_STATUS.NOT_FOUND,
      };
    }

    const document = { id: docSnapshot.id, ...docSnapshot.data() } as T;
    return createSuccessResponse(document, HTTP_STATUS.OK);
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error) {
      return handleFirebaseError(error as { code?: string; message?: string }, `getDocumentById:${collectionName}:${documentId}`);
    }
    return handleGenericError(error as Error, `getDocumentById:${collectionName}:${documentId}`);
  }
};

