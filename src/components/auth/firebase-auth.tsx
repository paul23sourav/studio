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

    let isMounted = true; 
    // Dynamically import firebaseui to avoid server-side rendering issues
    import('firebaseui').then(firebaseui => {
      if (!isMounted || !auth) return;
      
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

    return () => {
      isMounted = false;
      // Also use dynamic import for cleanup to match the setup
      import('firebaseui').then(firebaseui => {
        const ui = firebaseui.auth.AuthUI.getInstance();
        if (ui) {
          try {
            ui.delete();
          } catch (e) {
            console.error('Error deleting FirebaseUI instance', e);
          }
        }
      }).catch(e => {
        // Handle potential error with importing firebaseui for cleanup
        console.error('Error importing firebaseui for cleanup', e);
      });
    };
    // We depend on auth and firestore from context, and router for navigation.
  }, [auth, firestore, router]);

  return <div ref={elementRef} />;
};

export default FirebaseAuth;
