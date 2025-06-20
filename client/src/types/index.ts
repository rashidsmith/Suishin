// TypeScript interfaces for the client application
export interface User {
  id: string;
  email: string;
  name?: string;
  created_at: string;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
  message?: string;
}

export interface AppState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}