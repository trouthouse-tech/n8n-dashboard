'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/auth';

export default function LoginPage() {
  const router = useRouter();
  const { signIn, user, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      router.push('/welcome');
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await signIn(email, password);
      router.push('/welcome');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      if (errorMessage.includes('auth/invalid-credential')) {
        setError('Invalid email or password');
      } else if (errorMessage.includes('auth/invalid-email')) {
        setError('Invalid email address');
      } else if (errorMessage.includes('auth/user-not-found')) {
        setError('No account found with this email');
      } else if (errorMessage.includes('auth/wrong-password')) {
        setError('Incorrect password');
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <h1 className={styles.title}>Welcome Back</h1>
            <p className={styles.subtitle}>Sign in to your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {error && (
              <div className={styles.errorBox}>
                {error}
              </div>
            )}

            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={styles.submitButton}
            >
              {isSubmitting ? (
                <div className={styles.buttonSpinner} />
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className={styles.toggleSection}>
            <p className={styles.toggleText}>Don&apos;t have an account?</p>
            <Link href="/signup" className={styles.toggleButton}>
              Sign Up
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
  form: `
    flex flex-col gap-5
  `,
  errorBox: `
    p-3 bg-red-50 border border-red-200 rounded
    text-red-600 text-sm text-center
  `,
  inputGroup: `
    flex flex-col gap-2
  `,
  label: `
    text-sm font-medium text-gray-700
  `,
  input: `
    w-full px-4 py-3 bg-white border border-gray-300 rounded
    text-gray-900 placeholder-gray-400
    focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
    transition-colors
  `,
  submitButton: `
    w-full py-3 mt-2
    bg-blue-600 text-white font-semibold rounded
    hover:bg-blue-700 transition-colors
    disabled:opacity-50 disabled:cursor-not-allowed
    flex items-center justify-center cursor-pointer
  `,
  buttonSpinner: `
    w-5 h-5 border-2 border-white/30 border-t-white
    rounded-full animate-spin
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
