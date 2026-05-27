# Next Step: Weekly Nutrition Chart

## Context

The signed-in home screen already shows today's dashboard totals and uses PocketBase nutrition records as the source of truth.

The next Stage 3 step is to add a simple nutrition visualization without adding advanced analytics or goal configuration.

## Status

Implemented in the frontend dashboard.

## Goal

Show a compact 7-day calorie chart based on saved PocketBase nutrition records.

## Scope

### Include

- Load nutrition records for the last 7 days from PocketBase.
- Aggregate daily calories, protein, carbs, and fats.
- Show a compact 7-day calorie bar chart in the dashboard.
- Refresh weekly totals after loading, saving, or deleting foods.

### Exclude

- Historical date picker.
- Weekly macro tabs.
- Goal editing.
- Advanced analytics.

## Implemented Files

```txt
frontend/src/app/index.tsx
frontend/src/features/food-logging/hooks.ts
frontend/src/features/food-logging/reducer.ts
frontend/src/features/food-logging/service.ts
frontend/src/features/food-logging/types.ts
```

## Trade-Offs

- The first chart focuses on calories because it is the easiest weekly nutrition signal to scan.
- The chart uses React Native views instead of a chart library to keep the MVP simple and avoid extra rendering complexity.
- Weekly totals refresh after persistence changes instead of trying to manually patch chart state.
