'use client';

import { useEffect, useRef } from 'react';
import {
  GoogleAuthProvider,
  EmailAuthProvider,
  PhoneAuthProvider,
} from 'firebase/auth';
import { useAuth, useFirestore } from '@/firebase';
import 'firebaseui/dist/firebaseui.css';
import { useRouter } from 'next/navigation';
import type { auth as authui } from 'firebaseui';
import { doc, setDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const FirebaseAuth = () => {
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const elementRef = useRef<HTMLDivElement>(null);
  const uiRef = useRef<authui.AuthUI | null>(null);

  useEffect(() => {
    if (!auth || !firestore) return;

    // Using a variable to track mounted state is good for async operations in useEffect
    let isMounted = true; 

    import('firebaseui').then(firebaseui => {
      if (!isMounted || !auth) return;

      // Get or create the AuthUI instance.
      // This will be cleaned up in the return function of useEffect.
      const ui = uiRef.current || new firebaseui.auth.AuthUI(auth);
      if (!uiRef.current) {
        uiRef.current = ui;
      }
      
      if (elementRef.current) {
        ui.start(elementRef.current, {
          signInFlow: 'popup', // Use popup flow to avoid redirect issues
          signInSuccessUrl: '/',
          signInOptions: [
            GoogleAuthProvider.PROVIDER_ID,
            EmailAuthProvider.PROVIDER_ID,
            {
              provider: PhoneAuthProvider.PROVIDER_ID,
              defaultCountry: 'IN',
            },
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
                  .catch((serverError) => {
                    const permissionError = new FirestorePermissionError({
                      path: userDocRef.path,
                      operation: 'create',
                      requestResourceData: userProfileData,
                    });
                    errorEmitter.emit('permission-error', permissionError);
                  });
              }
              router.push('/');
              return false; // Prevent redirect by firebaseui
            },
          },
        });
      }
    });

    return () => {
      isMounted = false;
      if (uiRef.current) {
        try {
            uiRef.current.delete();
        } catch (e) {
            console.error('Error deleting FirebaseUI instance', e);
        } finally {
            uiRef.current = null;
        }
      }
    };
    // We depend on auth and firestore from context, and router for navigation.
  }, [auth, firestore, router]);

  return <div ref={elementRef} />;
};

export default FirebaseAuth;
