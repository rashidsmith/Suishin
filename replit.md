# Suishin - Learning Experience Platform

## Overview

Suishin is a comprehensive learning experience platform built with React, Express.js, and TypeScript. The application follows a clean monorepo structure with separate client and server directories, utilizing modern development tools and frameworks. It includes a comprehensive UI component library based on shadcn/ui and Radix UI primitives, configured for Supabase PostgreSQL database integration with full CRUD operations for educational content management.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui components built on Radix UI primitives
- **State Management**: TanStack React Query for server state
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js 20 with TypeScript
- **Framework**: Express.js for REST API
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: connect-pg-simple for PostgreSQL session store
- **Development**: Hot reload with tsx for TypeScript execution

### Monorepo Structure
```
├── client/          # React frontend application
├── server/          # Express.js backend application
├── shared/          # Shared TypeScript types and schemas
└── migrations/      # Database migration files
```

## Key Components

### Database Layer
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Schema**: Centralized schema definition in `shared/schema.ts`
- **Migrations**: Automated database migrations with drizzle-kit
- **Connection**: Neon Database serverless PostgreSQL adapter

### Authentication & Session Management
- **Storage Interface**: Abstracted storage layer with memory and database implementations
- **User Management**: Basic user schema with username/password authentication
- **Session Store**: PostgreSQL-backed session storage ready for implementation

### UI Component System
- **Design System**: "New York" style shadcn/ui components
- **Theming**: CSS variables for light/dark mode support
- **Accessibility**: Built on Radix UI primitives for ARIA compliance
- **Form Handling**: React Hook Form with Zod validation integration

### Development Tools
- **Hot Reload**: Vite dev server with HMR for frontend
- **TypeScript**: Strict type checking across the entire codebase
- **Path Aliases**: Configured for clean imports (@/, @shared/, @assets/)
- **Error Handling**: Runtime error overlay for development

## Data Flow

### Client-Server Communication
1. **API Layer**: RESTful endpoints prefixed with `/api`
2. **Query Management**: TanStack React Query for caching and synchronization
3. **Error Handling**: Centralized error handling with toast notifications
4. **Request Pipeline**: JSON-based request/response with credentials support

### Database Operations
1. **Storage Abstraction**: Interface-based storage layer for easy testing
2. **Schema Validation**: Zod schemas derived from Drizzle table definitions
3. **Type Safety**: End-to-end TypeScript types from database to frontend

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless adapter
- **drizzle-orm**: Type-safe SQL ORM
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework

### Development Dependencies
- **vite**: Fast build tool and dev server
- **tsx**: TypeScript execution for Node.js
- **esbuild**: Fast JavaScript bundler for production builds

### Replit Integration
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay
- **@replit/vite-plugin-cartographer**: Development tooling integration

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite builds React app to `dist/public`
2. **Backend Build**: esbuild bundles server code to `dist/index.js`
3. **Database Setup**: Drizzle migrations applied via `npm run db:push`

### Environment Configuration
- **Development**: Hot reload with `npm run dev`
- **Production**: Optimized builds with `npm run build` and `npm run start`
- **Database**: PostgreSQL connection via `DATABASE_URL` environment variable

### Replit Configuration
- **Modules**: Node.js 20, web, and PostgreSQL 16
- **Port Mapping**: Internal port 5000 mapped to external port 80
- **Autoscale Deployment**: Configured for automatic scaling

## Changelog

