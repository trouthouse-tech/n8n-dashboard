'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getUserThunk, loadWorkflowsThunk, loadExecutionsThunk } from '@/store/thunks';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user: authUser, loading: authLoading } = useAuth();
  const currentUser = useAppSelector((state) => state.currentUser);
  const [userLoading, setUserLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !authUser) {
      router.push('/login');
    }
  }, [authUser, authLoading, router]);

  // Fetch user document when auth user is available
  useEffect(() => {
    const fetchUser = async () => {
      if (authUser && !currentUser.id) {
        setUserLoading(true);
        await dispatch(getUserThunk(authUser.uid));
        setUserLoading(false);
      } else if (!authUser) {
        setUserLoading(false);
      } else {
        setUserLoading(false);
      }
    };

    if (!authLoading) {
      fetchUser();
    }
  }, [authUser, authLoading, currentUser.id, dispatch]);

  // Load app data (workflows, executions) when authenticated
  useEffect(() => {
    const loadData = async () => {
      if (authUser) {
        setDataLoading(true);
        await Promise.all([
          dispatch(loadWorkflowsThunk(authUser.uid)),
          dispatch(loadExecutionsThunk(authUser.uid)),
        ]);
        setDataLoading(false);
      } else {
        setDataLoading(false);
      }
    };

    if (!authLoading) {
      loadData();
    }
  }, [authUser, authLoading, dispatch]);

  const loading = authLoading || userLoading || dataLoading;

  // Show loading state while checking auth or fetching user
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!authUser) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
      </div>
    );
  }

  return <>{children}</>;
}

const styles = {
  loadingContainer: `
    min-h-screen bg-white
    flex items-center justify-center
  `,
  spinner: `
    w-8 h-8 border-2 border-gray-200 border-t-blue-600
    rounded-full animate-spin
  `,
};
