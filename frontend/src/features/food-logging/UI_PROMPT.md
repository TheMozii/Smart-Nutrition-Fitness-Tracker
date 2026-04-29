# AI Prompt: Generate Food Logging UI

Generate a React Native (Expo) screen for the Food Logging feature.

Follow the design contract in `/docs/design/design.md`.

Requirements:

1. Create a screen with:
   - text input for food name
   - search button
   - scan barcode button (UI only)
   - status display
   - nutrition result card

2. Use clean layout:
   - padding 16px
   - rounded cards
   - simple design
   - no overengineering

3. Connect to existing logic:
   - use reducer from foodLogging.reducer.ts
   - dispatch events:
     - TYPE_NAME
     - SUBMIT_SEARCH
   - handle:
     - loading
     - success
     - error
     - not_found

4. Do not implement:
   - navigation
   - authentication
   - real barcode scanner

5. Keep code simple and readable