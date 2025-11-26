'use client';

import { WorkflowDetail } from '../../../packages/workflow-detail';

export default function WorkflowPage() {
  return (
    <div className={styles.container}>
      <div className={styles.column}>
        <WorkflowDetail />
      </div>
    </div>
  );
}

const styles = {
  container: `
    min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900
    flex justify-center p-4
  `,
  column: `
    w-full max-w-md flex flex-col gap-4 py-6
  `,
};
