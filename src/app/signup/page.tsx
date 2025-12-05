'use client';

import Link from 'next/link';
import { SignUpForm } from '@/packages/signup';

export default function SignupPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Link href="/" className={styles.backLink}>
          ← Back to home
        </Link>

        <div className={styles.card}>
          <div className={styles.header}>
            <div className={styles.logoMark}>⚡</div>
            <h1 className={styles.title}>Set Up Your Profile</h1>
            <p className={styles.subtitle}>
              Tell us a bit about yourself to personalize your experience
            </p>
          </div>

          <SignUpForm />

          <p className={styles.footerNote}>
            Your data is stored locally in your browser. No account required.
          </p>
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
  footerNote: `
    mt-6 pt-6 border-t border-gray-200
    text-xs text-gray-400 text-center
  `,
};
