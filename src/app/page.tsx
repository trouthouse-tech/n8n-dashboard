'use client';

import Link from 'next/link';
import { useAuth } from '@/context/auth';
import { MarketingHeader } from '@/components/marketing';

export default function LandingPage() {
  const { user, loading } = useAuth();

  return (
    <div className={styles.page}>
      <MarketingHeader />

      <main className={styles.main}>
        <div className={styles.heroSection}>
          <div className={styles.badge}>
            <span className={styles.badgeIcon}>⚡</span>
            <span>Personal Automation Hub</span>
          </div>

          <h1 className={styles.heroTitle}>
            Trigger & Manage Your
            <br />
            <span className={styles.heroHighlight}>N8N Workflows</span>
          </h1>

          <p className={styles.heroDescription}>
            A personal dashboard to trigger N8N workflows via webhooks.
            Build custom request bodies, track executions, and view responses in real-time.
          </p>

          <div className={styles.ctaContainer}>
            {loading ? (
              <div className={styles.ctaLoading}>
                <div className={styles.spinner} />
              </div>
            ) : user ? (
              <Link href="/welcome" className={styles.ctaPrimary}>
                Open Dashboard
                <span className={styles.ctaArrow}>→</span>
              </Link>
            ) : (
              <>
                <Link href="/login" className={styles.ctaPrimary}>
                  Get Started
                  <span className={styles.ctaArrow}>→</span>
                </Link>
                <Link href="/login" className={styles.ctaSecondary}>
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>

        <div className={styles.featuresSection}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🔧</div>
            <h3 className={styles.featureTitle}>Workflow Management</h3>
            <p className={styles.featureDescription}>
              Create, edit, and organize your webhook configurations
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🚀</div>
            <h3 className={styles.featureTitle}>One-Click Triggers</h3>
            <p className={styles.featureDescription}>
              Execute workflows with custom parameters instantly
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📊</div>
            <h3 className={styles.featureTitle}>Execution History</h3>
            <p className={styles.featureDescription}>
              Track all runs with detailed request and response logs
            </p>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <p className={styles.footerText}>
          Built for personal automation workflows
        </p>
      </footer>
    </div>
  );
}

const styles = {
  page: `
    min-h-screen bg-slate-900
    flex flex-col
  `,
  main: `
    flex-1 flex flex-col items-center justify-center
    px-6 pt-24 pb-16
  `,
  heroSection: `
    max-w-2xl mx-auto text-center
  `,
  badge: `
    inline-flex items-center gap-2 px-3 py-1.5
    bg-slate-800 border border-slate-700 rounded-full
    text-xs text-slate-400 font-medium
    mb-6
  `,
  badgeIcon: `
    text-amber-500
  `,
  heroTitle: `
    text-4xl md:text-5xl font-bold text-white
    leading-tight tracking-tight
    mb-6
  `,
  heroHighlight: `
    text-transparent bg-clip-text
    bg-gradient-to-r from-amber-400 to-orange-500
  `,
  heroDescription: `
    text-lg text-slate-400 leading-relaxed
    max-w-lg mx-auto
    mb-8
  `,
  ctaContainer: `
    flex items-center justify-center gap-4
  `,
  ctaLoading: `
    h-12 flex items-center justify-center
  `,
  spinner: `
    w-5 h-5 border-2 border-slate-700 border-t-amber-500
    rounded-full animate-spin
  `,
  ctaPrimary: `
    inline-flex items-center gap-2 px-6 py-3
    bg-amber-500 text-slate-900 font-semibold rounded-lg
    hover:bg-amber-400 transition-colors
  `,
  ctaArrow: `
    text-lg
  `,
  ctaSecondary: `
    px-6 py-3 text-slate-400 font-medium
    hover:text-white transition-colors
  `,
  featuresSection: `
    max-w-4xl mx-auto mt-24
    grid grid-cols-1 md:grid-cols-3 gap-6
  `,
  featureCard: `
    p-6 bg-slate-800/50 border border-slate-700/50 rounded-xl
    text-center
  `,
  featureIcon: `
    text-3xl mb-4
  `,
  featureTitle: `
    text-white font-semibold mb-2
  `,
  featureDescription: `
    text-sm text-slate-400
  `,
  footer: `
    py-8 text-center border-t border-slate-800
  `,
  footerText: `
    text-sm text-slate-600
  `,
};
