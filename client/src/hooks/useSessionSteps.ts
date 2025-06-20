import { useState, useEffect } from 'react';
import { SESSION_STEPS, getStepIndex } from '../../../shared/sessionSteps';
import { apiRequest } from '../lib/queryClient';

export interface SessionStepHook {
  session: any;
  currentStepIndex: number;
  updateStep: (stepId: string) => Promise<void>;
  canAdvanceToStep: (stepId: string) => boolean;
  goToNextStep: () => Promise<void>;
  goToPreviousStep: () => Promise<void>;
  isStepComplete: (stepId: string) => boolean;
  loading: boolean;
  error: string | null;
}

export const useSessionSteps = (sessionId: string | null): SessionStepHook => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentStepIndex = session?.current_step 
    ? getStepIndex(session.current_step) 
    : 0;

  // Load session data
  useEffect(() => {
    if (!sessionId) return;
    
    const loadSession = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/sessions/${sessionId}`);
        const data = await response.json();
        if (data.data) {
          setSession(data.data);
        }
      } catch (err) {
        setError('Failed to load session');
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, [sessionId]);

  const updateStep = async (stepId: string) => {
    if (!sessionId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const currentSteps = session?.completed_steps ? 
        (typeof session.completed_steps === 'string' 
          ? JSON.parse(session.completed_steps) 
          : session.completed_steps) 
        : [];
      
      // Add current step to completed steps if not already there
      const updatedSteps = currentSteps.includes(session?.current_step) 
        ? currentSteps 
        : [...currentSteps, session?.current_step].filter(Boolean);

      const response = await fetch(`/api/sessions/${sessionId}/progress`, {
        method: 'PUT',
        body: JSON.stringify({
          current_step: stepId,
          completed_steps: updatedSteps
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.data) {
        setSession(data.data);
      }
    } catch (err) {
      setError('Failed to update step');
      console.error('Failed to update step:', err);
    } finally {
      setLoading(false);
    }
  };

  const canAdvanceToStep = (stepId: string): boolean => {
    const targetIndex = getStepIndex(stepId);
    const currentIndex = currentStepIndex;
    
    // Can only advance one step at a time or go back to any previous step
    return targetIndex <= currentIndex + 1 && targetIndex >= 0;
  };

  const goToNextStep = async () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < SESSION_STEPS.length) {
      await updateStep(SESSION_STEPS[nextIndex].id);
    }
  };

  const goToPreviousStep = async () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      await updateStep(SESSION_STEPS[prevIndex].id);
    }
  };

  const isStepComplete = (stepId: string): boolean => {
    const step = SESSION_STEPS.find(s => s.id === stepId);
    return step ? step.validates(session) : false;
  };

  return {
    session,
    currentStepIndex,
    updateStep,
    canAdvanceToStep,
    goToNextStep,
    goToPreviousStep,
    isStepComplete,
    loading,
    error
  };
};