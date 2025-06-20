// Re-export all shared types
export * from '../../shared/types';

// Server-specific request/response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  status?: string;
}

export interface HealthCheckResponse {
  status: 'ok' | 'error';
  database: 'connected' | 'disconnected';
  message: string;
  error?: string;
}

// Database operation types
export interface CreateUserPayload {
  email: string;
  name?: string;
}

export interface CreateIBOPayload {
  title: string;
  description: string;
  user_id: string;
}

export interface CreateLearningObjectivePayload {
  ibo_id: string;
  title: string;
  description: string;
  order_index: number;
}

export interface CreateActivityBlockPayload {
  learning_objective_id: string;
  title: string;
  description: string;
  block_type: import('../../shared/types').ActivityBlockType;
  order_index: number;
  estimated_duration: number;
}

export interface CreateCardPayload {
  activity_block_id: string;
  title: string;
  content: string;
  order_index: number;
  card_type: string;
  metadata?: Record<string, any>;
}

export interface CreateSessionPayload {
  user_id: string;
  learning_objective_id: string;
  title: string;
}

export interface UpdateSessionPayload {
  status?: 'not_started' | 'in_progress' | 'completed' | 'paused';
  started_at?: string;
  completed_at?: string;
}

export interface CreateSessionCardPayload {
  session_id: string;
  card_id: string;
  response_data?: Record<string, any>;
  is_completed: boolean;
}

export interface CreatePerformanceMetricPayload {
  session_id: string;
  metric_type: string;
  value: number;
  recorded_at: string;
}