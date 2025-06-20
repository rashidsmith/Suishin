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
export const fetchIBOs = async (params?: { personaId?: string; topic?: string }): Promise<IBO[]> => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.personaId) {
      queryParams.append('personaId', params.personaId);
    }
    if (params?.topic) {
      queryParams.append('topic', params.topic);
    }
    
    const url = queryParams.toString() ? `/ibos?${queryParams.toString()}` : '/ibos';
    const response = await api.get(url);
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
export const fetchSessions = async (params?: { 
  personaId?: string; 
  modality?: string; 
  topic?: string; 
  status?: string; 
}) => {
  let url = '/sessions';
  if (params) {
    const searchParams = new URLSearchParams();
    if (params.personaId) searchParams.append('personaId', params.personaId);
    if (params.modality) searchParams.append('modality', params.modality);
    if (params.topic) searchParams.append('topic', params.topic);
    if (params.status) searchParams.append('status', params.status);
    
    const queryString = searchParams.toString();
    if (queryString) url += `?${queryString}`;
  }
  
  const response = await api.get(url);
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
  persona_id: string;
  topic: string;
  modality: 'onsite' | 'virtual' | 'hybrid';
  business_goals: string;
  card_ids?: string[];
}) => {
  const response = await api.post('/sessions', sessionData);
  return response.data.data;
};

export const updateSession = async (id: string, sessionData: {
  title?: string;
  persona_id?: string;
  topic?: string;
  modality?: 'onsite' | 'virtual' | 'hybrid';
  business_goals?: string;
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

// Performance Metrics API functions
export const fetchPerformanceMetricsByIBO = async (iboId: string) => {
  try {
    const response = await api.get(`/performance-metrics/ibo/${iboId}`);
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching performance metrics:', error);
    throw error;
  }
};

export const createPerformanceMetric = async (metricData: {
  text: string;
  ibo_id: string;
  sort_order?: number;
}) => {
  try {
    const response = await api.post('/performance-metrics', metricData);
    return response.data.data;
  } catch (error) {
    console.error('Error creating performance metric:', error);
    throw error;
  }
};

export const updatePerformanceMetric = async (id: string, metricData: {
  text?: string;
  sort_order?: number;
}) => {
  try {
    const response = await api.put(`/performance-metrics/${id}`, metricData);
    return response.data.data;
  } catch (error) {
    console.error('Error updating performance metric:', error);
    throw error;
  }
};

export const deletePerformanceMetric = async (id: string): Promise<void> => {
  try {
    await api.delete(`/performance-metrics/${id}`);
  } catch (error) {
    console.error('Error deleting performance metric:', error);
    throw error;
  }
};

// Observable Behaviors API functions
export const fetchObservableBehaviorsByPM = async (pmId: string) => {
  try {
    const response = await api.get(`/observable-behaviors/pm/${pmId}`);
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching observable behaviors:', error);
    throw error;
  }
};

export const createObservableBehavior = async (behaviorData: {
  text: string;
  pm_id: string;
  sort_order?: number;
}) => {
  try {
    const response = await api.post('/observable-behaviors', behaviorData);
    return response.data.data;
  } catch (error) {
    console.error('Error creating observable behavior:', error);
    throw error;
  }
};

export const updateObservableBehavior = async (id: string, behaviorData: {
  text?: string;
  sort_order?: number;
}) => {
  try {
    const response = await api.put(`/observable-behaviors/${id}`, behaviorData);
    return response.data.data;
  } catch (error) {
    console.error('Error updating observable behavior:', error);
    throw error;
  }
};

export const deleteObservableBehavior = async (id: string): Promise<void> => {
  try {
    await api.delete(`/observable-behaviors/${id}`);
  } catch (error) {
    console.error('Error deleting observable behavior:', error);
    throw error;
  }
};

// Persona API functions
export const fetchPersonas = async () => {
  try {
    const response = await api.get('/personas');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching personas:', error);
    throw error;
  }
};

export const fetchPersonaById = async (id: string) => {
  try {
    const response = await api.get(`/personas/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching persona:', error);
    throw error;
  }
};

export const createPersona = async (personaData: {
  name: string;
  description: string;
  context: string;
  experience: string;
  motivations: string;
  constraints: string;
}) => {
  try {
    const response = await api.post('/personas', personaData);
    return response.data.data;
  } catch (error) {
    console.error('Error creating persona:', error);
    throw error;
  }
};

export const updatePersona = async (id: string, personaData: {
  name?: string;
  description?: string;
  context?: string;
  experience?: string;
  motivations?: string;
  constraints?: string;
}) => {
  try {
    const response = await api.put(`/personas/${id}`, personaData);
    return response.data.data;
  } catch (error) {
    console.error('Error updating persona:', error);
    throw error;
  }
};

export const deletePersona = async (id: string): Promise<void> => {
  try {
    await api.delete(`/personas/${id}`);
  } catch (error) {
    console.error('Error deleting persona:', error);
    throw error;
  }
};

// Export the configured axios instance for other API calls
export default api;

// Export as apiClient for backward compatibility
export { api as apiClient };