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

    // Force refresh the token to get the latest custom claims.
    user.getIdTokenResult(true)
      .then((idTokenResult) => {
        const isAdminClaim = !!idTokenResult.claims.admin;
        setIsAdmin(isAdminClaim);
      })
      .catch(() => {
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
