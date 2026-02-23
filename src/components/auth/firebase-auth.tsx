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

  useEffect(() => {
    import('firebaseui').then(firebaseui => {
      setFirebaseui(firebaseui);
    });
  }, []);

  useEffect(() => {
    if (!firebaseui || !auth) return;

    const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);

    if (elementRef.current) {
      ui.start(elementRef.current, {
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
      ui.reset();
    };
  }, [firebaseui, auth, router]);

  return <div ref={elementRef} />;
};

export default FirebaseAuth;
