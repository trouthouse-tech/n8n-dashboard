'use client';

import Link from 'next/link';

export const MarketingHeader = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>⚡</span>
          <span className={styles.logoText}>N8N Dashboard</span>
        </Link>

        <nav className={styles.nav}>
          <Link href="/welcome" className={styles.openAppButton}>
            Open App
          </Link>
        </nav>
      </div>
    </header>
  );
};

const styles = {
  header: `
    fixed top-0 left-0 right-0 z-50
    border-b border-gray-200 bg-white/80 backdrop-blur-md
  `,
  container: `
    max-w-6xl mx-auto px-6 h-16
    flex items-center justify-between
  `,
  logo: `
    flex items-center gap-2 text-gray-900 font-semibold text-lg
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
  openAppButton: `
    px-4 py-2 text-sm font-medium
    bg-blue-600 text-white rounded
    hover:bg-blue-700 transition-colors
  `,
};
