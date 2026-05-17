# Next Step: Load Saved Nutrition Records

## Context

The app can save logged foods to PocketBase after a user signs in.

The next MVP step is to load the authenticated user's saved nutrition records for the current day so the daily summary is restored after refresh or sign-in.

## Status

Implemented in the frontend using the PocketBase REST API.

## Goal

When a user signs in, the Food Logging screen should load today's saved `nutritions` records from PocketBase and calculate the daily totals from those records.

## Scope

### Include

- Add a command for loading saved foods from PocketBase.
- Load today's `nutritions` records using the authenticated user's token.
- Filter loaded records by the authenticated user's id.
- Map PocketBase records into the existing `LoggedFood` type.
- Recalculate daily totals after records are loaded.
- Show a clear message when no saved foods exist for today.

### Exclude

- Loading records from previous days.
- Date picker support.
- Deleting PocketBase records.
- Editing saved foods.
- Dashboard charts.

## Implementation Notes

PocketBase endpoint:

```txt
GET /api/collections/nutritions/records
```

The frontend filters by today's date range and sorts by:

```txt
loggedDate
```

Do not sort by `created` because the current `nutritions` migration does not define a `created` field.

The frontend also filters by:

```txt
user = authenticated user id
```

The `nutritions` collection uses a relation field:

```txt
user relation -> users
```

## Implemented Files

```txt
frontend/src/features/food-logging/hooks.ts
frontend/src/features/food-logging/reducer.ts
frontend/src/features/food-logging/service.ts
frontend/src/features/food-logging/types.ts
docs/prompts/knowledge_base_load_saved_nutrition_prompt.md
```

## Verification

- TypeScript check passed.
- Backend Python compile check passed.
- Direct PocketBase API check loaded today's records with the app-style UTC date filter.

## Trade-Offs

- Loading only today's records keeps the feature simple.
- Historical nutrition views should come later through a dashboard or date picker.
- The delete action still only updates local state and does not delete PocketBase records yet.

## Next Follow-Up

Add PocketBase delete support so removing a food from the daily summary also removes the saved record.
