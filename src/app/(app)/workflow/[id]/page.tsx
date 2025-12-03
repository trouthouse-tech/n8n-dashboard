'use client';

import { useRouter } from 'next/navigation';
import { WorkflowDetail } from '@/packages/workflow-detail';
import { useAppSelector } from '@/store/hooks';

export default function WorkflowPage() {
  const router = useRouter();
  const currentWorkflow = useAppSelector((state) => state.currentWorkflow);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.breadcrumbsContainer}>
        <button 
          onClick={() => router.push('/welcome')}
          className={styles.breadcrumbLink}
        >
          Workflows
        </button>
        <span className={styles.breadcrumbSeparator}>/</span>
        <span className={styles.breadcrumb}>
          {currentWorkflow.name || 'Workflow'}
        </span>
      </div>

      <WorkflowDetail />
    </div>
  );
}

const styles = {
  pageContainer: `
    w-full p-6
  `,
  breadcrumbsContainer: `
    mb-4 flex items-center gap-2
  `,
  breadcrumbLink: `
    text-sm text-amber-500 font-medium
    hover:text-amber-400 transition-colors
  `,
  breadcrumbSeparator: `
    text-slate-600
  `,
  breadcrumb: `
    text-sm text-slate-400 font-medium
  `,
};

