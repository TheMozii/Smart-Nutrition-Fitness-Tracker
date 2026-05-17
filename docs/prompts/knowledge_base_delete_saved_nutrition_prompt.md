# AI Prompt: Add Saved Nutrition Delete To Knowledge Base

Use this prompt with the existing knowledge base repository:

```txt
You are updating my existing Cognitive PKM Repository for the Smart Nutrition & Fitness Tracker project.

Knowledge base repository:
https://github.com/TheMozii/Knowledge-Base

Do not create a new repository structure.
Use the existing folders only:
- inbox/
- beliefs/
- decisions/
- experiments/

Task:
Add a knowledge base entry about the completed next step: deleting saved PocketBase nutrition records.

Recommended file:
experiments/EXP-delete-saved-nutrition-records.md

# Experiment: Delete Saved Nutrition Records

## Context

The app already supports:

- PocketBase authentication
- user-owned nutrition records
- saving foods to PocketBase
- loading today's saved foods from PocketBase

The next step was to make the Daily Summary remove action persistent.

## Hypothesis

If removing a food also deletes the PocketBase record, the Daily Summary will stay consistent after refresh and across sessions.

## Implementation

Record that the implementation added:

- A delete command in the Food Logging command flow.
- A service call to PocketBase:

`DELETE /api/collections/nutritions/records/{id}`

- Local daily summary update only after PocketBase confirms deletion.
- Daily totals recalculation after deletion.
- A message while deletion is in progress.

PocketBase delete rule:

`user = @request.auth.id`

This means users can only delete their own nutrition records.

## Verification

- TypeScript check passed.
- Backend Python compile check passed.
- Direct PocketBase smoke test created and deleted a temporary nutrition record.
- PocketBase returned status `204` for successful deletion.

## Result

Deleting a food from the Daily Summary now deletes the saved PocketBase record first, then updates the local UI.

## Limitations

- There is no undo action.
- There is no bulk delete.
- There is no historical day delete UI.

## Lessons Learned

Remove actions should not only update local state when persistence exists.

Database ownership rules are important for destructive actions like delete.

The app should update UI after persistence success to avoid showing deleted items that still exist in the database.

## Open Questions

- Should the app ask for confirmation before deleting a food?
- Should deleted records be soft-deleted instead of removed?
- Should users be able to undo deletion?
- Should historical records be editable or immutable?

Writing rules:

- Keep the entry clear and simple.
- Focus on persistent delete behavior.
- Mention the PocketBase endpoint and ownership rule.
- Do not add unrelated features.
```
