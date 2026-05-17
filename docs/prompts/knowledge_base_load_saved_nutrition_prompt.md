# AI Prompt: Add Saved Nutrition Loading To Knowledge Base

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
Add a knowledge base entry about the completed next step: loading saved PocketBase nutrition records.

Recommended file:
experiments/EXP-load-saved-nutrition-records.md

# Experiment: Load Saved Nutrition Records

## Context

The app already supports:

- PocketBase authentication
- food search by name
- barcode lookup
- AI text-based food analysis
- saving logged foods to PocketBase `nutritions`

The next step was to restore the daily summary after sign-in by loading saved records for the current day.

## Hypothesis

If the app loads today's saved nutrition records after authentication, the daily summary becomes more reliable because users do not lose their logged foods after refresh or sign-in.

## Implementation

Record that the implementation added:

- A command for loading saved foods from PocketBase.
- A service function that calls `GET /api/collections/nutritions/records`.
- A date filter for the current day.
- A user filter so only the authenticated user's foods are loaded.
- Mapping from PocketBase nutrition records into the frontend `LoggedFood` type.
- Daily totals recalculation after loading saved records.
- Empty-state message when there are no saved foods for today.

Important implementation detail:

The query sorts by `loggedDate`, not `created`.

Reason:

The current `nutritions` migration does not define a `created` field, and PocketBase rejects `sort=created`.

The query must also filter by the authenticated user:

`user = authenticated user id`

The `nutritions.user` field is a relation to the `users` auth collection.

## Verification

- TypeScript check passed.
- Backend Python compile check passed.
- Direct PocketBase API check loaded today's records using the app-style UTC date filter.

## Result

Saved nutrition records can now be loaded from PocketBase after sign-in and used to rebuild the daily summary.

## Limitations

- Only today's records are loaded.
- There is no date picker yet.
- Removing a food still only updates local state.
- PocketBase delete support should be added next.

## Lessons Learned

Persistence is not complete after saving records; the app also needs a restore/load flow.

PocketBase query fields must match the actual collection schema. Sorting by a missing field causes API errors.

## Open Questions

- Should the app support selecting previous days?
- Should the dashboard query daily records directly or use cached summaries?
- Should remove actions delete PocketBase records immediately?
- Should date filtering use local timezone or UTC day boundaries?
- Should `created` and `updated` fields be added to the custom collection migration?

Writing rules:

- Keep the entry clear and simple.
- Focus on loading saved records and restoring daily summary.
- Mention the `sort=loggedDate` lesson.
- Do not add unrelated features.
```
