'use client';

import { WorkflowExecutionDetail } from '../../../packages/workflow-execution-detail';

export default function WorkflowExecutionPage() {
  return (
    <div className={styles.container}>
      <div className={styles.column}>
        <WorkflowExecutionDetail />
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

