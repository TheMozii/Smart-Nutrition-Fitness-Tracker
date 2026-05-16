# Next Step: Daily Nutrition Summary

## Context

The Food Logging feature can now return nutrition data from food search, barcode lookup, and AI text analysis.

The next MVP step is to let users add the returned food result to a daily summary and see totals for calories, protein, carbs, and fats.

## Status

Implemented as a local frontend state increment.

## Goal

Allow users to build a simple daily food log from searched or AI-analyzed foods and immediately see nutrition totals.

## Why This Is the Right Next Step

- It connects food lookup to actual nutrition tracking.
- It supports the MVP requirement for daily nutrition totals.
- It avoids introducing Supabase persistence before the UI flow is clear.
- It keeps the implementation simple and aligned with the existing reducer pattern.

## Scope

### Include

- Add food result to a daily log.
- Calculate daily calories, protein, carbs, and fats.
- Show logged foods in the Food Logging screen.
- Allow removing a logged food from the daily summary.

### Exclude

- Supabase meal persistence.
- Authentication-based user meal history.
- Weekly charts.
- Nutrition goals.
- Advanced dashboard analytics.

## Acceptance Criteria

### AC1 Add Food To Daily Summary

Given a food result is shown, when the user taps "Add to Day", then the food appears in the daily summary.

### AC2 Calculate Totals

Given one or more foods are added, when the daily summary is shown, then calories, protein, carbs, and fats are totaled correctly.

### AC3 Remove Food

Given a food has been added to the daily summary, when the user removes it, then the totals update.

### AC4 Empty Summary

Given no foods are logged, when the user views the daily summary, then the app shows an empty state.

## Implemented Files

```txt
frontend/src/app/food-logging.tsx
frontend/src/features/food-logging/hooks.ts
frontend/src/features/food-logging/reducer.ts
frontend/src/features/food-logging/types.ts
docs/prompts/knowledge_base_daily_summary_prompt.md
```

## Trade-Offs

- Local state is enough to validate the workflow, but data is lost on refresh.
- Supabase persistence should come after the daily summary shape is stable.
- The summary stays inside Food Logging for now to avoid adding navigation or dashboard complexity too early.

## Next Follow-Up

The next logical backend step is meal persistence in Supabase after authentication and database schema decisions are documented.
