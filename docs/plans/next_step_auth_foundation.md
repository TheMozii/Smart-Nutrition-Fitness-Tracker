# Next Step: PocketBase Authentication

## Context

The app now supports food lookup, AI text food analysis, and a local daily nutrition summary.

The next MVP step is authentication. PocketBase was selected for authentication so the app can create users and sign them in without adding a custom auth backend.

## Status

Implemented as a frontend PocketBase authentication flow.

## Goal

Add a simple authentication screen that lets the user enter email and password, switch between login and registration modes, authenticate with PocketBase, and enter the main Food Logging experience.

## Scope

### Include

- Login/register screen.
- Email and password fields.
- Basic validation.
- PocketBase user creation.
- PocketBase password login.
- Auth token stored in frontend state.
- Sign-out action.
- Authenticated app shell around the Food Logging screen.

### Exclude

- Custom backend authentication.
- Password storage.
- Persistent sessions.

## Why This Is the Right Next Step

- Authentication is part of the MVP scope.
- The app needs user identity before user-specific meal persistence.
- PocketBase provides email/password auth without building custom auth logic.
- This avoids storing meals before user identity is defined.

## Acceptance Criteria

### AC1 Login/Register Form

Given the app starts, when the user is not authenticated, then the app shows a PocketBase login/register form.

### AC2 Input Validation

Given the user submits missing or invalid credentials, then the app shows a clear validation message.

### AC3 Authenticated App Shell

Given the user submits valid PocketBase credentials, then the app shows the Food Logging screen and a signed-in header.

### AC4 Sign Out

Given the user is signed in, when the user taps sign out, then the app returns to the authentication screen.

## Implemented Files

```txt
frontend/src/app/auth.tsx
frontend/src/app/index.tsx
frontend/src/features/auth/hooks.ts
frontend/src/features/auth/reducer.ts
frontend/src/features/auth/service.ts
frontend/src/features/auth/types.ts
frontend/src/features/auth/README.md
docs/prompts/knowledge_base_auth_foundation_prompt.md
```

## Environment Variable

```txt
EXPO_PUBLIC_POCKETBASE_URL=http://127.0.0.1:8090
```

If the variable is missing, the frontend defaults to `http://127.0.0.1:8090`.

## Trade-Offs

- PocketBase reduces auth complexity but requires a running PocketBase server.
- The auth token is only stored in frontend state for now.
- Persistent session storage should be added later.

## Next Follow-Up

Use the authenticated PocketBase user identity when saving meals and daily summaries.
