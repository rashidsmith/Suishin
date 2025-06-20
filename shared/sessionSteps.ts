export interface SessionStep {
  id: string;
  title: string;
  icon: string;
  validates: (session: any) => boolean;
}

export const SESSION_STEPS: SessionStep[] = [
  { 
    id: 'persona', 
    title: 'Select Persona', 
    icon: '👥',
    validates: (session) => !!session?.persona_id 
  },
  { 
    id: 'topic', 
    title: 'Topic & Goals', 
    icon: '🎯',
    validates: (session) => !!session?.topic && !!session?.business_goals 
  },
  { 
    id: 'generate-ibos', 
    title: 'Generate IBOs', 
    icon: '🤖',
    validates: (session) => false // Will implement in next prompt
  },
  { 
    id: 'refine-ibos', 
    title: 'Refine IBOs', 
    icon: '✏️',
    validates: (session) => false // Will implement later
  },
  { 
    id: 'choose-modality', 
    title: 'Choose Modality', 
    icon: '🚀',
    validates: (session) => !!session?.modality 
  },
  { 
    id: 'build-activities', 
    title: 'Build Activities', 
    icon: '📚',
    validates: (session) => false // Will implement later
  }
];

export const getStepIndex = (stepId: string): number => {
  return SESSION_STEPS.findIndex(step => step.id === stepId);
};

export const getNextStep = (currentStepId: string): SessionStep | null => {
  const currentIndex = getStepIndex(currentStepId);
  if (currentIndex >= 0 && currentIndex < SESSION_STEPS.length - 1) {
    return SESSION_STEPS[currentIndex + 1];
  }
  return null;
};

export const getPreviousStep = (currentStepId: string): SessionStep | null => {
  const currentIndex = getStepIndex(currentStepId);
  if (currentIndex > 0) {
    return SESSION_STEPS[currentIndex - 1];
  }
  return null;
};