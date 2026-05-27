# Next Step: Core Tests

## Context

The MVP flow now includes authentication, food lookup, AI text analysis, PocketBase persistence, a daily dashboard, and a weekly calorie chart.

The next stabilization step is to protect the core logic with focused tests before adding more features.

## Status

Implemented with lightweight frontend and backend tests.

## Goal

Add tests for the food logging reducer and backend food mapping/service behavior.

## Scope

### Include

- Frontend reducer tests for validation, command creation, daily totals, delete behavior, and weekly totals.
- Backend mapper tests for valid food data, missing nutrition fields, and not-found data.
- Backend service tests for AI text analysis validation and missing OpenAI API key handling.
- Backend API route tests for health, food search success, food not found, and AI error mapping.
- Simple commands for running tests.

### Exclude

- End-to-end browser tests.
- PocketBase integration tests.
- External Open Food Facts or OpenAI network calls.

## Implemented Files

```txt
.gitignore
frontend/package.json
frontend/src/features/food-logging/reducer.test.ts
backend/tests/test_food_mapper.py
backend/tests/test_food_service.py
backend/tests/test_api_routes.py
docs/plans/next_step_tests.md
```

## Test Commands

```txt
cd frontend && npm run test
cd backend && python3 -m unittest discover -s tests
```

## Trade-Offs

- The frontend reducer test uses TypeScript compilation plus Node execution instead of adding Jest, keeping dependencies simple.
- Backend tests use Python `unittest` instead of adding pytest.
- Network integrations are intentionally excluded so the tests are fast and stable.
