'use client';

import { useEffect, useRef } from 'react';
import {
  GoogleAuthProvider,
  EmailAuthProvider,
} from 'firebase/auth';
import { useAuth, useFirestore } from '@/firebase';
import 'firebaseui/dist/firebaseui.css';
import { useRouter } from 'next/navigation';
import { doc, setDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const FirebaseAuth = () => {
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!auth || !firestore) return;

    // Dynamically import firebaseui to avoid server-side rendering issues
    import('firebaseui').then(firebaseui => {
      if (!auth) return;
      
      // Get or create the AuthUI instance using the official singleton method
      const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);
      
      if (elementRef.current) {
        ui.start(elementRef.current, {
          signInFlow: 'popup', // Use popup flow to avoid redirect issues
          signInSuccessUrl: '/',
          signInOptions: [
            GoogleAuthProvider.PROVIDER_ID,
            EmailAuthProvider.PROVIDER_ID,
          ],
          callbacks: {
            signInSuccessWithAuthResult: (authResult, redirectUrl) => {
              if (authResult.additionalUserInfo?.isNewUser && firestore) {
                const user = authResult.user;
                const userProfileData = {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                };
                const userDocRef = doc(firestore, 'users', user.uid);
                setDoc(userDocRef, userProfileData, { merge: true })
                  .then(() => {
                    router.push('/');
                  })
                  .catch((serverError) => {
                    const permissionError = new FirestorePermissionError({
                      path: userDocRef.path,
                      operation: 'create',
                      requestResourceData: userProfileData,
                    });
                    errorEmitter.emit('permission-error', permissionError);
                    // If profile creation fails, sign the user out to avoid an inconsistent state
                    auth.signOut();
                  });
              } else {
                router.push('/');
              }
              return false; // Prevent redirect by firebaseui
            },
          },
        });
      }
    });
    // The singleton pattern used by `AuthUI.getInstance()` handles cleanup.
    // Explicitly calling `ui.delete()` in a useEffect cleanup can cause issues
    // with React's Strict Mode and fast refresh. We can safely remove the cleanup.
  }, [auth, firestore, router]);

  return <div ref={elementRef} />;
};

export default FirebaseAuth;
