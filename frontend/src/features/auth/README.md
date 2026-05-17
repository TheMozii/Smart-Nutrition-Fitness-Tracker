# Auth Feature

This module contains the frontend PocketBase authentication flow for the Smart Nutrition & Fitness Tracker.

Current scope:

- Login/register UI state.
- Email and password validation.
- PocketBase `users` collection registration.
- PocketBase password authentication.
- Auth token stored in frontend state.
- Sign out action.

Set the PocketBase URL with:

```txt
EXPO_PUBLIC_POCKETBASE_URL=http://127.0.0.1:8090
```

If the variable is missing, the app uses `http://127.0.0.1:8090`.

The token is not persisted yet. Session persistence can be added after the meal database schema is ready.
