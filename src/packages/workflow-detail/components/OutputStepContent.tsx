'use client';

import { useAppSelector } from '@/store/hooks';

interface OutputStepContentProps {
  stepId: string;
}

export const OutputStepContent = ({ stepId }: OutputStepContentProps) => {
  const pathSteps = useAppSelector((state) => state.currentWorkflow.pathSteps ?? []);
  const step = pathSteps.find((s) => s.id === stepId);

  if (!step) {
    return (
      <div className={styles.container}>
        <p className={styles.notFound}>Output configuration not found</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>{step.label}</h3>
        <p className={styles.subtitle}>Output destination (configured in n8n)</p>
      </div>

      <div className={styles.infoCard}>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Type</span>
          <span className={styles.infoValue}>{step.outputType || 'External'}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Action</span>
          <span className={styles.infoValue}>{step.label}</span>
        </div>
      </div>

      <p className={styles.note}>
        Output configuration is managed in your n8n workflow. 
        This dashboard will send data to this destination when triggered.
      </p>
    </div>
  );
};

const styles = {
  container: `flex flex-col gap-4`,
  header: ``,
  title: `text-lg font-semibold text-gray-900`,
  subtitle: `text-sm text-gray-500 mt-0.5`,
  notFound: `text-sm text-gray-400 italic`,
  infoCard: `bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col gap-2`,
  infoRow: `flex items-center justify-between`,
  infoLabel: `text-sm text-gray-500`,
  infoValue: `text-sm font-medium text-gray-900`,
  note: `text-xs text-gray-400 italic`,
};

