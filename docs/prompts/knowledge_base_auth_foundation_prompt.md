# AI Prompt: Add Authentication Foundation To Knowledge Base

Use this prompt with the existing knowledge base repository:

```txt
You are updating my existing Cognitive PKM Repository for the Smart Nutrition & Fitness Tracker project.

Knowledge base repository:
https://github.com/TheMozii/Knowledge-Base

Important:
Do not create a new knowledge base structure.
Use the existing folders only:
- inbox/
- beliefs/
- decisions/
- experiments/

Task:
Add a knowledge base entry for the completed next project step: PocketBase Authentication.

Recommended file:
experiments/EXP-pocketbase-authentication.md

# Experiment: PocketBase Authentication

## Context

The Smart Nutrition & Fitness Tracker already supports:

- food lookup by name
- barcode lookup
- AI text-based food analysis
- local daily nutrition summary

The next MVP step was authentication. PocketBase was selected for authentication so the app can create users and sign them in without building a custom auth backend.

## Hypothesis

Using PocketBase for authentication will make the MVP faster to finish because email/password user management can be handled by PocketBase instead of custom backend code.

## Implementation

Record that the implementation added:

- Frontend auth feature module.
- Login/register screen.
- Email and password fields.
- Basic email and password validation.
- PocketBase `users` collection registration.
- PocketBase password login with `/api/collections/users/auth-with-password`.
- Auth token stored in frontend state.
- Sign-out action.
- Authenticated app shell showing signed-in email.
- Food Logging screen gated behind auth state.

Files added or updated:

- `frontend/src/app/auth.tsx`
- `frontend/src/app/index.tsx`
- `frontend/src/features/auth/hooks.ts`
- `frontend/src/features/auth/reducer.ts`
- `frontend/src/features/auth/service.ts`
- `frontend/src/features/auth/types.ts`
- `frontend/src/features/auth/README.md`

## Observations

Record these observations:

- PocketBase REST endpoints were enough for registration and login, so no SDK dependency was required.
- The app now has a clearer user flow before meal persistence is added.
- User identity should be connected before saving meals to the database.
- The frontend needs `EXPO_PUBLIC_POCKETBASE_URL`, defaulting to `http://127.0.0.1:8090`.

## Result

Initial result: implemented.

Verification:

- Frontend TypeScript check passed.
- Backend Python compile check passed.

Limitations:

- Requires a running PocketBase server.
- No persistent session yet.
- Auth token is stored only in frontend state.
- Signed-in state resets when the app reloads.

## Lessons Learned

Authentication should be introduced before database meal persistence so saved meals can be tied to a user identity.

PocketBase is a practical MVP backend choice because it includes auth and database features in one simple service.

## Open Questions

- Should the project continue with PocketBase for meal persistence too?
- Should the backend validate PocketBase auth tokens?
- Where should persistent session handling live?
- What user profile fields are needed for nutrition goals?
- Should meal persistence wait until auth tokens are available?

Writing rules:

- Be explicit that this uses PocketBase authentication.
- Do not claim session persistence is complete.
- Do not add unrelated features.
- Focus on what was implemented, what was learned, and what should come next.
```
