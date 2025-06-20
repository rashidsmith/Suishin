import { useState } from 'react';
import { apiRequest } from '@/lib/queryClient';

interface AIContentState {
  generatedIBOs: string | null;
  refinedIBOs: string | null;
  generatedActivities: string | null;
  isGenerating: boolean;
  error: string | null;
}

export const useAIContent = (sessionId: string | null) => {
  const [aiContent, setAIContent] = useState<AIContentState>({
    generatedIBOs: null,
    refinedIBOs: null,
    generatedActivities: null,
    isGenerating: false,
    error: null
  });

  const generateIBOs = async () => {
    if (!sessionId) {
      setAIContent(prev => ({ 
        ...prev, 
        error: 'No session ID provided' 
      }));
      return { success: false, error: 'No session ID provided' };
    }

    setAIContent(prev => ({ ...prev, isGenerating: true, error: null }));
    
    try {
      const response = await apiRequest(
        'POST',
        `/api/sessions/${sessionId}/generate-ibos`,
        {}
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate IBOs');
      }

      setAIContent(prev => ({
        ...prev,
        generatedIBOs: data.content,
        refinedIBOs: data.content, // Start with generated content
        isGenerating: false
      }));
      
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setAIContent(prev => ({
        ...prev,
        isGenerating: false,
        error: errorMessage
      }));
      return { success: false, error: errorMessage };
    }
  };

  const updateRefinedIBOs = (content: string) => {
    setAIContent(prev => ({ ...prev, refinedIBOs: content }));
  };

  const clearAIContent = () => {
    setAIContent({
      generatedIBOs: null,
      refinedIBOs: null,
      generatedActivities: null,
      isGenerating: false,
      error: null
    });
  };

  return {
    aiContent,
    generateIBOs,
    updateRefinedIBOs,
    clearAIContent
  };
};