'use client';

import { GoogleAuthProvider, signInWithPopup, getAdditionalUserInfo } from 'firebase/auth';
import { useAuth, useFirestore } from '@/firebase';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { doc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const GoogleIcon = () => (
    <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
        <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-69.2 69.2c-20.3-19.1-46.3-30.8-75.7-30.8-60.2 0-109 48.8-109 109s48.8 109 109 109c63.6 0 102.5-49.3 106.1-73.9H248v-85.3h236.1c2.3 12.7 3.9 26.1 3.9 40.2z"></path>
    </svg>
);

function getFriendlyAuthErrorMessage(errorCode?: string): string {
    switch (errorCode) {
        // These are user-cancelled actions, not true errors.
        // Return an empty string to prevent showing a disruptive toast.
        case 'auth/popup-closed-by-user':
        case 'auth/cancelled-popup-request':
            return '';
        case 'auth/invalid-credential':
            return 'Invalid credentials. Please try again.';
        case 'auth/too-many-requests':
            return 'Access to this account has been temporarily disabled due to many failed login attempts. Please try again later.';
        default:
            return 'An unexpected error occurred during sign-in. Please try again.';
    }
}

export function GoogleAuthButton() {
    const auth = useAuth();
    const firestore = useFirestore();
    const router = useRouter();
    const { toast } = useToast();

    const handleSignIn = async () => {
        if (!auth || !firestore) {
            toast({
                variant: 'destructive',
                title: 'Firebase not initialized',
                description: 'Please try again later.',
            });
            return;
        }

        const provider = new GoogleAuthProvider();

        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const additionalInfo = getAdditionalUserInfo(result);

            if (additionalInfo?.isNewUser) {
                try {
                    const userProfileData = {
                        uid: user.uid,
                        email: user.email,
                        displayName: user.displayName || user.email?.split('@')[0] || 'New User',
                        photoURL: user.photoURL,
                    };
                    const userDocRef = doc(firestore, 'users', user.uid);
                    await setDoc(userDocRef, userProfileData, { merge: true });
                } catch (dbError) {
                    console.error('Firestore profile creation error:', dbError);
                    
                    const permissionError = new FirestorePermissionError({
                        path: `users/${user.uid}`,
                        operation: 'create',
                        requestResourceData: { note: 'Google sign-in profile creation' },
                    });
                    errorEmitter.emit('permission-error', permissionError);

                    toast({
                        variant: 'destructive',
                        title: 'Sign-in failed',
                        description: 'Your account was created, but we failed to save your profile. Please try again.'
                    });

                    // Attempt to clean up the orphaned user from Firebase Auth
                    await user.delete().catch(e => console.error("Failed to delete orphaned user:", e));
                    return;
                }
            }
            
            toast({
                title: 'Signed in successfully',
                description: `Welcome back, ${user.displayName || user.email}!`,
            });
            router.push('/');

        } catch (authError: any) {
            console.error('Google Sign-In Authentication Error:', authError);
            
            const errorMessage = getFriendlyAuthErrorMessage(authError.code);
            
            // Only show a toast if there is an actual error message to display.
            // This prevents a toast for user-cancelled popups.
            if (errorMessage) {
                toast({
                    variant: 'destructive',
                    title: 'Sign-in failed',
                    description: errorMessage
                });
            }
        }
    };

    return (
        <Button variant="outline" className="w-full" onClick={handleSignIn}>
            <GoogleIcon />
            Continue with Google
        </Button>
    );
}
