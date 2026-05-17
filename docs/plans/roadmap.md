# 🗺️ Project Roadmap

## 📌 Overview

This document outlines the high-level implementation plan for the Smart Nutrition & Fitness Tracker (AI-powered).

The project is divided into stages (sprints), starting from a minimal viable product (MVP) and gradually expanding with more advanced features.

---

## Current Assignment Update: Food Logging Module

This roadmap was updated for Practical Assignment 4: Architectural Patterns and Structural Integrity.

The selected feature is Food Logging. The module is implemented using the Command pattern to separate user actions from side effects such as API calls.

### Completed for this assignment:

- Selected Food Logging as the target feature.
- Added pure frontend reducer logic for food logging state transitions.
- Added command-based structure for food search by name and barcode.
- Added backend domain mapper for normalizing food API responses.
- Updated architecture documentation with the Food Logging module flow.
- Added module-level documentation explaining the selected pattern.

### Pattern Used:

Command pattern

### Reason:

The feature has multiple user-triggered actions, such as searching by food name and scanning a barcode. The Command pattern keeps these actions structured and separates pure state logic from external API calls.

## Completed Next Step: AI Text-Based Food Analysis

AI text-based food analysis has been implemented as the next MVP increment.

This step is documented in:

```txt
docs/plans/next_step.md
```

Reason:

- Food lookup by name and barcode is already implemented.
- Text-based AI analysis is part of the MVP scope.
- It improves speed of food input without adding image recognition complexity yet.
- It can be tracked as an experiment in the knowledge base repository.

## Completed Next Step: Daily Nutrition Summary

Daily nutrition summary has been implemented as a local frontend state increment.

This step is documented in:

```txt
docs/plans/next_step_daily_summary.md
```

Reason:

- Food lookup and AI analysis now produce nutrition results.
- Users need a way to turn those results into daily totals.
- Local state validates the workflow before Supabase persistence is added.

## Completed Next Step: PocketBase Authentication

PocketBase authentication has been implemented as a frontend auth flow.

This step is documented in:

```txt
docs/plans/next_step_auth_foundation.md
```

Reason:

- Authentication is part of the MVP scope.
- The app needs a login/register flow before user-specific persistence.
- PocketBase provides email/password auth without custom backend auth logic.

## Completed Next Step: PocketBase Nutrition Persistence

Saving daily nutrition records to PocketBase has been implemented.

This step is documented in:

```txt
docs/plans/next_step_pocketbase_nutrition_persistence.md
```

Reason:

- Authenticated users now need user-owned nutrition records.
- The daily summary should only update after a food is saved.
- PocketBase persistence prepares the app for dashboards and history.

## 🚀 MVP Scope (Minimum Viable Product)

The MVP focuses on delivering core functionality with a simple and usable system.

### Included in MVP:
- User authentication (register / login)
- Food logging (manual input)
- Basic AI food analysis (text-based)
- Nutrition tracking (calories, protein, fats, carbs)
- Daily summary view
- Simple dashboard (basic UI)

### Not included in MVP:
- Image-based food recognition
- Advanced analytics
- Social features
- Device integrations (Apple Health, etc.)

---

## 🧱 Stage 1 — Project Setup & Architecture

### Goals:
- Initialize frontend and backend projects
- Define folder structure and architecture
- Setup database and authentication

### Tasks:
- Setup React Native (Expo) frontend
- Setup backend (FastAPI or Node.js)
- Configure database (PostgreSQL / Supabase)
- Implement basic authentication (JWT)
- Create initial API structure

---

## 🥗 Stage 2 — Core Nutrition Features (MVP)

### Goals:
- Implement main food tracking functionality

### Tasks:
- Create food logging system using Command pattern
- Support search by food name
- Support barcode-based food lookup
- Handle food not found state
- Integrate AI text-based food analysis (OpenAI)
- Store meals in database
- Calculate daily nutrition totals
- Build basic dashboard UI

---

## 📊 Stage 3 — Visualization & UX Improvements

### Goals:
- Improve usability and user experience

### Tasks:
- Add charts for daily/weekly nutrition
- Improve UI/UX (forms, navigation)
- Add error handling and validation
- Optimize performance

---

## 🧪 Stage 4 — Testing & Stabilization

### Goals:
- Ensure system reliability and correctness

### Tasks:
- Add unit tests (backend & frontend)
- Add unit tests for food logging reducer
- Add unit tests for backend food mapper
- Test API endpoints
- Fix bugs and edge cases
- Improve code structure

---

## 🤖 Stage 5 — Advanced Features (Post-MVP)

### Goals:
- Extend functionality beyond MVP

### Features:
- Image-based food analysis
- Barcode scanning (Open Food Facts)
- Personalized recommendations (AI)
- Improved goal tracking
- Offline support

---

## 🌐 Stage 6 — Future Enhancements

### Planned Improvements:
- Integration with Apple Health / Google Fit
- Social features (sharing progress)
- Meal planning and recipes
- Notifications and reminders
- Multi-language support

---

## ⏱️ Sprint Plan (Example)

| Sprint | Focus |
|------|------|
| Week 1 | Setup + Authentication |
| Week 2 | Food logging + AI integration |
| Week 3 | Dashboard + nutrition tracking |
| Week 4 | UI improvements + charts |
| Week 5 | Testing + bug fixing |
| Week 6+ | Advanced features |

---

## 🎯 Success Criteria

The MVP is considered successful if:

- Users can log meals easily  
- AI provides usable nutrition estimates  
- Daily nutrition tracking works correctly  
- The app is stable and usable  

---

## 🔄 Iteration Strategy

- Build simple → test → improve  
- Prioritize usability over complexity  
- Validate assumptions through experiments (tracked in PKM repo)  

---

## 📌 Notes

- AI results are approximate and should not be treated as medical advice  
- Focus is on simplicity and speed of input  
- Architecture should remain scalable for future features  

---
