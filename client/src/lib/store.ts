import { create } from 'zustand';
import { AppState, User } from '../types';
import { IBO, Session, Persona } from '../../../shared/types';
import { 
  fetchIBOs, createIBO as createIBOAPI, updateIBO as updateIBOAPI, deleteIBO as deleteIBOAPI, 
  fetchCards, createCard as createCardAPI, updateCard as updateCardAPI, deleteCard as deleteCardAPI,
  fetchSessions, createSession as createSessionAPI, updateSession as updateSessionAPI, deleteSession as deleteSessionAPI,
  fetchPersonas, createPersona as createPersonaAPI, updatePersona as updatePersonaAPI, deletePersona as deletePersonaAPI 
} from './api';

interface CardData {
  id: string;
  title: string;
  description?: string;
  ibo_id: string;
  learning_objective_id: string;
  target_duration: number;
  activities: Array<{
    id: string;
    title: string;
    description?: string;
    type: 'C1' | 'C2' | 'C3' | 'C4';
    duration: number;
    order_index: number;
  }>;
  created_at: string;
  updated_at: string;
}

interface AppStore extends AppState {
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));

// IBO Store
interface IBOState {
  ibos: IBO[];
  selectedIBO: IBO | null;
  loading: boolean;
  error: string | null;
}

interface IBOStore extends IBOState {
  loadIBOs: () => Promise<void>;
  createIBO: (title: string, description?: string) => Promise<void>;
  selectIBO: (ibo: IBO | null) => void;
  updateIBO: (id: string, data: Partial<{ title: string; description: string }>) => Promise<void>;
  deleteIBO: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useIBOStore = create<IBOStore>((set, get) => ({
  ibos: [],
  selectedIBO: null,
  loading: false,
  error: null,

  loadIBOs: async () => {
    set({ loading: true, error: null });
    try {
      const ibos = await fetchIBOs();
      set({ ibos, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load IBOs',
        loading: false 
      });
    }
  },

  createIBO: async (title: string, description?: string) => {
    set({ loading: true, error: null });
    try {
      const newIBO = await createIBOAPI({ title, description: description || '' });
      const currentIBOs = get().ibos;
      set({ 
        ibos: [...currentIBOs, newIBO],
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create IBO',
        loading: false 
      });
    }
  },

  selectIBO: (ibo: IBO | null) => {
    set({ selectedIBO: ibo });
  },

  updateIBO: async (id: string, data: Partial<{ title: string; description: string }>) => {
    set({ loading: true, error: null });
    try {
      const updatedIBO = await updateIBOAPI(id, data);
      const currentIBOs = get().ibos;
      const updatedIBOs = currentIBOs.map(ibo => 
        ibo.id === id ? updatedIBO : ibo
      );
      set({ 
        ibos: updatedIBOs,
        selectedIBO: get().selectedIBO?.id === id ? updatedIBO : get().selectedIBO,
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update IBO',
        loading: false 
      });
    }
  },

  deleteIBO: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await deleteIBOAPI(id);
      const currentIBOs = get().ibos;
      const filteredIBOs = currentIBOs.filter(ibo => ibo.id !== id);
      set({ 
        ibos: filteredIBOs,
        selectedIBO: get().selectedIBO?.id === id ? null : get().selectedIBO,
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete IBO',
        loading: false 
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));

// Card Store
interface CardState {
  cards: CardData[];
  selectedCard: CardData | null;
  loading: boolean;
  error: string | null;
}

interface CardStore extends CardState {
  loadCards: () => Promise<void>;
  createCard: (cardData: {
    title: string;
    description?: string;
    ibo_id: string;
    learning_objective_id: string;
    target_duration: number;
    activities: Array<{
      title: string;
      description?: string;
      type: 'C1' | 'C2' | 'C3' | 'C4';
      duration: number;
    }>;
  }) => Promise<void>;
  selectCard: (card: CardData | null) => void;
  updateCard: (id: string, cardData: {
    title: string;
    description?: string;
    ibo_id: string;
    learning_objective_id: string;
    target_duration: number;
    activities: Array<{
      title: string;
      description?: string;
      type: 'C1' | 'C2' | 'C3' | 'C4';
      duration: number;
    }>;
  }) => Promise<void>;
  deleteCard: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useCardStore = create<CardStore>((set, get) => ({
  cards: [],
  selectedCard: null,
  loading: false,
  error: null,

  loadCards: async () => {
    set({ loading: true, error: null });
    try {
      const cards = await fetchCards();
      set({ cards, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load cards',
        loading: false 
      });
    }
  },

  createCard: async (cardData) => {
    set({ loading: true, error: null });
    try {
      const newCard = await createCardAPI(cardData);
      const currentCards = get().cards;
      set({ 
        cards: [newCard, ...currentCards],
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create card',
        loading: false 
      });
    }
  },

  selectCard: (card: CardData | null) => {
    set({ selectedCard: card });
  },

  updateCard: async (id: string, cardData) => {
    set({ loading: true, error: null });
    try {
      const updatedCard = await updateCardAPI(id, cardData);
      const currentCards = get().cards;
      const updatedCards = currentCards.map(card => 
        card.id === id ? updatedCard : card
      );
      set({ 
        cards: updatedCards,
        selectedCard: get().selectedCard?.id === id ? updatedCard : get().selectedCard,
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update card',
        loading: false 
      });
    }
  },

  deleteCard: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await deleteCardAPI(id);
      const currentCards = get().cards;
      const filteredCards = currentCards.filter(card => card.id !== id);
      set({ 
        cards: filteredCards,
        selectedCard: get().selectedCard?.id === id ? null : get().selectedCard,
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete card',
        loading: false 
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));