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

        try {
            if (mode === 'signup') {
                const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
                const user = userCredential.user;

                const userProfileData = {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.email,
                    photoURL: null,
                };
                const userDocRef = doc(firestore, 'users', user.uid);
                
                await setDoc(userDocRef, userProfileData)
                    .catch((serverError) => {
                        const permissionError = new FirestorePermissionError({
                            path: userDocRef.path,
                            operation: 'create',
                            requestResourceData: userProfileData,
                        });
                        errorEmitter.emit('permission-error', permissionError);
                        auth.signOut();
                        throw new Error("Failed to create user profile.");
                    });
                
                toast({ title: 'Account created successfully!' });
                router.push('/');

            } else { // login
                await signInWithEmailAndPassword(auth, data.email, data.password);
                toast({ title: 'Signed in successfully!' });
                router.push('/');
            }
        } catch (error: any) {
            console.error(`${mode} error:`, error);
            const errorMessage = error.code ? error.code.replace('auth/', '').replace(/-/g, ' ') : 'An unexpected error occurred.';
            toast({
                variant: 'destructive',
                title: `${mode === 'signup' ? 'Sign up' : 'Sign in'} failed`,
                description: errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1)
            });
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
