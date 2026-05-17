# Next Step: Delete Saved Nutrition Records

## Context

The app can save and load daily nutrition records from PocketBase for the authenticated user.

The next MVP step is to make removal persistent. When the user removes a food from the Daily Summary, the app should delete the saved PocketBase record and then update local totals.

## Status

Implemented in the frontend using the PocketBase REST API.

## Goal

Ensure the Daily Summary UI and PocketBase stay consistent when a food is removed.

## Scope

### Include

- Add a delete command to the Food Logging command flow.
- Call PocketBase `DELETE /api/collections/nutritions/records/{id}`.
- Update local daily summary only after PocketBase confirms deletion.
- Recalculate daily totals after deletion.
- Show a clear message while deletion is in progress.

### Exclude

- Undo delete.
- Bulk delete.
- Editing saved nutrition records.
- Historical day deletion.

## Implementation Notes

PocketBase endpoint:

```txt
DELETE /api/collections/nutritions/records/{id}
```

PocketBase access rule protects records:

```txt
Delete: user = @request.auth.id
```

The frontend still sends the authenticated token, but PocketBase enforces ownership.

## Implemented Files

```txt
frontend/src/features/food-logging/hooks.ts
frontend/src/features/food-logging/reducer.ts
frontend/src/features/food-logging/service.ts
frontend/src/features/food-logging/types.ts
docs/prompts/knowledge_base_delete_saved_nutrition_prompt.md
```

## Verification

- TypeScript check passed.
- Backend Python compile check passed.
- Direct PocketBase smoke test created and deleted a temporary nutrition record.

## Trade-Offs

- Local totals only update after delete success, which keeps UI and database consistent.
- There is no undo action yet.
- Delete uses the saved PocketBase record id.

## Next Follow-Up

Add session persistence so the user stays signed in after refresh or app restart.
