'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout, type AppLayoutBreadcrumb } from '@/components';
import { WorkflowExecutionDetail } from '@/packages/workflow-execution-detail';
import { useAppSelector } from '@/store/hooks';

export default function WorkflowExecutionPage() {
  const router = useRouter();
  const currentWorkflow = useAppSelector((state) => state.currentWorkflow);
  const currentExecution = useAppSelector((state) => state.currentWorkflowExecution);

  const baseBreadcrumb = useMemo<AppLayoutBreadcrumb>(() => ({
    label: 'Workflows',
    href: '/workflows',
  }), []);

  const breadcrumbs = useMemo<AppLayoutBreadcrumb[]>(() => [
    { 
      label: currentWorkflow.name || 'Workflow', 
      onSelect: () => router.push(`/workflow/${currentWorkflow.id}`),
    },
    { label: `Execution ${currentExecution.id?.slice(0, 8) || ''}` },
  ], [currentWorkflow.name, currentWorkflow.id, currentExecution.id, router]);

  return (
    <AppLayout breadcrumbs={breadcrumbs} baseBreadcrumbOverride={baseBreadcrumb}>
      <WorkflowExecutionDetail />
    </AppLayout>
  );
}
