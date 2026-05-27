# Copilot Instructions for kissnotes

## Build, Test, and Lint Commands

- **Install dependencies:**
  - `make i` or `npm run install:front` and `npm run install:back`
- **Start development (full stack):**
  - `make dev` (runs DB, backend, and frontend)
- **Frontend only:**
  - `npm run dev:front` (Next.js, port from $FRONT_PORT)
  - **Lint:** `npm run lint` (uses ESLint)
  - **Format:** `npm run format` (ESLint `--fix`)
- **Backend only:**
  - `npm run dev:back` (Express/TypeORM, MariaDB)
  - **Build:** `npm run build`
  - **Typecheck:** `npm run typecheck`
  - **Lint:** `npm run lint` (uses ESLint)
  - **Format:** `npm run format` (ESLint `--fix`)
- **Database:**
  - `make start-db`, `make create-db`, `make drop-db`, `make wait-db`

## High-Level Architecture

- **Monorepo** managed by npm workspaces:
  - `apps/front`: Next.js frontend (React, SWR, axios, ESLint for lint/format)
  - `apps/back`: Express backend (TypeORM, MariaDB, JWT, modular API routes)
  - `packages/types`: Shared TypeScript types
- **Frontend:**
  - Uses SWR and custom axios instance for API calls
  - Auth state via custom hooks (see `/hooks`)
  - Modular components, portals for modals/tooltips
- **Backend:**
  - TypeORM entities for users, expressions, layers, properties, etc.
  - API routes grouped by resource (e.g., `/api/expressions`, `/api/users`)
  - Auth: JWT, refresh tokens, cookies, bcrypt for password hashing
  - DB config in `datasource.ts`, entities in `/entities`
  - Error handling via `TryCatch` decorator

## Key Conventions

- **TypeScript path aliases:**
  - `@/` points to `apps/back/src/` or `apps/front/src/` as appropriate
- **API error handling:**
  - Use `TryCatch` decorator for controller error wrapping
- **Entities:**
  - Extend `AbstractEntity` for base fields (id, createdAt, etc.)
- **Frontend API:**
  - Use `/services/axios.ts` and `/services/fetcher.ts` for all HTTP
- **Linting/formatting:**
  - Use ESLint (`eslint.config.mjs` config)
- **Environment:**
  - `.env` for secrets/ports, loaded by Makefile and apps

---

This file summarizes build/test/lint commands, architecture, and conventions for Copilot and future contributors. If you want to adjust coverage or add more details, let me know!
