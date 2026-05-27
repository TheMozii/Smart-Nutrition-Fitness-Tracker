# Next Step: Basic Dashboard UI

## Context

The app already supports PocketBase authentication, daily nutrition persistence, loading today's saved foods, and deleting saved foods.

The next MVP step is to show the user's current daily nutrition state before the food logging form.

## Status

Implemented in the frontend using the existing food logging state.

## Goal

Show a simple dashboard for the signed-in user with today's nutrition totals and recent logged foods.

## Scope

### Include

- Show today's calories, protein, carbs, and fats.
- Show a small calorie progress indicator.
- Show the three most recent foods logged today.
- Reuse the existing food logging hook and PocketBase-loaded state.

### Exclude

- Weekly charts.
- Goal configuration.
- Historical dashboard data.
- Advanced analytics.

## Implemented Files

```txt
frontend/src/app/index.tsx
frontend/src/app/food-logging.tsx
```

## Trade-Offs

- The dashboard currently uses a fixed calorie target so the MVP can display progress without adding a goals system yet.
- Food logging state was lifted into the signed-in home route so the dashboard and logging form share one source of truth.
- Weekly charts remain a separate follow-up because they require loading records beyond the current day.
