'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth';
import { AdminSidebar } from '@/components/sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!user) {
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

