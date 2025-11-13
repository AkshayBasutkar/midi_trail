 # Memory Tiles 3D Game

## Overview

A multi-layered 3D memory tile matching game built with React, Three.js, and Express. Players flip and match flower-themed tiles layer by layer in a pyramid-style formation. The game features smooth 3D animations, sound effects, and progressive difficulty levels (Easy, Medium, Hard). Built as a full-stack application with a TypeScript-based client and server, utilizing modern web technologies including React Three Fiber for 3D rendering and Zustand for state management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**3D Rendering Engine**
- Uses `@react-three/fiber` as the primary 3D rendering framework, providing a React-based declarative API over Three.js
- `@react-three/drei` provides helper components like `OrbitControls` and `RoundedBox` for enhanced 3D scene management
- `@react-three/postprocessing` enables visual effects and post-processing capabilities
- GLSL shader support via `vite-plugin-glsl` for custom visual effects

**State Management**
- Zustand with middleware for reactive state management
- `useMemoryGame` store manages game logic: tile states, layers, matching logic, scoring, and timer
- `useAudio` store handles all sound effects (background music, hit sounds, success sounds) and mute state
- `useGame` store (legacy) manages game phases with subscribe-with-selector pattern

**UI Component System**
- Radix UI primitives (@radix-ui/*) for accessible, unstyled components
- Custom component library built with shadcn/ui patterns in `client/src/components/ui/`
- Tailwind CSS for styling with custom theme configuration (HSL color variables)
- Class Variance Authority for component variant management

**Game Architecture**
- Layer-based progression system where only the topmost layer is interactive
- Tile matching logic with flip animations and match detection
- Difficulty system determines number of layers and grid sizes
- Timer and move counter for performance tracking

### Backend Architecture

**Server Framework**
- Express.js for HTTP server and API routing
- TypeScript with ES modules (type: "module")
- Vite middleware integration for development hot-reload

**Development Setup**
- Vite dev server with HMR over the Express server
- Custom logger for request/response tracking with truncated output (80 char limit)
- Error handling middleware with status code and message extraction

**Build Process**
- Frontend: Vite builds React app to `dist/public`
- Backend: esbuild bundles server code to `dist/index.js` with ESM format
- Production mode serves static files from built frontend

**Storage Layer**
- In-memory storage implementation (`MemStorage`) for user data
- Interface-based design (`IStorage`) allows future database integration
- Schema defined with Drizzle ORM for eventual PostgreSQL migration

### External Dependencies

**Database (Configured, Not Used)**
- Drizzle ORM with PostgreSQL dialect for schema definition
- Neon Database serverless driver (@neondatabase/serverless) configured
- Schema location: `shared/schema.ts`
- Migration output: `./migrations`
- Currently using in-memory storage; database setup is prepared but not active

**Third-Party Services**
- Asset loading: Flower images (8 unique flowers) and audio files (background music, hit sound, success sound)
- Font: Inter font via @fontsource/inter

**Key Libraries**
- `@tanstack/react-query` for async state and server communication (configured but minimal usage)
- `date-fns` for date manipulation
- `cmdk` for command menu UI components
- `nanoid` for unique ID generation
- `zod` for schema validation with Drizzle integration

**Build & Development Tools**
- TypeScript with strict mode and path aliases (`@/*` for client, `@shared/*` for shared code)
- PostCSS with Tailwind CSS and Autoprefixer
- tsx for running TypeScript server in development
- Replit-specific vite plugin for runtime error overlay