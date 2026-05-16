# Architecture

## Overview

The system follows a layered architecture separating frontend, backend, and external services.

The Food Logging module is implemented using the Command pattern to manage user actions and state transitions.

## Diagram

```mermaid
flowchart TD
    User[User] --> App[React Native Expo App]

    App --> FoodModule[Food Logging Module]
    FoodModule --> Reducer[Pure Reducer]
    Reducer --> Command[Command Object]

    Command --> Service[Frontend Food Service]
    Service --> Backend[FastAPI Backend]

    Backend --> FoodRoute[Food Route]
    FoodRoute --> FoodService[Food Service]
    FoodService --> Mapper[Pure Food Mapper]
    FoodService --> ExternalAPI[Open Food Facts API]
    FoodService --> OpenAI[OpenAI API]

    Mapper --> FoodRoute
    FoodRoute --> Service
    Service --> FoodModule
    FoodModule --> User
```
