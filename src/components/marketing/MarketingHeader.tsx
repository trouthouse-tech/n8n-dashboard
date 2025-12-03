'use client';

import Link from 'next/link';
import { useAuth } from '@/context/auth';

export const MarketingHeader = () => {
  const { user, loading } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>⚡</span>
          <span className={styles.logoText}>N8N Dashboard</span>
        </Link>

        <nav className={styles.nav}>
          {loading ? (
            <div className={styles.loadingDot} />
          ) : user ? (
            <Link href="/welcome" className={styles.openAppButton}>
              Open App
            </Link>
          ) : (
            <Link href="/login" className={styles.loginButton}>
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

const styles = {
  header: `
    fixed top-0 left-0 right-0 z-50
    border-b border-slate-800 bg-slate-900/80 backdrop-blur-md
  `,
  container: `
    max-w-6xl mx-auto px-6 h-16
    flex items-center justify-between
  `,
  logo: `
    flex items-center gap-2 text-white font-semibold text-lg
    hover:opacity-80 transition-opacity
  `,
  logoIcon: `
    text-2xl
  `,
  logoText: `
    tracking-tight
  `,
  nav: `
    flex items-center gap-4
  `,
  loginButton: `
    px-4 py-2 text-sm font-medium text-slate-300
    hover:text-white transition-colors
  `,
  openAppButton: `
    px-4 py-2 text-sm font-medium
    bg-amber-500 text-slate-900 rounded-lg
    hover:bg-amber-400 transition-colors
  `,
  loadingDot: `
    w-2 h-2 bg-slate-600 rounded-full animate-pulse
  `,
};

