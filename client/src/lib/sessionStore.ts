import { create } from 'zustand';
import { Session } from '../../../shared/types';
import { 
  fetchSessions, 
  createSession as createSessionAPI, 
  updateSession as updateSessionAPI, 
  deleteSession as deleteSessionAPI 
} from './api';

// Session Store
interface SessionState {
  sessions: Session[];
  selectedSession: Session | null;
  loading: boolean;
  error: string | null;
}

interface SessionStore extends SessionState {
  loadSessions: () => Promise<void>;
  createSession: (sessionData: {
    user_id: string;
    learning_objective_id: string;
    title: string;
    description?: string;
    card_ids?: string[];
  }) => Promise<void>;
  selectSession: (session: Session | null) => void;
  updateSession: (id: string, sessionData: {
    title?: string;
    description?: string;
    status?: 'not_started' | 'in_progress' | 'completed' | 'paused';
    started_at?: string;
    completed_at?: string;
    card_ids?: string[];
  }) => Promise<void>;
  deleteSession: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useSessionStore = create<SessionStore>((set, get) => ({
  sessions: [],
  selectedSession: null,
  loading: false,
  error: null,

  loadSessions: async () => {
    set({ loading: true, error: null });
    try {
      const sessions = await fetchSessions();
      set({ sessions, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load sessions',
        loading: false 
      });
    }
  },

  createSession: async (sessionData) => {
    set({ loading: true, error: null });
    try {
      const newSession = await createSessionAPI(sessionData);
      const currentSessions = get().sessions;
      set({ 
        sessions: [newSession, ...currentSessions],
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create session',
        loading: false 
      });
    }
  },

  selectSession: (session) => {
    set({ selectedSession: session });
  },

  updateSession: async (id, sessionData) => {
    set({ loading: true, error: null });
    try {
      const updatedSession = await updateSessionAPI(id, sessionData);
      const currentSessions = get().sessions;
      const updatedSessions = currentSessions.map(session => 
        session.id === id ? updatedSession : session
      );
      set({ 
        sessions: updatedSessions,
        selectedSession: get().selectedSession?.id === id ? updatedSession : get().selectedSession,
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update session',
        loading: false 
      });
    }
  },

  deleteSession: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteSessionAPI(id);
      const currentSessions = get().sessions;
      const filteredSessions = currentSessions.filter(session => session.id !== id);
      set({ 
        sessions: filteredSessions,
        selectedSession: get().selectedSession?.id === id ? null : get().selectedSession,
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete session',
        loading: false 
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));