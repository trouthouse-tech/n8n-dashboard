'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/auth';
import { SignUpForm } from '@/packages/signup';

export default function SignUpPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      router.push('/welcome');
    }
  }, [user, loading, router]);

  if (loading || user) {
    return (
      <div className={styles.page}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Link href="/" className={styles.backLink}>
          ← Back to home
        </Link>

        <div className={styles.card}>
          <div className={styles.header}>
            <div className={styles.logoMark}>⚡</div>
            <h1 className={styles.title}>Create Account</h1>
            <p className={styles.subtitle}>
              Sign up to start managing your workflows
            </p>
          </div>

          <SignUpForm />

          <div className={styles.toggleSection}>
            <p className={styles.toggleText}>Already have an account?</p>
            <Link href="/login" className={styles.toggleButton}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: `
    min-h-screen bg-slate-900
    flex items-center justify-center
    px-4 py-12
  `,
  loadingContainer: `
    flex items-center justify-center
  `,
  spinner: `
    w-8 h-8 border-2 border-slate-700 border-t-amber-500
    rounded-full animate-spin
  `,
  container: `
    w-full max-w-md
  `,
  backLink: `
    inline-block mb-6 text-sm text-slate-500
    hover:text-slate-300 transition-colors
  `,
  card: `
    bg-slate-800 border border-slate-700 rounded-2xl
    p-8
  `,
  header: `
    text-center mb-8
  `,
  logoMark: `
    text-4xl mb-4
  `,
  title: `
    text-2xl font-bold text-white mb-2
  `,
  subtitle: `
    text-slate-400 text-sm
  `,
  toggleSection: `
    mt-6 pt-6 border-t border-slate-700
    flex items-center justify-center gap-2
  `,
  toggleText: `
    text-sm text-slate-500
  `,
  toggleButton: `
    text-sm text-amber-500 font-medium
    hover:text-amber-400 transition-colors
  `,
};

