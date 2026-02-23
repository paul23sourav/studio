'use client';
import { useState, useEffect, useMemo } from 'react';
import { onSnapshot, query, Query, DocumentData, Firestore, CollectionReference } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

// A hook to memorize the reference
const useMemoizedQuery = (q: Query | CollectionReference | null) => {
    return useMemo(() => {
        if (!q) return null;
        // This is a simple memoization based on path and type.
        // For more complex queries, you might need a more sophisticated key.
        return q;
    }, [q?.path, q?.type]);
};

export function useCollection<T>(q: Query | CollectionReference | null) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const firestore = useFirestore();
  const memoizedQuery = useMemoizedQuery(q);

  useEffect(() => {
    if (!firestore || !memoizedQuery) {
      if (typeof window === 'undefined' || !firestore) {
        setLoading(true);
        setData(null);
      } else {
        setLoading(false);
      }
      return;
    }

    const unsubscribe = onSnapshot(memoizedQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as T));
      setData(data);
      setLoading(false);
    }, (error) => {
      console.error("Firestore Error:", error);
      const permissionError = new FirestorePermissionError({
        path: memoizedQuery.path,
        operation: 'list',
      });
      errorEmitter.emit('permission-error', permissionError);
      setData(null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [firestore, memoizedQuery]);

  return { data, loading };
}