Changelog:
- June 20, 2025. Initial setup
- June 20, 2025. Supabase integration completed with client/server configuration and health checks
- June 20, 2025. TypeScript types system completed with shared interfaces for all core data structures
- June 20, 2025. Express API structure implemented with IBO CRUD operations and Supabase database integration
- June 20, 2025. Zustand store setup completed with IBO state management and async CRUD operations
- June 20, 2025. React Router and Layout implementation with navigation between Home, IBOs, Cards, and Sessions pages
- June 20, 2025. IBO Builder completed with comprehensive nested structure for Performance Metrics, Observable Behaviors, and Learning Objectives
- June 20, 2025. Card Composer implemented with IBO/Learning Objective selection, activity management (C1-C4), and time tracking
- June 20, 2025. Card Composer fully integrated with Supabase database - created cards and activities tables, fixed UUID constraints, resolved timebox field requirements, and verified complete CRUD functionality
- June 20, 2025. Session Builder implemented with simple list interface for creating sessions, adding/removing cards, and tracking total duration
- June 20, 2025. Export functionality completed with JSON/CSV format support, data validation, and download capabilities for IBOs, Cards, and Sessions
- June 20, 2025. Complete application testing and deployment readiness achieved - all API endpoints functional, comprehensive user journey verified from IBO creation through Card composition to Session building, database schema finalized, and all components working seamlessly together
- June 20, 2025. Performance Metrics and Observable Behaviors database integration completed - created API controllers, routes, and client functions for full CRUD operations, updated IBO Builder to save/load nested PM/OB data to Supabase, verified complete data persistence and retrieval functionality
- June 20, 2025. Application rebranded to "Suishin" - updated all user-facing text, page titles, navigation, footer, and documentation to reflect the new learning experience platform name
- June 20, 2025. Persona entity implementation completed - added foundational design entity with database table, full CRUD API endpoints, Zustand store, comprehensive management page with create/edit/delete functionality, and navigation integration
- June 20, 2025. Sessions updated to persona + topic + modality driven structure - replaced old session fields with persona_id, topic, modality, and business_goals, updated database schema with proper indexes, enhanced API with filtering support, and modified Session Builder UI for new structure
- June 20, 2025. Comprehensive navigation system implemented - added "System" dropdown menu with links to all system pages (Dashboard, Sessions) and testing interfaces (Supabase Test, Types Test, IBO Test) with descriptions, available on both desktop and mobile navigation
- June 20, 2025. AI-powered session generation implemented - added OpenAI integration to Session Builder with persona-aware content generation for IBOs and 4C activities, including step-by-step workflow with persona → topic/goals → modality → AI generation → cards → review
- June 20, 2025. Modality-aware activity suggestions completed - enhanced Card schema with recommended_modalities and modality_notes fields, updated Session Builder to filter cards by modality compatibility, improved AI generation to provide modality-specific recommendations for onsite/virtual/hybrid delivery
- June 20, 2025. Minimal database schema update for session progress tracking completed - added current_step, completed_steps, and generation_params fields to sessions table, implemented PUT /api/sessions/:id/progress endpoint for step updates, keeps AI-generated content in React state while storing only essential metadata for session flow tracking
- June 20, 2025. Step navigation system implementation completed - created shared/sessionSteps.ts with step configuration, built useSessionSteps hook for progress management, added StepProgressBar component with visual indicators, integrated step validation and database persistence of session progress
- June 20, 2025. Environment variables & AI service setup completed - added OPENAI_API_KEY, ANTHROPIC_API_KEY, and AI_DEFAULT_PROVIDER environment variables, created server/services/aiService.js with proper error handling, implemented /api/health/ai endpoint for service status monitoring, verified OpenAI connection and Anthropic error handling for missing keys
- June 20, 2025. AI IBO generation implementation completed - expanded aiService.js with generateIBOs method using structured prompts for learning design content, added POST /api/sessions/:id/generate-ibos endpoint with proper session data fetching and parameter parsing, implemented comprehensive error handling and logging, verified OpenAI API integration successfully generates learning content with persona-aware prompts
- June 20, 2025. React state management for AI content completed - created useAIContent hook to handle AI-generated content in React state instead of database storage, built GenerateIBOsStep component with content generation, editing, and refinement capabilities, integrated new AI content workflow into Session Builder with proper error handling and loading states, maintains separation between generated content (React state) and session metadata (database)
- June 20, 2025. IBO refinement step implementation completed - added refineIBOs method to aiService.js with context-aware refinement prompts, created POST /api/sessions/:id/refine-ibos endpoint for iterative content improvement, enhanced useAIContent hook with refinement functionality, built comprehensive refinement UI with predefined options (More Specific, Simplify, Business Impact, More Practical) and custom input capabilities, integrated refinement workflow into GenerateIBOsStep component for seamless iterative content improvement
- June 20, 2025. Step progression workflow updated to correct sequence - fixed SESSION_STEPS configuration to match correct workflow (Persona → Topic → Generate IBOs → Choose Modality → Build 4C → Review), updated Session Builder step rendering logic to use new step IDs, replaced old step navigation system with new useSessionSteps hook and StepProgressBar component, removed duplicate step configurations and legacy BuilderStep type
- June 20, 2025. IBO formatting and hierarchical numbering system implemented - created shared/iboFormatter.ts with intelligent content parsing for Business Objectives, Performance Metrics, Observable Behaviors, and Learning Objectives, built FormattedIBODisplay component with proper hierarchical numbering (BO1, PM 1.1, OB 1.1.1, LO 1.1.1.1), enhanced AI content display with visual hierarchy using icons and indentation, added fallback handling for unstructured content
- June 20, 2025. Discrete modality selection step implemented - created ModalitySelectionStep component with detailed comparison of onsite, virtual, and hybrid delivery methods, integrated visual cards with benefits and considerations for each modality, added proper session state management for modality selection, positioned modality choice correctly between IBO generation and 4C activity building in workflow
- June 20, 2025. 4C generation step completed - created Build4CStep component with AI-powered activity generation based on locked IBOs and chosen modality, added generate4CActivities method to aiService.js with modality-specific prompts for Connection/Concept/Concrete Practice/Conclusion activities, implemented POST /api/sessions/:id/generate-4c endpoint with persona context integration, completed full 6-step workflow: Persona → Topic → Generate IBOs → Choose Modality → Build 4C → Review
- June 20, 2025. AI content database persistence implemented - added draft_ai_ibos, draft_ai_activities, ibo_locked, and locked_ibo_ids fields to sessions table schema, updated useAIContent hook to load persisted content on mount and save AI-generated content to database instead of React state only, modified Build4CStep to use database-persisted activities, prevents IBOs from disappearing on page refresh while maintaining seamless workflow experience

## User Preferences

Preferred communication style: Simple, everyday language.