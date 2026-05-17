# AI Prompt: Add PocketBase Nutrition Persistence To Knowledge Base

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
Add a knowledge base entry about the completed next step: PocketBase Nutrition Persistence.

Recommended file:
experiments/EXP-pocketbase-nutrition-persistence.md

# Experiment: PocketBase Nutrition Persistence

## Context

The app already has:

- PocketBase authentication
- food search by name
- barcode lookup
- AI text-based food analysis
- local daily nutrition summary

The next step was to connect the daily nutrition summary to PocketBase so logged foods are saved for the authenticated user.

## Hypothesis

Saving nutrition records to PocketBase after authentication will make the daily summary more useful because logged meals can belong to a real user instead of only local state.

## Implementation

Record that the implementation added:

- Authenticated PocketBase user id and token passed into Food Logging.
- A save command in the Food Logging command flow.
- PocketBase `nutritions` record creation when the user taps "Add to Day".
- Local daily summary update only after PocketBase confirms the save.
- Field-level PocketBase error parsing for save failures.

Expected PocketBase collection:

`nutritions`

Fields:

- `user` relation to `users`
- `name` text
- `source` select: `open_food_facts`, `ai_text`, `manual`
- `barcode` text optional
- `calories` number
- `protein` number
- `carbs` number
- `fats` number
- `loggedDate` date

Recommended access rules:

- List/Search: `user = @request.auth.id`
- View: `user = @request.auth.id`
- Create: `@request.auth.id != ""`
- Update: `user = @request.auth.id`
- Delete: `user = @request.auth.id`

## Observations

Record these observations:

- The existing command pattern allowed persistence to be added without putting API calls inside the reducer.
- PocketBase requires the collection schema and access rules to match the app payload.
- Saving before updating local totals prevents unsaved records from appearing as saved.
- The current remove action still only updates local state.

## Result

Initial result: implemented.

Verification:

- Frontend TypeScript check passed.
- Backend Python compile check passed.

Limitations:

- Existing saved records are not loaded on app startup yet.
- Removing a logged food does not delete it from PocketBase yet.
- The `nutritions` collection must be configured correctly in PocketBase.

## Lessons Learned

Authentication should be connected to nutrition persistence before building dashboards, because dashboard data needs user-owned records.

PocketBase makes MVP persistence simple, but schema and access rules must be documented clearly.

## Open Questions

- Should the app load today's saved records immediately after login?
- Should removing a food delete the PocketBase record?
- Should logged foods support serving size editing before save?
- Should `source` be shown in the UI?
- Should daily totals be calculated in the frontend or cached in PocketBase later?

Writing rules:

- Keep the entry clear and simple.
- Focus on persistence, user ownership, and PocketBase schema.
- Do not add unrelated features.
- Be explicit about limitations and next steps.
```
