'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/auth';

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signUp, user, loading } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already logged in
  if (!loading && user) {
    router.push('/welcome');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
      router.push('/welcome');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      // Clean up Firebase error messages
      if (errorMessage.includes('auth/invalid-credential')) {
        setError('Invalid email or password');
      } else if (errorMessage.includes('auth/email-already-in-use')) {
        setError('Email already in use');
      } else if (errorMessage.includes('auth/weak-password')) {
        setError('Password should be at least 6 characters');
      } else if (errorMessage.includes('auth/invalid-email')) {
        setError('Invalid email address');
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
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
            <h1 className={styles.title}>
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className={styles.subtitle}>
              {isSignUp
                ? 'Sign up to start managing your workflows'
                : 'Sign in to your dashboard'}
            </p>
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
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={styles.submitButton}
            >
              {isSubmitting ? (
                <div className={styles.buttonSpinner} />
              ) : isSignUp ? (
                'Create Account'
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className={styles.toggleSection}>
            <p className={styles.toggleText}>
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            </p>
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className={styles.toggleButton}
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
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
  form: `
    flex flex-col gap-5
  `,
  errorBox: `
    p-3 bg-red-500/10 border border-red-500/30 rounded-lg
    text-red-400 text-sm text-center
  `,
  inputGroup: `
    flex flex-col gap-2
  `,
  label: `
    text-sm font-medium text-slate-300
  `,
  input: `
    w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg
    text-white placeholder-slate-500
    focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500
    transition-colors
  `,
  submitButton: `
    w-full py-3 mt-2
    bg-amber-500 text-slate-900 font-semibold rounded-lg
    hover:bg-amber-400 transition-colors
    disabled:opacity-50 disabled:cursor-not-allowed
    flex items-center justify-center
  `,
  buttonSpinner: `
    w-5 h-5 border-2 border-slate-900/30 border-t-slate-900
    rounded-full animate-spin
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

