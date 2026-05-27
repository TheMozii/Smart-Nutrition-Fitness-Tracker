# Next Step: MVP Stabilization

## Context

The MVP now includes authentication, food search, AI text analysis, PocketBase persistence, a daily dashboard, a weekly chart, and core tests.

The remaining MVP work is to make the app easier to run, easier to verify, and clearer when services are offline.

## Status

Implemented.

## Goal

Finish the main MVP cleanup pass by documenting local setup, adding a manual smoke-test checklist, improving service error messages, and replacing the hardcoded calorie target with a simple editable value.

## Scope

### Include

- Local setup documentation.
- Manual smoke-test checklist.
- Clear backend-unavailable message.
- Clear PocketBase-unavailable message.
- Editable calorie goal in the dashboard.

### Exclude

- Persistent user goal storage.
- End-to-end automated browser tests.
- Production deployment configuration.
- Post-MVP features like image recognition or weight tracking.

## Implemented Files

```txt
README.md
docs/setup.md
docs/smoke_test.md
frontend/src/app/index.tsx
frontend/src/features/auth/service.ts
frontend/src/features/food-logging/service.ts
frontend/src/services/api.ts
docs/plans/next_step_mvp_stabilization.md
```

## Trade-Offs

- The calorie goal is local UI state for now. Persisting goals should be a separate feature with a PocketBase schema.
- Smoke testing remains manual because automated browser testing would add more setup overhead than value at this MVP stage.
- Error handling stays service-level so UI components remain simple.
