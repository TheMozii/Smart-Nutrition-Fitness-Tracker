# AI Prompt: Add Next Step To Knowledge Base

Use this prompt with the project knowledge base:

```txt
You are updating my existing Cognitive PKM Repository for the Smart Nutrition & Fitness Tracker project.

Knowledge base repository:
https://github.com/TheMozii/Knowledge-Base

Project repository context:
Smart Nutrition & Fitness Tracker is an AI-powered nutrition and fitness tracking app using React Native, FastAPI, Supabase, OpenAI API, and Open Food Facts API.

Before writing, follow the knowledge base structure:

- `inbox/` stores raw ideas and quick captures.
- `beliefs/` stores assumptions and mental models.
- `decisions/` stores architectural and product decisions.
- `experiments/` stores implementation attempts, observations, failures, and lessons.

Do not mix these layers:

- If the content is an assumption, write it as a belief.
- If the content is a choice between alternatives, write it as a decision.
- If the content tests an implementation idea, write it as an experiment.
- If the content is unclear or unprocessed, place it in inbox first.

Important:
Do not create a new repository structure.
Use the existing folders only:
- inbox/
- beliefs/
- decisions/
- experiments/

Recommended file:
`experiments/EXP-ai-text-food-analysis.md`

Task:
Add an experiment entry for the completed next project step: AI text-based food analysis.

Use this structure:

# Experiment: AI Text-Based Food Analysis

## Context

The Smart Nutrition & Fitness Tracker already supported food lookup by name and barcode through the Food Logging module.

The next MVP step was implemented: users can type a natural meal description and receive approximate nutrition values.

Example input:

"2 eggs, 1 slice of toast, and coffee with milk"

The feature returns:

- calories
- protein
- carbs
- fats
- approximation message

## Hypothesis

Users can log meals faster if they can describe food in natural language instead of searching every item manually.

## Implementation

Record that the implementation added:

- Frontend event: `SUBMIT_AI_ANALYSIS`
- Frontend command: `ANALYZE_MEAL_TEXT`
- Frontend service function: `analyzeMealText(description)`
- API client function: `analyzeFoodText(description)`
- Backend endpoint: `POST /food/analyze-text`
- Backend OpenAI integration through the Responses API
- Structured JSON output for nutrition estimates
- Approximation message shown in the UI

## Observations

Record these observations:

- The existing Command pattern made it straightforward to add another side effect.
- The backend kept AI-specific logic away from route handlers.
- Structured JSON output was used to keep frontend handling simple.
- The feature depends on `OPENAI_API_KEY`.
- Values must be treated as approximate, not medically accurate.

## Result

Initial result: implemented.

Verification:

- Backend Python files compiled successfully.
- Frontend TypeScript check completed successfully.

Still needs real API validation with a configured `OPENAI_API_KEY`.

## Lessons Learned

AI text analysis fits the MVP better than image recognition at this stage because it improves speed of input while keeping the architecture simple.

The app should keep verified database lookup and AI estimation separate because they have different reliability levels.

## Open Questions

List remaining uncertainties, such as:

- How accurate are the estimates for mixed meals?
- Should users confirm or edit AI results before saving?
- Should verified Open Food Facts data be preferred when available?
- How should the app explain that AI values are approximate?
- Should this be implemented before authentication and meal persistence?

Writing rules:

- Keep the entry understandable without extra context.
- Be explicit about uncertainty.
- Focus on reasoning, outcome, and learning.
- Do not claim medical accuracy.
- Do not add features beyond the project scope.
```

## Notes

This prompt is aligned with the existing knowledge base structure and the current project roadmap.
