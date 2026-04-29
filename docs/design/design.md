# UI Design Contract: Food Logging Feature

## Framework Choice

React Native (Expo)

## Purpose

Allow user to search food by name or barcode and display nutritional information.

---

## Color Palette

- Primary: #1f6feb (blue)
- Background: #f4f7fb (light gray)
- Card: #ffffff
- Text: #222222
- Secondary text: #666666
- Error: #ff4d4f

---

## Typography

- Title: 24px, bold
- Subtitle: 16px
- Body: 14px
- Button text: 16px bold

---

## Layout Rules

- Use vertical layout
- Keep spacing consistent (16px padding)
- Use rounded corners (12–16px)
- Do not stack multiple primary buttons

---

## Components

### Food Search Form

- Text input (food name)
- Button "Search"
- Button "Scan Barcode"

### Status Display

- Shows:
  - loading
  - error
  - not found
  - success

### Nutrition Card

- Food name
- Calories
- Protein
- Carbs
- Fats

---

## Behavior Rules

- Empty input → show error
- Valid input → show loading
- Success → show food data
- Not found → show message
- Error → show error message

---

## Interaction Flow

```txt
User input
→ reducer
→ command
→ service
→ backend
→ result
→ reducer
→ UI update