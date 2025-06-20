import axios from 'axios';
import { ApiResponse } from '../types';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any auth tokens here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error('Unauthorized access');
    }
    return Promise.reject(error);
  }
);

// API functions
export const apiClient = {
  get: async <T>(url: string): Promise<ApiResponse<T>> => {
    const response = await api.get(url);
    return response.data;
  },

  post: async <T>(url: string, data: any): Promise<ApiResponse<T>> => {
    const response = await api.post(url, data);
    return response.data;
  },

  put: async <T>(url: string, data: any): Promise<ApiResponse<T>> => {
    const response = await api.put(url, data);
    return response.data;
  },

  delete: async <T>(url: string): Promise<ApiResponse<T>> => {
    const response = await api.delete(url);
    return response.data;
  },
};

export default api;