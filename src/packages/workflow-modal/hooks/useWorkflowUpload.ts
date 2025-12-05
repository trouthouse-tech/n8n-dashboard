'use client';

import { useCallback, useRef } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { WorkflowBuilderActions } from '@/store/builders';
import { CurrentWorkflowActions } from '@/store/current';
import { parseN8nWorkflowFromString, extractPathSteps } from '@/lib/n8n';

export const useWorkflowUpload = () => {
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (file: File) => {
    dispatch(WorkflowBuilderActions.setUploadError(null));

    if (!file.name.endsWith('.json')) {
      dispatch(WorkflowBuilderActions.setUploadError('Please upload a JSON file'));
      return;
    }

    try {
      const text = await file.text();
      const parsed = parseN8nWorkflowFromString(text);

      if (!parsed.isValid) {
        dispatch(WorkflowBuilderActions.setUploadError(parsed.warnings[0] || 'Invalid workflow file'));
        return;
      }

      dispatch(WorkflowBuilderActions.setParsedWorkflow(parsed));
      dispatch(CurrentWorkflowActions.setName(parsed.name));

      if (parsed.primaryWebhook) {
        const webhookUrl = `https://n8n.example.com/webhook/${parsed.primaryWebhook.path}`;
        dispatch(CurrentWorkflowActions.setWebhookUrl(webhookUrl));
      }

      // Auto-add detected params as default body params
      if (parsed.detectedParams.length > 0) {
        for (const param of parsed.detectedParams) {
          dispatch(
            CurrentWorkflowActions.addBodyParam({
              id: crypto.randomUUID(),
              key: param.key,
              value: '',
            })
          );
        }
      }

      // Extract agent prompts
      if (parsed.agents.length > 0) {
        const agentPrompts = parsed.agents.map((agent) => ({
          id: crypto.randomUUID(),
          nodeId: agent.nodeId,
          nodeName: agent.nodeName,
          userPrompt: agent.userPrompt,
          systemPrompt: agent.systemPrompt,
        }));
        dispatch(CurrentWorkflowActions.setAgentPrompts(agentPrompts));
      }

      // Extract path steps
      const pathSteps = extractPathSteps(parsed);
      dispatch(CurrentWorkflowActions.setPathSteps(pathSteps));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      dispatch(WorkflowBuilderActions.setUploadError(`Failed to read file: ${message}`));
    }
  }, [dispatch]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dispatch(WorkflowBuilderActions.setIsDragging(true));
  }, [dispatch]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dispatch(WorkflowBuilderActions.setIsDragging(false));
  }, [dispatch]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dispatch(WorkflowBuilderActions.setIsDragging(false));
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [dispatch, processFile]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleClearUpload = useCallback(() => {
    dispatch(WorkflowBuilderActions.clearUpload());
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [dispatch]);

  const openFilePicker = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return {
    fileInputRef,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileSelect,
    handleClearUpload,
    openFilePicker,
  };
};

