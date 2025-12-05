'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loadWorkflowsThunk, loadExecutionsThunk } from '@/store/thunks';
import { useApp } from '@/context/app';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const dispatch = useAppDispatch();
  const { isInitialized } = useApp();
  const currentUser = useAppSelector((state) => state.currentUser);
  const [dataLoading, setDataLoading] = useState(true);

  // Load app data (workflows, executions) on mount
  useEffect(() => {
    const loadData = async () => {
      if (!isInitialized) return;
      
      setDataLoading(true);
      // Use a default local user ID since we're not using auth
      const userId = currentUser.id || 'local-user';
      await Promise.all([
        dispatch(loadWorkflowsThunk(userId)),
        dispatch(loadExecutionsThunk(userId)),
      ]);
      setDataLoading(false);
    };

    loadData();
  }, [isInitialized, currentUser.id, dispatch]);

  const loading = !isInitialized || dataLoading;

  // Show loading state while initializing
  if (loading) {
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
