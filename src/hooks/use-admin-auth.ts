'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';

export function useAdminAuth() {
  const { user, loading: userLoading } = useUser();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userLoading) {
      setLoading(true);
      return;
    }

    if (!user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }
    
    // Always force refresh the token to get the latest claims and profile info.
    // This is crucial for ensuring security rules have the most up-to-date data.
    user.getIdTokenResult(true)
      .then((idTokenResult) => {
        const isAdminClaim = !!idTokenResult.claims.admin;
        
        const devAdminEmails = [
            'paulspshubham94@gmail.com',
            'paul23sourav@gmail.com'
        ];
        // The email in the token is the source of truth for security rules.
        const userEmail = idTokenResult.token.email; 
        const isDevAdmin = userEmail ? devAdminEmails.includes(userEmail) : false;

        setIsAdmin(isAdminClaim || isDevAdmin);
      })
      .catch((error) => {
        console.error("Error getting ID token result:", error);
        setIsAdmin(false);
      })
      .finally(() => {
        setLoading(false);
      });

  }, [user, userLoading]);

  return { isAdmin, loading };
}

export function useAdminAuthGuard() {
    const { isAdmin, loading } = useAdminAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && isAdmin === false) {
            router.replace('/');
        }
    }, [isAdmin, loading, router]);

    return { isAdmin, loading };
}
