'use client';

import { WorkflowList } from '@/packages/workflow-list';
import { WorkflowModal } from '@/packages/workflow-list/WorkflowModal';

export default function WelcomePage() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.breadcrumbsContainer}>
        <span className={styles.breadcrumb}>Workflows</span>
      </div>

      <div className={styles.header}>
        <h1 className={styles.title}>Workflows</h1>
        <p className={styles.subtitle}>Manage and trigger your N8N workflows</p>
      </div>

      <WorkflowList />
      <WorkflowModal />
    </div>
  );
}

const styles = {
  pageContainer: `
    w-full p-6
  `,
  breadcrumbsContainer: `
    mb-3
  `,
  breadcrumb: `
    text-sm text-slate-400 font-medium
  `,
  header: `
    mb-6
  `,
  title: `
    text-2xl font-bold text-white
  `,
  subtitle: `
    text-sm text-slate-500 mt-1
  `,
};

