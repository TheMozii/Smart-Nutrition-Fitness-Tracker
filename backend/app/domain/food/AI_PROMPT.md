# AI Agent Prompt: Backend Food Logging Domain Logic

Implement the backend domain logic for the Food Logging feature in the Smart Nutrition & Fitness Tracker application.

Before implementation, check the `/docs` folder and follow the existing project structure and constraints from `AGENTS.md`.

## Selected Pattern

Use the Command pattern on the frontend and keep backend logic layered and modular.

The backend should support the Food Logging feature by normalizing food data and returning predictable responses.

## Module Location

Create and work inside:

`backend/app/domain/food/`

Related backend files may be placed in:

`backend/app/services/`

`backend/app/api/routes/`

`backend/app/schemas/`

## Requirements

1. Use Python.
2. Use FastAPI-compatible structure.
3. Keep business logic separated from route handlers.
4. Keep pure logic inside the domain layer.
5. Keep API calls inside the service layer.
6. Use clear and descriptive names.
7. Keep functions small and single-responsibility.
8. Do not add unnecessary libraries.
9. Do not over-engineer the solution.

## Files to Create

```txt
backend/app/domain/food/
├── mapper.py
└── pure_logic.py