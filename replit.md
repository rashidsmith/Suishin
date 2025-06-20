# Fullstack TypeScript Application

## Overview

This is a modern fullstack web application built with React, Express.js, and TypeScript. The application follows a clean monorepo structure with separate client and server directories, utilizing modern development tools and frameworks. It includes a comprehensive UI component library based on shadcn/ui and Radix UI primitives, configured for PostgreSQL database integration with Drizzle ORM.

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

## User Preferences

Preferred communication style: Simple, everyday language.