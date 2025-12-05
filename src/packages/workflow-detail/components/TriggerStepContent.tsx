'use client';

import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { triggerWorkflowThunk } from '@/store/thunks';
import { Workflow, WorkflowPathStep } from '@/model';

interface TriggerStepContentProps {
  steps: WorkflowPathStep[];
  onNavigateToStep: (stepId: string) => void;
}

export const TriggerStepContent = ({ steps, onNavigateToStep }: TriggerStepContentProps) => {
  const dispatch = useAppDispatch();
  const workflow = useAppSelector((state) => state.currentWorkflow);
  const responses = useAppSelector((state) => state.workflowResponses);
  const isExecuting = useAppSelector((state) => state.workflowBuilder.isExecuting);

  const [latestResponseId, setLatestResponseId] = useState<string | null>(null);

  const params = workflow.defaultBody?.filter((p) => p.key) ?? [];
  const agents = workflow.agentPrompts ?? [];
  
  // Check if all required params have values
  const missingParams = params.filter((p) => !p.value || p.value.trim() === '');
  const canTrigger = missingParams.length === 0;

  const handleTrigger = async () => {
    if (!canTrigger) return;
    
    const result = await dispatch(
      triggerWorkflowThunk({
        workflowId: workflow.id,
        webhookUrl: workflow.webhookUrl,
        bodyParams: params,
      })
    );
    if (result.status === 200 && result.responseId) {
      setLatestResponseId(result.responseId);
    }
  };

  const latestResponse = latestResponseId ? responses[latestResponseId] : null;
  const inputStep = steps.find((s) => s.type === 'input');
  const outputStep = steps.find((s) => s.type === 'output');

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Review & Trigger</h3>

      {/* Input Parameters */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionLeft}>
            <span className={styles.sectionIcon}>📥</span>
            <span className={styles.sectionLabel}>Input</span>
          </div>
          {inputStep && (
            <button onClick={() => onNavigateToStep(inputStep.id)} className={styles.editButton}>
              ✏️
            </button>
          )}
        </div>
        {params.length > 0 ? (
          <div className={styles.valueGrid}>
            {params.map((p) => (
              <div key={p.id} className={styles.valueRow}>
                <span className={styles.valueKey}>{p.key}</span>
                <span className={`${styles.valueText} ${!p.value ? styles.valueMissing : ''}`}>
                  {p.value || 'Required'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.emptyText}>No parameters configured</p>
        )}
      </div>

      {/* AI Agents */}
      {agents.map((agent) => {
        const agentStep = steps.find((s) => s.type === 'agent' && s.nodeId === agent.nodeId);
        return (
          <AgentSection
            key={agent.id}
            agent={agent}
            onEdit={agentStep ? () => onNavigateToStep(agentStep.id) : undefined}
          />
        );
      })}

      {/* Output */}
      {outputStep && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionLeft}>
              <span className={styles.sectionIcon}>📤</span>
              <span className={styles.sectionLabel}>Output</span>
            </div>
          </div>
          <div className={styles.outputCard}>
            <span className={styles.outputName}>{outputStep.label}</span>
            <span className={styles.outputType}>{outputStep.outputType || 'External'}</span>
          </div>
        </div>
      )}

      {/* Validation Message */}
      {!canTrigger && (
        <div className={styles.validationMessage}>
          Missing required values: {missingParams.map((p) => p.key).join(', ')}
        </div>
      )}

      <button
        onClick={handleTrigger}
        disabled={isExecuting || !canTrigger}
        className={styles.triggerButton}
      >
        {isExecuting ? <span className={styles.spinner} /> : null}
        {isExecuting ? 'Executing...' : 'Trigger Workflow'}
      </button>

      {latestResponse && (
        <div className={styles.responseSection}>
          <span className={styles.responseLabel}>Response</span>
          <pre className={styles.responseBox}>{latestResponse.raw}</pre>
        </div>
      )}
    </div>
  );
};

interface AgentSectionProps {
  agent: Workflow['agentPrompts'][0];
  onEdit?: () => void;
}

