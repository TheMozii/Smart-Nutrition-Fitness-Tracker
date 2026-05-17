# Next Step: PocketBase Nutrition Persistence

## Context

The app now supports PocketBase authentication and a local daily nutrition summary.

The next MVP step is to save logged foods to PocketBase so daily nutrition records belong to an authenticated user.

## Status

Implemented in the frontend using the PocketBase REST API.

## Goal

When a signed-in user taps "Add to Day", the app should create a record in the PocketBase `nutritions` collection and then update the local daily summary.

## Expected PocketBase Collection

Collection:

```txt
nutritions
```

Fields:

```txt
user        relation -> users, required
name        text, required
source      select: open_food_facts, ai_text, manual
barcode     text, optional
calories    number, required
protein     number, required
carbs       number, required
fats        number, required
loggedDate  date, required
```

Access rules:

```txt
List/Search: user = @request.auth.id
View:        user = @request.auth.id
Create:      @request.auth.id != ""
Update:      user = @request.auth.id
Delete:      user = @request.auth.id
```

## Scope

### Include

- Pass authenticated PocketBase user id and token into Food Logging.
- Add a save command for adding food to the daily log.
- Create PocketBase `nutritions` records from searched or AI-estimated foods.
- Update local daily totals only after PocketBase confirms save success.
- Show PocketBase field-level errors when save fails.

### Exclude

- Loading previous meals from PocketBase.
- Editing saved records.
- Deleting saved records from PocketBase.
- Weekly summaries or dashboards.

## Implemented Files

```txt
frontend/src/app/index.tsx
frontend/src/app/food-logging.tsx
frontend/src/features/food-logging/hooks.ts
frontend/src/features/food-logging/reducer.ts
frontend/src/features/food-logging/service.ts
frontend/src/features/food-logging/types.ts
docs/prompts/knowledge_base_pocketbase_nutrition_persistence_prompt.md
```

## Trade-Offs

- Saving now happens before updating local totals, which avoids showing unsaved records as saved.
- Removal still only affects local state; PocketBase delete can be added next.
- The app depends on the PocketBase `nutritions` collection schema matching this document.

## Next Follow-Up

Load saved nutrition records for the authenticated user when the app opens, then add PocketBase delete support for removing a logged food.
