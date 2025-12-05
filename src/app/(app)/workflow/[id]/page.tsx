'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout, type AppLayoutBreadcrumb } from '@/components';
import { WorkflowDetail } from '@/packages/workflow-detail';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { CurrentWorkflowActions } from '@/store/current';

export default function WorkflowPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentWorkflow = useAppSelector((state) => state.currentWorkflow);
  const workflows = useAppSelector((state) => state.workflows);
  const workflowList = Object.values(workflows);

  const breadcrumbs = useMemo<AppLayoutBreadcrumb[]>(() => {
    const menuItems = workflowList.map((workflow) => ({
      label: workflow.name,
      onSelect: () => {
        dispatch(CurrentWorkflowActions.setWorkflow(workflow));
        router.push(`/workflow/${workflow.id}`);
      },
      isActive: workflow.id === currentWorkflow.id,
    }));

    return [
      { 
        label: currentWorkflow.name || 'Workflow',
        menuItems: menuItems.length > 1 ? menuItems : undefined,
      },
    ];
  }, [currentWorkflow.name, currentWorkflow.id, workflowList, dispatch, router]);

  const baseBreadcrumb = useMemo<AppLayoutBreadcrumb>(() => ({
    label: 'Workflows',
    href: '/workflows',
  }), []);

  return (
    <AppLayout breadcrumbs={breadcrumbs} baseBreadcrumbOverride={baseBreadcrumb}>
      <WorkflowDetail />
    </AppLayout>
  );
}
