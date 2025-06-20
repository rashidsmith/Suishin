import { create } from 'zustand';
import { Persona } from '../../../shared/types';
import { 
  fetchPersonas, 
  createPersona as createPersonaAPI, 
  updatePersona as updatePersonaAPI, 
  deletePersona as deletePersonaAPI 
} from './api';

interface PersonaState {
  personas: Persona[];
  selectedPersona: Persona | null;
  loading: boolean;
  error: string | null;
}

interface PersonaStore extends PersonaState {
  loadPersonas: () => Promise<void>;
  createPersona: (personaData: {
    name: string;
    description: string;
    context: string;
    experience: string;
    motivations: string;
    constraints: string;
  }) => Promise<void>;
  selectPersona: (persona: Persona | null) => void;
  updatePersona: (id: string, personaData: {
    name?: string;
    description?: string;
    context?: string;
    experience?: string;
    motivations?: string;
    constraints?: string;
  }) => Promise<void>;
  deletePersona: (id: string) => Promise<void>;
  clearError: () => void;
}

export const usePersonaStore = create<PersonaStore>((set, get) => ({
  personas: [],
  selectedPersona: null,
  loading: false,
  error: null,

  loadPersonas: async () => {
    set({ loading: true, error: null });
    try {
      const personas = await fetchPersonas();
      set({ personas, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load personas',
        loading: false 
      });
    }
  },

  createPersona: async (personaData) => {
    set({ loading: true, error: null });
    try {
      const newPersona = await createPersonaAPI(personaData);
      const currentPersonas = get().personas;
      set({ 
        personas: [newPersona, ...currentPersonas],
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create persona',
        loading: false 
      });
    }
  },

  selectPersona: (persona: Persona | null) => {
    set({ selectedPersona: persona });
  },

  updatePersona: async (id: string, personaData) => {
    set({ loading: true, error: null });
    try {
      const updatedPersona = await updatePersonaAPI(id, personaData);
      const currentPersonas = get().personas;
      const updatedPersonas = currentPersonas.map(persona => 
        persona.id === id ? updatedPersona : persona
      );
      set({ 
        personas: updatedPersonas,
        selectedPersona: get().selectedPersona?.id === id ? updatedPersona : get().selectedPersona,
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update persona',
        loading: false 
      });
    }
  },

  deletePersona: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await deletePersonaAPI(id);
      const currentPersonas = get().personas;
      const filteredPersonas = currentPersonas.filter(persona => persona.id !== id);
      set({ 
        personas: filteredPersonas,
        selectedPersona: get().selectedPersona?.id === id ? null : get().selectedPersona,
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete persona',
        loading: false 
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));