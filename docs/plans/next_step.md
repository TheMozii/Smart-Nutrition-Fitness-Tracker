# Next Step: AI Text-Based Food Analysis

## Context

The current Food Logging module already supports searching nutrition data by food name and barcode through the existing frontend command flow and FastAPI backend.

The next MVP step should add AI text-based food analysis. This fits the roadmap because it improves speed of input without adding image recognition, advanced analytics, or complex database work too early.

## Status

Implemented as the next MVP increment.

## Goal

Allow a user to describe a meal in plain text and receive an approximate nutrition estimate with calories, protein, carbs, and fats.

Example user input:

```txt
2 eggs, 1 slice of toast, and coffee with milk
```

Expected output:

```txt
Estimated calories, protein, carbs, and fats for the described meal.
```

## Why This Is the Right Next Step

- It supports the project goal of fast food input.
- It reuses the existing Food Logging screen and command pattern.
- It keeps AI output approximate, matching the project constraint.
- It can be implemented before image recognition, which is more complex.
- It creates a useful experiment for the knowledge base.

## Scope

### Include

- Add a text meal analysis action to the Food Logging feature.
- Add a backend endpoint for AI nutrition estimation.
- Keep AI prompt and response mapping in the backend food domain.
- Return a predictable response shape:

```json
{
  "status": "success",
  "food": {
    "name": "Estimated meal",
    "calories": 450,
    "protein": 25,
    "carbs": 40,
    "fats": 18
  },
  "message": "AI estimate. Values are approximate."
}
```

### Exclude

- Image-based food recognition.
- Meal storage in Supabase.
- Personalized recommendations.
- Medical or diet advice.
- Custom machine learning models.

## Acceptance Criteria

### AC1 Analyze Meal Description

Given the user enters a meal description, when the user submits it for AI analysis, then the system returns estimated calories, protein, carbs, and fats.

### AC2 Handle Empty Input

Given the input is empty, when the user submits the request, then the app shows a validation error and does not call the backend.

### AC3 Handle AI Failure

Given the AI service is unavailable, when the user submits a valid meal description, then the app shows a clear error message without crashing.

### AC4 Show Approximation Notice

Given AI nutrition values are estimates, when results are shown, then the UI clearly indicates that values are approximate.

## Implementation Plan

1. Add a new frontend command:
   - `ANALYZE_MEAL_TEXT`

2. Extend the food logging reducer:
   - Add an event for submitting AI analysis.
   - Keep API execution in the service layer.

3. Add frontend service function:
   - `analyzeMealText(description: string)`

4. Add backend route:
   - `POST /food/analyze-text`

5. Add backend service logic:
   - Build a constrained prompt for nutrition estimation.
   - Parse the AI response into the existing nutrition shape.

6. Add documentation:
   - Update architecture flow.
   - Add a PKM experiment entry in the knowledge base.

## Implemented Files

```txt
backend/app/api/routes/food.py
backend/app/services/food_service.py
frontend/src/app/food-logging.tsx
frontend/src/features/food-logging/hooks.ts
frontend/src/features/food-logging/reducer.ts
frontend/src/features/food-logging/service.ts
frontend/src/features/food-logging/types.ts
frontend/src/services/api.ts
docs/prompts/knowledge_base_update_prompt.md
```

## Environment Variables

```txt
OPENAI_API_KEY=your_api_key
OPENAI_MODEL=gpt-5.2
```

`OPENAI_MODEL` is optional. The backend defaults to `gpt-5.2`.

## Trade-Offs

- AI text analysis is faster for users but less reliable than verified nutrition database data.
- A simple endpoint is enough now; a separate AI microservice would add unnecessary complexity.
- Structured JSON output should be required from the AI model to keep frontend handling simple.

## Knowledge Base Experiment To Create

Create a new experiment in the PKM repository:

```txt
experiments/EXP-ai-text-food-analysis.md
```

The experiment should record the hypothesis, implementation attempt, observations, result, and open questions.
