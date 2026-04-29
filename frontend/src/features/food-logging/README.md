# Food Logging Module

## Pattern Used

This module uses the Command pattern.

The user action is converted into a command, such as searching food by name or barcode. The reducer stays pure and only returns the next state and command. Side effects such as API calls are handled separately by the service layer.

## Why Command Pattern

The Command pattern was chosen because the feature has multiple user actions that trigger different operations:

- search food by name
- search food by barcode
- handle success result
- handle not found result
- handle request error

This keeps the logic predictable, testable, and easier to extend later.

## Components

- `foodLogging.types.ts` contains shared types.
- `foodLogging.reducer.ts` contains pure state transition logic.
- `foodLogging.commands.ts` contains command definitions.
- `foodLogging.service.ts` handles API calls.
- `foodLogging.mapper.ts` transforms data for UI and charts.

## Interaction with System

The Food Logging module communicates with the backend through the service layer. The frontend does not call external food APIs directly. The backend handles external API communication and returns normalized nutrition data.