'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth';
import { AdminSidebar } from '@/components/sidebar';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getUserThunk, loadWorkflowsThunk, loadExecutionsThunk } from '@/store/thunks';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
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

  return (
    <div className={styles.appContainer}>
      <AdminSidebar />
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}

const styles = {
  loadingContainer: `
    min-h-screen bg-slate-900
    flex items-center justify-center
  `,
  spinner: `
    w-8 h-8 border-2 border-slate-700 border-t-amber-500
    rounded-full animate-spin
  `,
  appContainer: `
    flex h-screen overflow-hidden bg-slate-900
  `,
  mainContent: `
    flex-1 overflow-y-auto
  `,
};

