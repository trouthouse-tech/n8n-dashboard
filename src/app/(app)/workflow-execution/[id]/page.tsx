'use client';

import { useRouter } from 'next/navigation';
import { WorkflowExecutionDetail } from '@/packages/workflow-execution-detail';
import { useAppSelector } from '@/store/hooks';

export default function WorkflowExecutionPage() {
  const router = useRouter();
  const currentWorkflow = useAppSelector((state) => state.currentWorkflow);
  const currentExecution = useAppSelector((state) => state.currentWorkflowExecution);

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
        <button 
          onClick={() => router.push(`/workflow/${currentWorkflow.id}`)}
          className={styles.breadcrumbLink}
        >
          {currentWorkflow.name || 'Workflow'}
        </button>
        <span className={styles.breadcrumbSeparator}>/</span>
        <span className={styles.breadcrumb}>
          Execution {currentExecution.id?.slice(0, 8) || ''}
        </span>
      </div>

      <WorkflowExecutionDetail />
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

