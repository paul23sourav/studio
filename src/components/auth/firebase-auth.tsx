'use client';

import { useEffect, useRef, useState } from 'react';
import {
  GoogleAuthProvider,
  EmailAuthProvider,
  PhoneAuthProvider,
} from 'firebase/auth';
import { useAuth } from '@/firebase';
import 'firebaseui/dist/firebaseui.css';
import { useRouter } from 'next/navigation';

const FirebaseAuth = () => {
  const auth = useAuth();
  const router = useRouter();
  const elementRef = useRef(null);
  const [firebaseui, setFirebaseui] = useState<typeof import('firebaseui') | null>(null);
  const [ui, setUi] = useState<import('firebaseui').auth.AuthUI | null>(null);


  useEffect(() => {
    import('firebaseui').then(firebaseui => {
      setFirebaseui(firebaseui);
    });
  }, []);

  useEffect(() => {
    if (!firebaseui || !auth) return;

    // Do not use getInstance which can be stale.
    const newUi = new firebaseui.auth.AuthUI(auth);
    setUi(newUi);
    
    if (elementRef.current) {
      newUi.start(elementRef.current, {
        signInSuccessUrl: '/',
        signInOptions: [
          GoogleAuthProvider.PROVIDER_ID,
          EmailAuthProvider.PROVIDER_ID,
          {
            provider: PhoneAuthProvider.PROVIDER_ID,
            defaultCountry: 'IN',
          }
        ],
        callbacks: {
          signInSuccessWithAuthResult: (authResult, redirectUrl) => {
            router.push('/');
            return false;
          },
        },
      });
    }
    
    return () => {
      newUi.delete();
    };
  }, [firebaseui, auth, router]);

  return <div ref={elementRef} />;
};

export default FirebaseAuth;
