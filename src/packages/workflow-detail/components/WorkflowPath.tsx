'use client';

import { WorkflowPathStep } from '@/model';

interface WorkflowPathProps {
  steps: WorkflowPathStep[];
  activeStepId: string;
  onStepClick: (stepId: string) => void;
}

export const WorkflowPath = ({ steps, activeStepId, onStepClick }: WorkflowPathProps) => {
  if (steps.length === 0) return null;

  return (
    <div className={styles.container}>
      {steps.map((step, index) => {
        const isActive = activeStepId === step.id;
        const isPast = steps.findIndex((s) => s.id === activeStepId) > index;

        return (
          <div key={step.id} className={styles.stepWrapper}>
            <button
              onClick={() => onStepClick(step.id)}
              className={`${styles.step} ${isActive ? styles.stepActive : ''} ${isPast ? styles.stepPast : ''}`}
            >
              <span className={styles.index}>{index + 1}</span>
              <span className={styles.label}>{step.label}</span>
            </button>
            {index < steps.length - 1 && (
              <div className={`${styles.connector} ${isPast ? styles.connectorPast : ''}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

const styles = {
  container: `flex items-center overflow-x-auto`,
  stepWrapper: `flex items-center`,
  step: `
    flex items-center gap-2 px-3 py-1.5
    text-xs font-medium text-gray-500
    hover:text-gray-700
    transition-colors cursor-pointer whitespace-nowrap
  `,
  stepActive: `text-blue-600 font-semibold`,
  stepPast: `text-gray-400`,
  index: `
    w-5 h-5 flex items-center justify-center
    rounded-full text-[10px] font-semibold
    bg-gray-100 text-gray-500
  `,
  label: ``,
  connector: `w-8 h-px bg-gray-200`,
  connectorPast: `bg-gray-300`,
};
