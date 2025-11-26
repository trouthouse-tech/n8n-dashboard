'use client';

import { WorkflowExecutionDetail } from '../../../packages/workflow-execution-detail';

export default function WorkflowExecutionPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <WorkflowExecutionDetail />
      </div>
    </div>
  );
}

const styles = {
  container: `
    min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900
    p-4 md:p-6
  `,
  content: `
    w-full max-w-5xl mx-auto flex flex-col gap-4 py-6
  `,
};
