'use client';

import { AppLayout } from '@/components';

export default function WelcomePage() {
  return (
    <AppLayout>
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.headerIcon}>
              <svg className={styles.headerIconSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 11l3 3L22 4" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className={styles.headerText}>
              <h2 className={styles.title}>Quick Actions</h2>
              <p className={styles.subtitle}>Get started with common tasks</p>
            </div>
          </div>
          
          <div className={styles.list}>
            <TriggerRedditWorkflowAction />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

/**
 * Placeholder action for triggering Reddit workflow.
 */
const TriggerRedditWorkflowAction = () => {
  return (
    <div className={actionStyles.container}>
      <div className={actionStyles.left}>
        <div className={actionStyles.iconWrapper}>
          <svg className={actionStyles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
        </div>
        <div className={actionStyles.textGroup}>
          <span className={actionStyles.label}>Trigger Reddit Workflow</span>
          <span className={actionStyles.sublabel}>Run Reddit scraping automation</span>
        </div>
      </div>
      <div className={actionStyles.right}>
        <button className={actionStyles.button}>
          Coming Soon
        </button>
      </div>
    </div>
  );
};

const styles = {
  wrapper: `
    flex items-start justify-center pt-8
  `,
  container: `
    bg-white border border-gray-300 rounded-lg shadow-sm
    max-w-2xl w-full
    overflow-hidden
  `,
  header: `
    px-5 py-4 border-b border-gray-200
    bg-gray-50
    flex items-center gap-3
  `,
  headerIcon: `
    w-9 h-9 rounded-lg bg-blue-600
    flex items-center justify-center
    flex-shrink-0
  `,
  headerIconSvg: `
    w-4.5 h-4.5 text-white
  `,
  headerText: `
    flex flex-col
  `,
  title: `
    text-base font-semibold text-gray-900
    tracking-tight
  `,
  subtitle: `
    text-xs text-gray-500
  `,
  list: `
    divide-y divide-gray-200
  `,
};

const actionStyles = {
  container: `
    flex items-center justify-between px-5 py-4
    hover:bg-gray-50 transition-colors
    group
  `,
  left: `
    flex items-center gap-4
  `,
  iconWrapper: `
    w-10 h-10 rounded-lg bg-blue-50
    flex items-center justify-center
    group-hover:bg-blue-100 transition-colors
  `,
  icon: `
    w-5 h-5 text-blue-600
  `,
  textGroup: `
    flex flex-col
  `,
  label: `
    text-sm font-medium text-gray-900
  `,
  sublabel: `
    text-xs text-gray-500
  `,
  right: `
    flex items-center
  `,
  button: `
    text-sm font-medium text-gray-400 
    bg-gray-100 border border-gray-200 rounded-lg
    px-4 py-2
    cursor-not-allowed
  `,
};
