// Re-export all shared types
export * from '../../../shared/types';

// Client-specific types
export interface ApiResponse<T> {
  data: T;
  error?: string;
  message?: string;
}

export interface AppState {
  user: import('../../../shared/types').User | null;
  isLoading: boolean;
  error: string | null;
}

// Request/Response types for API calls
export interface CreateUserRequest {
  email: string;
  name?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateIBORequest {
  title: string;
  description: string;
  persona_id?: string;
  topic: string;
}

export interface CreateSessionRequest {
  learning_objective_id: string;
  title: string;
}

export interface UpdateSessionRequest {
  status?: 'not_started' | 'in_progress' | 'completed' | 'paused';
  completed_at?: string;
}

export interface SessionCardResponse {
  session_id: string;
  card_id: string;
  response_data?: Record<string, any>;
}