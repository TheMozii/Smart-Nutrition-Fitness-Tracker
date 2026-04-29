# AI Agent Prompt: Food Logging Command Pattern

Implement the Food Logging module for the Smart Nutrition & Fitness Tracker application.

Before implementation, check the `/docs` folder and follow the existing project structure and constraints.

## Selected Pattern

Use the Command pattern.

## Module Location

Create and work only inside:

`frontend/src/features/food-logging/`

## Requirements

1. Use TypeScript for all frontend logic.
2. Keep the module simple, modular, and scalable.
3. Use clean architecture principles.
4. Keep functions small, reusable, and single-responsibility.
5. Use clear and descriptive names.
6. Avoid unnecessary complexity and over-engineering.
7. Do not add unrelated features.
8. Do not introduce new libraries unless clearly required.

## Command Pattern Rules

- User actions must be represented as events.
- Events are processed by a pure reducer.
- The reducer must return:
  - next state
  - command object
- Commands describe side effects but do not execute them directly.
- API calls must be handled only in the service layer.

Supported commands:

- `NONE`
- `FETCH_FOOD_BY_NAME`
- `FETCH_FOOD_BY_BARCODE`

## Files to Create

```txt
frontend/src/features/food-logging/
├── foodLogging.types.ts
├── foodLogging.commands.ts
├── foodLogging.reducer.ts
├── foodLogging.service.ts
└── foodLogging.mapper.ts