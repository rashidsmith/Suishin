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

// Export the configured axios instance for other API calls
export default api;