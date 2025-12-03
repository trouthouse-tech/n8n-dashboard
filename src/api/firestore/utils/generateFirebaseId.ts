import { collection, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const generateFirebaseId = (path: string): string => {
  const docRef = doc(collection(db, path));
  return docRef.id;
};

