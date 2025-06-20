import { create } from 'zustand';
import { AppState, User } from '../types';
import { IBO } from '../../../shared/types';
import { fetchIBOs, createIBO as createIBOAPI, updateIBO as updateIBOAPI, deleteIBO as deleteIBOAPI } from './api';

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