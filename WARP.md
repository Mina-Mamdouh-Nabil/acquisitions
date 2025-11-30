# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is an Express.js REST API using Drizzle ORM with Neon (serverless PostgreSQL). The API handles user authentication and uses JWT tokens stored in HTTP-only cookies.

## Development Commands

### Running the Application
```powershell
npm run dev
```
Starts the development server with Node's watch mode on port 3000 (or PORT from .env)

### Database Operations
```powershell
npm run db:generate  # Generate Drizzle migrations from schema changes
npm run db:migrate   # Apply migrations to database
npm run db:studio    # Open Drizzle Studio (database GUI)
```

### Code Quality
```powershell
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues automatically
npm run format       # Format code with Prettier
npm run format:check # Check formatting without changes
```

## Architecture

### Path Aliases
The project uses Node.js subpath imports (package.json "imports" field) for cleaner imports:
- `#config/*` → `./src/config/*`
- `#controllers/*` → `./src/controllers/*`
- `#middleware/*` → `./src/middleware/*`
- `#models/*` → `./src/models/*`
- `#routes/*` → `./src/routes/*`
- `#services/*` → `./src/services/*`
- `#utils/*` → `./src/utils/*`
- `#validations/*` → `./src/validations/*`

Always use these aliases instead of relative paths when importing across directories.

### Application Structure

**Entry Point Flow**: `src/index.js` → `src/server.js` → `src/app.js`

**Layered Architecture**:
1. **Routes** (`src/routes/`) - Define endpoints and map to controllers
2. **Controllers** (`src/controllers/`) - Handle HTTP request/response, validation, and orchestration
3. **Services** (`src/services/`) - Business logic and data operations
4. **Models** (`src/models/`) - Drizzle ORM schema definitions
5. **Validations** (`src/validations/`) - Zod schemas for input validation
6. **Utils** (`src/utils/`) - Reusable utilities (JWT, cookies, formatting)
7. **Config** (`src/config/`) - Application configuration (database, logger)

### Database Layer

- **ORM**: Drizzle ORM with Neon serverless driver
- **Connection**: HTTP-based connection (not WebSocket) for serverless compatibility
- **Schema Location**: `src/models/` (Drizzle scans `*.js` files here)
- **Migrations**: Generated in `./drizzle/` directory

When creating new models, use Drizzle's pgTable and import from 'drizzle-orm/pg-core'. Follow the pattern in `src/models/user.model.js`.

### Logger Configuration

Winston logger is configured in `src/config/logger.js`:
- **Development**: Logs to console (colorized) + files
- **Production**: Logs to files only
- **Files**: `logs/error.log` (errors only) and `logs/combined.log` (all logs)
- **Service name**: 'acquisitions-api'

Always use the logger (`import logger from '#config/logger.js'`) instead of console.log for application logging.

### Authentication Pattern

JWT-based authentication with HTTP-only cookies:
1. Controllers validate input with Zod schemas from `#validations/`
2. Services handle password hashing (bcrypt) and user operations
3. JWT tokens are signed with payload: `{ id, email, role }`
4. Tokens stored in HTTP-only cookies via `cookies.set()` utility
5. Cookie settings auto-adjust based on NODE_ENV (secure flag in production)

## Code Style

### ESLint Rules
- 2-space indentation with switch case indentation
- Single quotes for strings
- Semicolons required
- Prefer const over let, no var
- Arrow functions and object shorthand
- Unix line endings (LF)
- Unused vars allowed if prefixed with underscore

### Error Handling Pattern
Controllers should:
1. Try-catch all async operations
2. Log errors with `logger.error()`
3. Return appropriate HTTP status codes
4. Pass unhandled errors to Express error handler with `next(e)`

## Environment Setup

Required environment variables (see `.env.example`):
```
PORT=3000
NODE_ENV=development
LOG_LEVEL=info
DATABASE_URL=<neon-postgresql-url>
JWT_SECRET=<your-secret>
```

Note: JWT_SECRET has a fallback default but MUST be set for production.
