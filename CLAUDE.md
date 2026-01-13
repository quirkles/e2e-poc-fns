# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Firebase Functions project using TypeScript with a focus on type-safe HTTP endpoints, Firestore event handlers, and PubSub event processing. The codebase uses ES modules (NodeNext) and emphasizes strict type safety with Zod schemas.

## Common Commands

### Development
```bash
# Working directory: functions/
npm run build              # Compile TypeScript to lib/
npm run build:watch        # Watch mode for development
npm run lint               # Run ESLint
npm run serve              # Build and start Firebase emulators
npm run shell              # Start Firebase functions shell
```

### Deployment
```bash
npm run deploy             # Deploy functions to Firebase
npm run logs               # View function logs
```

### Environment Setup
```bash
# Fetch secrets from Google Cloud (requires gcloud auth)
../scripts/fetch_secrets.sh

# The .env file contains:
# - ENV (dev/local)
# - WEB_URL
# - JWT_SECRET
```

### Firebase Emulators
The project uses Firebase emulators for local development (configured in firebase.json):
- Functions: port 5001
- PubSub: port 8085
- UI: enabled

## Architecture

### Function Export Structure
All functions are exported from `src/index.ts` in a namespace structure:
```typescript
export const user = {
  inviteUser,    // HTTP callable function
  onUserCreate,  // Auth trigger
};
```

### Function Wrappers
The codebase uses custom wrapper utilities that provide standardized functionality:

**httpHandler** (`src/utils/wrappers/httpFunctionWrapper.ts`):
- Automatic request/response validation with Zod schemas
- Built-in logging with correlation IDs and request tracking
- Optional App Check token verification
- Optional JWT authentication
- AsyncLocalStorage for logger context throughout request lifecycle
- Error handling with proper status codes

Example usage:
```typescript
const functionConfig = {
  bodySchema: z.object({ email: z.email() }),
  querySchema: z.object({ foo: z.string() }),
  responseSchema: z.object({ success: z.boolean() }),
  useAppCheck: true,           // Enable App Check verification
  requireAuthToken: true,       // Require JWT in Authorization header
};

const myHandler: HttpHandlerFunction<typeof functionConfig> = ({
  body,              // Typed as output of bodySchema
  query,             // Typed as output of querySchema
  headers,
  tokenPayload,      // JWT payload if requireAuthToken: true
  appCheckTokenResponse, // App Check response if useAppCheck: true
}) => {
  const logger = getLogger(); // Access logger from AsyncLocalStorage
  return {
    response: { success: true },
    statusCode: 200,
  };
};

export const myFunction = httpHandler(myHandler, functionConfig);
```

### Logging System
- Uses Pino logger (chosen over Winston due to memory leaks)
- Abstracted through `Logger` interface in `src/utils/logger/Logger.ts`
- Implementation in `src/utils/logger/Logger.pino.ts`
- Integrates with Google Cloud Logging severity levels
- Local environment: logs to `logs/app.dev.log` file
- Cloud environment: logs to stdout (picked up by Cloud Logging)
- Access logger via `getLogger()` from `src/utils/wrappers/index.ts` (uses AsyncLocalStorage)

### Configuration Management
Configuration is managed via Firebase Functions parameters in `src/config.ts`:
- Uses `defineString()` from `firebase-functions/params`
- Validated with Zod schema
- Centralized via `getConfig()` function
- Required params: ENV, WEB_URL, JWT_SECRET

### JWT Authentication
JWT service in `src/services/jwt.ts`:
- `verifyToken()` validates and parses JWT tokens
- Token body schema defines expected payload structure (email, firestoreId, sqlId)
- Automatically integrated when `requireAuthToken: true` in httpHandler config

### PubSub Event System
PubSub service in `src/services/pubsub.ts`:
- Type-safe event dispatching with `payloadCreators`
- Topic names: SEND_EMAIL, DAILY_GAME_UPDATE, CREATE_USER
- Actions: SEND_CLOSE_GAME_WEEK_REMINDER, DAILY_GAME_UPDATE, CREATE_USER
- Uses local emulator when ENV=local

### Firebase Admin Initialization
Firebase Admin services in `src/utils/firestore.ts`:
- Lazy-initialized singletons for Firestore, Storage, and Auth
- `initFbApp()` initializes the app (called automatically by httpHandler)
- Access via `getFirestore()`, `getStorage()`, `getAuth()`

## Code Style

### ESLint Configuration
- Uses TypeScript ESLint with recommended, strict, and stylistic rules
- Prettier integration for formatting
- Import ordering enforced: alphabetical with newlines between groups (builtin, external, internal, parent, sibling, index)
- Build output in `lib/` is ignored

### TypeScript Configuration
- Module: NodeNext with .js extensions in imports
- Strict mode enabled
- Target: ES2017
- Source maps enabled
- Output directory: lib/

### Import Conventions
- Always use `.js` extensions in imports (required for NodeNext modules)
- Import order: builtin → external → internal → parent → sibling → index
- Newlines between import groups

## Deployment

### Cloud Build
The project uses Cloud Build for CI/CD (cloudbuild.yaml):
1. Install dependencies
2. Fetch secrets from Google Cloud Secret Manager
3. Run linting
4. Build TypeScript
5. Deploy to Firebase Functions

### Secrets Management
- Secrets stored in Google Cloud Secret Manager: `fns-env-file`
- Scripts in `scripts/` directory:
  - `fetch_secrets.sh`: Downloads latest secrets and checks for differences
  - `push_latest_secrets.sh`: Uploads local .env to Secret Manager

## Type Safety Patterns

### Zod Schema Usage
- All HTTP function inputs/outputs should be validated with Zod schemas
- Config types derived with `z.infer<typeof schema>`
- Wrapper functions automatically parse and type payloads

### Function Type Definitions
- `HttpHandlerFunction<T>` provides fully typed handler signatures
- `PubSubHandlerFunction<T>` for PubSub handlers
- `OnDocumentCreatedHandlerFunction` and `OnDocumentUpdateHandlerFunction` for Firestore triggers
- Type definitions in `src/utils/wrappers/types.ts`

## Global Options

The project sets `maxInstances: 10` globally in `src/index.ts` to control costs and prevent traffic spikes. Individual functions can override this in their config.
