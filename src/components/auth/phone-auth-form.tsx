'use client';

import { useState, useEffect } from 'react';
import { useAuth, useFirestore } from '@/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult, getAdditionalUserInfo } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

// Extend window type to include recaptchaVerifier
declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
  }
}

function getFriendlyPhoneAuthErrorMessage(errorCode: string): string {
    switch (errorCode) {
        case 'auth/invalid-phone-number':
            return 'The phone number is not valid.';
        case 'auth/too-many-requests':
            return 'You have sent too many requests. Please try again later.';
        case 'auth/code-expired':
            return 'The verification code has expired. Please send a new one.';
        case 'auth/invalid-verification-code':
            return 'The verification code is invalid. Please try again.';
        case 'auth/captcha-check-failed':
            return 'The reCAPTCHA verification failed. Please try again.';
        default:
            return 'An unexpected error occurred. Please try again.';
    }
}

export function PhoneAuthForm() {
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);

  useEffect(() => {
    if (!auth) return;

    if (!window.recaptchaVerifier && document.getElementById('recaptcha-container')) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            'size': 'invisible',
            'callback': () => {
                // reCAPTCHA solved, allow signInWithPhoneNumber.
            }
        });
    }
    // By not providing a cleanup function, the reCAPTCHA verifier will persist
    // for the user's session, avoiding the unmount/cleanup race condition that
    // causes the "Cannot read properties of null (reading 'style')" error.
  }, [auth]);


  const onSendOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!auth || !firestore ) {
      toast({ variant: 'destructive', title: 'Firebase not initialized.' });
      return;
    }
     if (!window.recaptchaVerifier) {
        toast({ variant: 'destructive', title: 'reCAPTCHA not ready', description: 'Please wait a moment and try again.' });
        return;
    }
    setLoading(true);
    const appVerifier = window.recaptchaVerifier;
    
    try {
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      window.confirmationResult = confirmationResult;
      setIsOtpSent(true);
      toast({ title: 'OTP Sent', description: 'Please check your phone for the verification code.' });
    } catch (error: any) {
      console.error('OTP send error:', error);
      const errorMessage = getFriendlyPhoneAuthErrorMessage(error.code);
      toast({ variant: 'destructive', title: 'Failed to send OTP', description: errorMessage });
      
      // Reset recaptcha on error to allow user to try again
      // @ts-ignore
      if (window.grecaptcha) {
        // @ts-ignore
        window.grecaptcha.reset();
      }

    } finally {
      setLoading(false);
    }
  };

  const onVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!window.confirmationResult || !firestore) {
      toast({ variant: 'destructive', title: 'An error occurred', description: 'Please try sending the OTP again.' });
      return;
    }
    setLoading(true);

    try {
      const result = await window.confirmationResult.confirm(otp);
      const user = result.user;
      const additionalInfo = getAdditionalUserInfo(result);

      if (additionalInfo?.isNewUser) {
        try {
          const userProfileData = {
            uid: user.uid,
            phoneNumber: user.phoneNumber,
            displayName: 'New User',
            photoURL: null,
            email: null,
          };
          const userDocRef = doc(firestore, 'users', user.uid);
          await setDoc(userDocRef, userProfileData);
        } catch (dbError) {
          console.error('Firestore profile creation error:', dbError);
          const permissionError = new FirestorePermissionError({
            path: `users/${user.uid}`,
            operation: 'create',
            requestResourceData: { note: 'Phone sign-in profile creation' },
          });
          errorEmitter.emit('permission-error', permissionError);
          toast({
            variant: 'destructive',
            title: 'Sign-in failed',
            description: 'Your account was created, but we failed to save your profile.'
          });
          await user.delete().catch(e => console.error("Failed to delete orphaned user:", e));
          setLoading(false);
          return;
        }
      }
      
      toast({ title: 'Signed in successfully!' });
      router.push('/');

    } catch (error: any) {
      console.error('OTP verify error:', error);
      const errorMessage = getFriendlyPhoneAuthErrorMessage(error.code);
      toast({ variant: 'destructive', title: 'Sign in failed', description: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div id="recaptcha-container"></div>
      {!isOtpSent ? (
        <form onSubmit={onSendOtp} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 123 456 7890"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </Button>
        </form>
      ) : (
        <form onSubmit={onVerifyOtp} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="otp">Verification Code</Label>
            <Input
              id="otp"
              type="text"
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify OTP & Sign In'}
          </Button>
        </form>
      )}
    </>
  );
}
