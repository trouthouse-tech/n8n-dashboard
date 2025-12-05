'use client';

import { AppLayout } from '@/components';
import { WorkflowsHeader } from '@/packages/workflow-list/WorkflowsHeader';
import { WorkflowList } from '@/packages/workflow-list';
import { WorkflowModal } from '@/packages/workflow-modal';

export default function WorkflowsPage() {
  return (
    <AppLayout>
      <div className={styles.pageContainer}>
        <WorkflowsHeader />
        <WorkflowList />
        <WorkflowModal />
      </div>
    </AppLayout>
  );
}

const styles = {
  pageContainer: `
    w-full
  `,
};

