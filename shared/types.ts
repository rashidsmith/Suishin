// Core data structures for the application
// All id fields are UUIDs (strings)

export interface User {
  id: string;
  email: string;
  name?: string | null;
  created_at: string | Date;
  updated_at: string | Date;
}

export interface Persona {
  id: string;
  name: string;              // "New Managers", "Senior Engineers"
  description: string;       // Detailed context about this group
  context: string;           // Their work environment, challenges
  experience: string;        // What they know coming in
  motivations: string;       // What drives them, pain points
  constraints: string;       // Time, attention, learning preferences
  created_at: string | Date;
  updated_at: string | Date;
}

export interface IBO {
  id: string;
  title: string;
  description: string;
  user_id: string;
  persona_id?: string;        // Optional - can be persona-specific or generic
  topic: string;             // Subject matter focus
  created_at: string;
  updated_at: string;
}

export interface PerformanceMetric {
  id: string;
  session_id: string;
  metric_type: string;
  value: number;
  recorded_at: string;
  created_at: string;
}

export interface ObservableBehavior {
  id: string;
  learning_objective_id: string;
  behavior_description: string;
  proficiency_level: number;
  created_at: string;
  updated_at: string;
}

export interface LearningObjective {
  id: string;
  ibo_id: string;
  title: string;
  description: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Card {
  id: string;
  activity_block_id: string;
  title: string;
  content: string;
  order_index: number;
  card_type: string;
  metadata?: Record<string, any>;
  recommended_modalities?: ('onsite' | 'virtual' | 'hybrid')[];
  modality_notes?: {
    onsite?: string;      // Special considerations for in-person
    virtual?: string;     // Adaptations needed for virtual
    hybrid?: string;      // How to handle hybrid delivery
  };
  created_at: string;
  updated_at: string;
}

export enum ActivityBlockType {
  Connection = 'Connection',
  Concept = 'Concept',
  ConcretePractice = 'ConcretePractice',
  Conclusion = 'Conclusion'
}

export interface ActivityBlock {
  id: string;
  learning_objective_id: string;
  title: string;
  description: string;
  block_type: ActivityBlockType;
  order_index: number;
  estimated_duration: number; // in minutes
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: string;
  user_id: string;
  learning_objective_id: string;
  title: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'paused';
  persona_id: string;         // Required - who is this for
  topic: string;              // Required - what subject
  modality: 'onsite' | 'virtual' | 'hybrid';  // Required - how delivered
  business_goals: string;     // Session-specific outcomes
  started_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface SessionCard {
  id: string;
  session_id: string;
  card_id: string;
  viewed_at: string;
  response_data?: Record<string, any>;
  is_completed: boolean;
  created_at: string;
}