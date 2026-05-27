# Smoke Test Checklist

Use this checklist after starting PocketBase, the backend, and the frontend.

## Services

- PocketBase dashboard opens at `http://127.0.0.1:8090/_/`.
- PocketBase health returns OK at `http://127.0.0.1:8090/api/health`.
- Backend health returns OK at `http://127.0.0.1:8000/health`.
- Frontend opens at `http://127.0.0.1:8081`.

## Auth

- Register a new user.
- Sign out.
- Sign back in with the same user.
- If login fails, the UI shows a clear authentication error.

## Food Logging

- Submit an empty search and confirm validation appears.
- Search for a real food name.
- Use the barcode demo action.
- Analyze a text meal description.
- Confirm nutrition values show calories, protein, carbs, and fats.

## Persistence

- Add a food to the day.
- Confirm the dashboard totals update.
- Refresh the page.
- Confirm saved foods load back from PocketBase.
- Delete a logged food.
- Confirm totals and the logged food list update.

## Dashboard

- Change the calorie goal input.
- Confirm the calorie progress bar updates.
- Confirm the 7-day calorie chart is visible.
- Add or delete food and confirm the weekly chart refreshes.

## Error States

- Stop the backend and try food search.
- Confirm the UI says the backend is unavailable.
- Stop PocketBase and try login or saved-food loading.
- Confirm the UI says PocketBase is unavailable.
- Remove `OPENAI_API_KEY` and try AI analysis.
- Confirm the UI says the OpenAI API key is not configured.
