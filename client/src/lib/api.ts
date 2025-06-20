import axios from 'axios';
import { IBO, CreateIBORequest } from '../types';

// Configure axios with base URL
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// IBO API functions
export const fetchIBOs = async (): Promise<IBO[]> => {
  try {
    const response = await api.get('/ibos');
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching IBOs:', error);
    throw error;
  }
};

export const fetchIBOById = async (id: string): Promise<IBO> => {
  try {
    const response = await api.get(`/ibos/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching IBO:', error);
    throw error;
  }
};

export const createIBO = async (iboData: CreateIBORequest): Promise<IBO> => {
  try {
    const response = await api.post('/ibos', iboData);
    return response.data.data;
  } catch (error) {
    console.error('Error creating IBO:', error);
    throw error;
  }
};

export const updateIBO = async (id: string, iboData: Partial<CreateIBORequest>): Promise<IBO> => {
  try {
    const response = await api.put(`/ibos/${id}`, iboData);
    return response.data.data;
  } catch (error) {
    console.error('Error updating IBO:', error);
    throw error;
  }
};

export const deleteIBO = async (id: string): Promise<void> => {
  try {
    await api.delete(`/ibos/${id}`);
  } catch (error) {
    console.error('Error deleting IBO:', error);
    throw error;
  }
};

// Card API functions
export const fetchCards = async () => {
  const response = await api.get('/cards');
  return response.data.data;
};

export const fetchCardById = async (id: string) => {
  const response = await api.get(`/cards/${id}`);
  return response.data.data;
};

export const createCard = async (cardData: {
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
}) => {
  const response = await api.post('/cards', cardData);
  return response.data.data;
};

export const updateCard = async (id: string, cardData: {
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
}) => {
  const response = await api.put(`/cards/${id}`, cardData);
  return response.data.data;
};

export const deleteCard = async (id: string): Promise<void> => {
  await api.delete(`/cards/${id}`);
};

// Session API functions
export const fetchSessions = async () => {
  const response = await api.get('/sessions');
  return response.data.data;
};

export const fetchSessionById = async (id: string) => {
  const response = await api.get(`/sessions/${id}`);
  return response.data.data;
};

export const createSession = async (sessionData: {
  user_id: string;
  learning_objective_id: string;
  title: string;
  description?: string;
  card_ids?: string[];
}) => {
  const response = await api.post('/sessions', sessionData);
  return response.data.data;
};

export const updateSession = async (id: string, sessionData: {
  title?: string;
  description?: string;
  status?: 'not_started' | 'in_progress' | 'completed' | 'paused';
  started_at?: string;
  completed_at?: string;
  card_ids?: string[];
}) => {
  const response = await api.put(`/sessions/${id}`, sessionData);
  return response.data.data;
};

export const deleteSession = async (id: string): Promise<void> => {
  await api.delete(`/sessions/${id}`);
};

export const updateSessionCard = async (sessionId: string, cardId: string, updateData: {
  response_data?: any;
  is_completed?: boolean;
  viewed_at?: string;
}) => {
  const response = await api.put(`/sessions/${sessionId}/cards/${cardId}`, updateData);
  return response.data.data;
};

// Export the configured axios instance for other API calls
export default api;

// Export as apiClient for backward compatibility
export { api as apiClient };