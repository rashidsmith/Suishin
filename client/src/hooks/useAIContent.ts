import { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/queryClient';
import * as api from '@/lib/api';

interface AIContentState {
  generatedIBOs: string | null;
  refinedIBOs: string | null;
  generatedActivities: string | null;
  isGenerating: boolean;
  error: string | null;
  isLoaded: boolean; // Track if we've loaded from database
}

export const useAIContent = (sessionId: string | null) => {
  const [aiContent, setAIContent] = useState<AIContentState>({
    generatedIBOs: null,
    refinedIBOs: null,
    generatedActivities: null,
    isGenerating: false,
    error: null,
    isLoaded: false
  });

  // Load saved draft content on mount
  useEffect(() => {
    const loadDraftContent = async () => {
      if (!sessionId || aiContent.isLoaded) return;
      
      try {
        const session = await api.getSession(sessionId);
        const updates: Partial<AIContentState> = { isLoaded: true };
        
        if (session.draft_ai_ibos) {
          updates.generatedIBOs = session.draft_ai_ibos;
          updates.refinedIBOs = session.draft_ai_ibos;
        }
        
        if (session.draft_ai_activities) {
          updates.generatedActivities = session.draft_ai_activities;
        }
        
        setAIContent(prev => ({ ...prev, ...updates }));
      } catch (error) {
        console.error('Failed to load draft content:', error);
        setAIContent(prev => ({ ...prev, isLoaded: true }));
      }
    };
    
    loadDraftContent();
  }, [sessionId, aiContent.isLoaded]);

  const generateIBOs = async () => {
    setAIContent(prev => ({ ...prev, isGenerating: true, error: null }));
    
    try {
      const response = await api.generateIBOs(sessionId);
      const newContent = response.content;
      
      setAIContent(prev => ({
        ...prev,
        generatedIBOs: newContent,
        refinedIBOs: newContent,
        isGenerating: false
      }));
      
      // Auto-save to database as draft
      await api.saveDraftIBOs(sessionId, newContent);
      
      return { success: true };
    } catch (error) {
      setAIContent(prev => ({
        ...prev,
        isGenerating: false,
        error: error.message
      }));
      return { success: false, error: error.message };
    }
  };

  const refineIBOs = async (refinementRequest: string) => {
    setAIContent(prev => ({ ...prev, isGenerating: true, error: null }));
    
    try {
      const response = await api.refineIBOs(sessionId, {
        currentContent: aiContent.refinedIBOs,
        refinementRequest
      });
      
      const refinedContent = response.content;
      setAIContent(prev => ({
        ...prev,
        refinedIBOs: refinedContent,
        isGenerating: false
      }));

      // Auto-save refined content to database
      await api.saveDraftIBOs(sessionId, refinedContent);
      
      return { success: true };
    } catch (error) {
      setAIContent(prev => ({
        ...prev,
        isGenerating: false,
        error: error.message
      }));
      return { success: false, error: error.message };
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
      error: null,
      isLoaded: false
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