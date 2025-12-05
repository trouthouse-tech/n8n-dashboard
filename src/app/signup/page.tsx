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
    min-h-screen bg-gray-50
    flex items-center justify-center
    px-4 py-12
  `,
  loadingContainer: `
    flex items-center justify-center
  `,
  spinner: `
    w-8 h-8 border-2 border-gray-200 border-t-blue-600
    rounded-full animate-spin
  `,
  container: `
    w-full max-w-md
  `,
  backLink: `
    inline-block mb-6 text-sm text-gray-500
    hover:text-gray-700 transition-colors
  `,
  card: `
    bg-white border border-gray-300 rounded-lg
    p-8 shadow-sm
  `,
  header: `
    text-center mb-8
  `,
  logoMark: `
    text-4xl mb-4
  `,
  title: `
    text-2xl font-bold text-gray-900 mb-2
  `,
  subtitle: `
    text-gray-500 text-sm
  `,
  toggleSection: `
    mt-6 pt-6 border-t border-gray-200
    flex items-center justify-center gap-2
  `,
  toggleText: `
    text-sm text-gray-500
  `,
  toggleButton: `
    text-sm text-blue-600 font-medium
    hover:text-blue-700 transition-colors
  `,
};

