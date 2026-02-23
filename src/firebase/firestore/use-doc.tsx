'use client';
import { useState, useEffect, useMemo } from 'react';
import { onSnapshot, doc, DocumentReference, DocumentData, Firestore } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const useMemoizedDocRef = (docRef: DocumentReference | null) => {
    return useMemo(() => {
      if (!docRef) return null;
      return docRef;
    }, [docRef?.path]);
};

export function useDoc<T>(docRef: DocumentReference<DocumentData> | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const firestore = useFirestore();
  const memoizedDocRef = useMemoizedDocRef(docRef);

  useEffect(() => {
    if (!firestore || !memoizedDocRef) {
      if (typeof window === 'undefined' || !firestore) {
        setLoading(true);
        setData(null);
      } else {
        setLoading(false);
      }
      return;
    }

    const unsubscribe = onSnapshot(memoizedDocRef, (snapshot) => {
      if (snapshot.exists()) {
        setData({ ...snapshot.data(), id: snapshot.id } as T);
      } else {
        setData(null);
      }
      setLoading(false);
    }, (error) => {
      console.error("Firestore Error:", error);
      const permissionError = new FirestorePermissionError({
        path: memoizedDocRef.path,
        operation: 'get',
      });
      errorEmitter.emit('permission-error', permissionError);
      setData(null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [firestore, memoizedDocRef]);

  return { data, loading };
}
