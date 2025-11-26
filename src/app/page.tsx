'use client';

import { WorkflowList } from '../packages/workflow-list';
import { WorkflowModal } from '../packages/workflow-list/WorkflowModal';

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.column}>
        <header className={styles.header}>
          <div className={styles.logoMark} />
          <h1 className={styles.title}>N8N Workflow</h1>
          <p className={styles.subtitle}>Dashboard</p>
        </header>

        <WorkflowList />
        <WorkflowModal />
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
    w-full max-w-md flex flex-col gap-6 py-6
  `,
  header: `
    text-center py-4
  `,
  logoMark: `
    w-10 h-10 mx-auto mb-3 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500
    shadow-lg shadow-orange-500/30
  `,
  title: `
    text-2xl font-bold text-white tracking-tight
  `,
  subtitle: `
    text-slate-500 text-sm mt-1
  `,
};
