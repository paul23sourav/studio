'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth, useFirestore } from '@/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { doc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const formSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type FormData = z.infer<typeof formSchema>;

interface EmailAuthFormProps {
    mode: 'login' | 'signup';
}

function getFriendlyAuthErrorMessage(errorCode: string): string {
    switch (errorCode) {
        case 'auth/invalid-email':
            return 'Please enter a valid email address.';
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
            return 'Invalid email or password. Please try again.';
        case 'auth/email-already-in-use':
            return 'An account with this email address already exists. Please log in.';
        case 'auth/weak-password':
            return 'The password is too weak. Please use at least 6 characters.';
        case 'auth/too-many-requests':
            return 'Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.';
        default:
            return 'An unexpected error occurred. Please try again.';
    }
}


export function EmailAuthForm({ mode }: EmailAuthFormProps) {
    const auth = useAuth();
    const firestore = useFirestore();
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });
    
    const onSubmit = async (data: FormData) => {
        if (!auth || !firestore) {
            toast({ variant: 'destructive', title: 'Firebase not initialized.' });
            return;
        }
        setLoading(true);

        if (mode === 'login') {
            try {
                await signInWithEmailAndPassword(auth, data.email, data.password);
                toast({ title: 'Signed in successfully!' });
                router.push('/');
            } catch (error: any) {
                console.error(`Login error:`, error);
                const errorMessage = getFriendlyAuthErrorMessage(error.code);
                toast({
                    variant: 'destructive',
                    title: 'Sign in failed',
                    description: errorMessage
                });
            } finally {
                setLoading(false);
            }
            return;
        }

        // Signup mode
        let userCredential;
        try {
            userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
        } catch (authError: any) {
            console.error(`Signup auth error:`, authError);
            const errorMessage = getFriendlyAuthErrorMessage(authError.code);
            toast({
                variant: 'destructive',
                title: 'Sign up failed',
                description: errorMessage
            });
            setLoading(false);
            return;
        }

        const user = userCredential.user;
        try {
            const userProfileData = {
                uid: user.uid,
                email: user.email,
                displayName: user.email?.split('@')[0] || 'New User',
                photoURL: null,
            };
            const userDocRef = doc(firestore, 'users', user.uid);
            await setDoc(userDocRef, userProfileData);

            toast({ title: 'Account created successfully!' });
            router.push('/');

        } catch (dbError: any) {
            console.error(`Signup DB error:`, dbError);
            
            const permissionError = new FirestorePermissionError({
                path: `users/${user.uid}`,
                operation: 'create',
                requestResourceData: { note: 'Email sign-up profile creation' },
            });
            errorEmitter.emit('permission-error', permissionError);
            
            toast({
                variant: 'destructive',
                title: 'Sign up failed',
                description: 'Your account was created, but we could not save your user profile. Please try again.'
            });

            // Clean up the orphaned user
            await user.delete();
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="name@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Processing...' : (mode === 'login' ? 'Login' : 'Create an account')}
                </Button>
            </form>
        </Form>
    );
}
