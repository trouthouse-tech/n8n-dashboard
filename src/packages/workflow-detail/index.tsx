'use client';

import { useState, useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
import {
  WorkflowPath,
  InputStepContent,
  AgentStepContent,
  OutputStepContent,
  TriggerStepContent,
} from './components';
import { ExecutionHistory } from './history';
import { WorkflowPathStep } from '@/model';

const TRIGGER_STEP: WorkflowPathStep = {
  id: 'trigger-step',
  type: 'trigger',
  label: 'Trigger',
};

export const WorkflowDetail = () => {
  const workflow = useAppSelector((state) => state.currentWorkflow);
  
  // Ensure trigger step is always present
  const pathSteps = useMemo(() => {
    const steps = workflow.pathSteps ?? [];
    const hasTrigger = steps.some((s) => s.type === 'trigger');
    if (hasTrigger) return steps;
    
    // If no steps at all, create input + trigger
    if (steps.length === 0) {
      return [
        { id: 'input-step', type: 'input' as const, label: 'Input' },
        TRIGGER_STEP,
      ];
    }
    
    // Add trigger to existing steps
    return [...steps, TRIGGER_STEP];
  }, [workflow.pathSteps]);

  const [activeStepId, setActiveStepId] = useState<string>(pathSteps[0]?.id ?? '');

  if (!workflow.id) {
    return (
      <div className={styles.notFound}>
        <p>Workflow not found</p>
      </div>
    );
  }

  const activeStep = pathSteps.find((s) => s.id === activeStepId);

  const renderStepContent = () => {
    if (!activeStep) return <InputStepContent />;

    switch (activeStep.type) {
      case 'input':
        return <InputStepContent />;
      case 'agent':
        return <AgentStepContent nodeId={activeStep.nodeId ?? ''} />;
      case 'output':
        return <OutputStepContent stepId={activeStep.id} />;
      case 'trigger':
        return <TriggerStepContent steps={pathSteps} onNavigateToStep={setActiveStepId} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{workflow.name}</h1>
      </div>

      {pathSteps.length > 0 && (
        <WorkflowPath steps={pathSteps} activeStepId={activeStepId} onStepClick={setActiveStepId} />
      )}

      <div className={styles.stepContent}>{renderStepContent()}</div>

      <ExecutionHistory workflowId={workflow.id} />
    </div>
  );
};

const styles = {
  container: `flex flex-col gap-3`,
  notFound: `text-center py-12 text-gray-500`,
  header: ``,
  title: `text-base font-semibold text-gray-900`,
  stepContent: `bg-white border border-gray-200 rounded-lg p-4`,
};
