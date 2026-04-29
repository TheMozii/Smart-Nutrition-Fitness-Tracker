# Backend Food Domain

## Purpose

This folder contains backend domain logic for the Food Logging feature.

The goal is to normalize food data returned from an external food database into a predictable response format for the frontend.

## Responsibilities

### `mapper.py`

Contains pure mapping logic.

It converts raw food API data into the internal nutrition response format.

### `pure_logic.py`

Contains extra pure helper functions for food-related calculations or validation.

### `AI_PROMPT.md`

Documents the prompt used to guide the AI agent implementation.

## Architecture

```txt
Route
→ Service
→ External Food API
→ Domain Mapper
→ Normalized Response