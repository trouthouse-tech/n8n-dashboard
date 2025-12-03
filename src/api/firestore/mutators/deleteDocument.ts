import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FIRESTORE_COLLECTIONS, ApiResponse, HTTP_STATUS } from '../types';

export const deleteDocument = async (
  collection: FIRESTORE_COLLECTIONS,
  documentId: string
): Promise<ApiResponse> => {
  try {
    const docRef = doc(db, collection, documentId);
    await deleteDoc(docRef);

    return {
      success: true,
      statusCode: HTTP_STATUS.OK,
    };
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string };
    return {
      success: false,
      error: {
        code: err.code || 'UNKNOWN_ERROR',
        message: err.message || 'Failed to delete document',
        details: error,
      },
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    };
  }
};