const AgentSection = ({ agent, onEdit }: AgentSectionProps) => {
  const [showSystem, setShowSystem] = useState(false);
  const [showUser, setShowUser] = useState(false);

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionLeft}>
          <span className={styles.sectionIcon}>🤖</span>
          <span className={styles.sectionLabel}>{agent.nodeName}</span>
        </div>
        {onEdit && (
          <button onClick={onEdit} className={styles.editButton}>
            ✏️
          </button>
        )}
      </div>

      <div className={styles.promptsContainer}>
        {/* System Prompt */}
        <div className={styles.promptSection}>
          <button onClick={() => setShowSystem(!showSystem)} className={styles.promptHeader}>
            <span className={styles.promptLabel}>System Message</span>
            <span className={styles.promptToggle}>{showSystem ? '▼' : '▶'}</span>
          </button>
          {showSystem && (
            <pre className={styles.promptContent}>
              {agent.systemPrompt || '(No system message)'}
            </pre>
          )}
          {!showSystem && agent.systemPrompt && (
            <span className={styles.promptPreview}>
              {agent.systemPrompt.slice(0, 50)}...
            </span>
          )}
        </div>

        {/* User Prompt */}
        <div className={styles.promptSection}>
          <button onClick={() => setShowUser(!showUser)} className={styles.promptHeader}>
            <span className={styles.promptLabel}>User Message</span>
            <span className={styles.promptToggle}>{showUser ? '▼' : '▶'}</span>
          </button>
          {showUser && (
            <pre className={styles.promptContent}>
              {agent.userPrompt || '(No user message)'}
            </pre>
          )}
          {!showUser && agent.userPrompt && (
            <span className={styles.promptPreview}>
              {agent.userPrompt.slice(0, 50)}...
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: `flex flex-col gap-4`,
  title: `text-sm font-semibold text-gray-900 uppercase tracking-wide`,
  section: `flex flex-col gap-2`,
  sectionHeader: `flex items-center justify-between`,
  sectionLeft: `flex items-center gap-2`,
  sectionIcon: `text-sm`,
  sectionLabel: `text-xs font-medium text-gray-500 uppercase tracking-wide`,
  editButton: `
    text-sm opacity-50 hover:opacity-100 transition-opacity cursor-pointer
    p-1 rounded hover:bg-gray-100
  `,
  valueGrid: `flex flex-col gap-1 pl-5`,
  valueRow: `flex items-center gap-3 text-sm`,
  valueKey: `text-gray-500 min-w-[100px]`,
  valueText: `text-gray-900 font-mono`,
  valueMissing: `text-red-500 italic`,
  emptyText: `text-sm text-gray-400 pl-5`,
  promptsContainer: `flex flex-col gap-2 pl-5`,
  promptSection: `flex flex-col gap-1`,
  promptHeader: `
    flex items-center justify-between w-full text-left
    text-xs text-gray-600 hover:text-gray-900
    cursor-pointer py-1
  `,
  promptLabel: `font-medium`,
  promptToggle: `text-[10px] text-gray-400`,
  promptPreview: `text-xs text-gray-400 font-mono pl-0`,
  promptContent: `
    text-xs text-gray-700 font-mono bg-gray-50 rounded p-2
    whitespace-pre-wrap max-h-32 overflow-y-auto
  `,
  outputCard: `flex items-center justify-between bg-gray-50 rounded p-3 ml-5`,
  outputName: `text-sm font-medium text-gray-900`,
  outputType: `text-xs text-gray-500`,
  validationMessage: `
    text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2
  `,
  triggerButton: `
    w-full py-2.5 bg-blue-600 text-white text-sm font-medium rounded
    hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
    transition-colors cursor-pointer flex items-center justify-center gap-2
  `,
  spinner: `inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin`,
  responseSection: `flex flex-col gap-2`,
  responseLabel: `text-xs font-medium text-gray-500 uppercase tracking-wide`,
  responseBox: `
    p-3 bg-gray-50 border border-gray-200 rounded
    text-gray-700 text-xs font-mono whitespace-pre-wrap overflow-x-auto max-h-48 overflow-y-auto
  `,
};
