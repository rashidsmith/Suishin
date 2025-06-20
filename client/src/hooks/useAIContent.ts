import { useState, useEffect } from 'react';
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

  // Load persisted AI content from database when sessionId changes
  useEffect(() => {
    const loadPersistedContent = async () => {
      if (!sessionId) return;

      try {
        const response = await fetch(`/api/sessions/${sessionId}`);
        const sessionData = await response.json();
        
        if (sessionData.data) {
          const session = sessionData.data;
          setAIContent(prev => ({
            ...prev,
            generatedIBOs: session.draft_ai_ibos || null,
            refinedIBOs: session.draft_ai_ibos || null, // Start with generated content
            generatedActivities: session.draft_ai_activities || null
          }));
        }
      } catch (error) {
        console.error('Failed to load persisted AI content:', error);
      }
    };

    loadPersistedContent();
  }, [sessionId]);

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

      // Persist to database
      await fetch(`/api/sessions/${sessionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          draft_ai_ibos: data.content
        })
      });
      
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

  const refineIBOs = async (refinementRequest: string) => {
    if (!sessionId || !aiContent.refinedIBOs) {
      setAIContent(prev => ({ 
        ...prev, 
        error: 'No content to refine or session ID missing' 
      }));
      return { success: false, error: 'No content to refine or session ID missing' };
    }

    setAIContent(prev => ({ ...prev, isGenerating: true, error: null }));
    
    try {
      const response = await apiRequest(
        'POST',
        `/api/sessions/${sessionId}/refine-ibos`,
        {
          currentContent: aiContent.refinedIBOs,
          refinementRequest: refinementRequest
        }
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to refine IBOs');
      }

      setAIContent(prev => ({
        ...prev,
        refinedIBOs: data.content,
        isGenerating: false
      }));

      // Persist refined content to database
      await fetch(`/api/sessions/${sessionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          draft_ai_ibos: data.content
        })
      });
      
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

  const updateRefinedIBOs = async (content: string) => {
    setAIContent(prev => ({ ...prev, refinedIBOs: content }));
    
    // Persist manual edits to database
    if (sessionId) {
      try {
        await fetch(`/api/sessions/${sessionId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            draft_ai_ibos: content
          })
        });
      } catch (error) {
        console.error('Failed to persist manual IBO edits:', error);
      }
    }
  };

  const saveActivities = async (content: string) => {
    setAIContent(prev => ({ ...prev, generatedActivities: content }));
    
    // Persist 4C activities to database
    if (sessionId) {
      try {
        await fetch(`/api/sessions/${sessionId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            draft_ai_activities: content
          })
        });
      } catch (error) {
        console.error('Failed to persist 4C activities:', error);
      }
    }
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
    refineIBOs,
    updateRefinedIBOs,
    saveActivities,
    clearAIContent
  };
};