# 🤖 AGENTS.md

## 📌 Project Overview

- This project is a **Smart Nutrition & Fitness Tracker (AI-powered)**  
- The goal is to help users:
  - track food intake  
  - analyze nutrition (calories, protein, fats, carbs)  
  - monitor fitness progress  
- The system integrates:
  - AI-based food analysis (text + image)  
  - nutrition tracking  
  - user goals and progress visualization  

---

## ⚙️ Core System Components

- Frontend:
  - React Native (TypeScript)

- Backend:
  - FastAPI (Python)

- Database:
  - Supabase

- External Services:
  - OpenAI API (food analysis)
  - Open Food Facts API (barcode data)

---

## 🧠 Key Concepts

- Focus on **simplicity over complexity**
- Prioritize **user experience and speed of input**
- AI output is **approximate**, not medically accurate
- System should be **modular and scalable**

---

## 📏 Coding Rules

- Use **TypeScript** for frontend
- Use **clean architecture principles**
- Keep functions:
  - small  
  - reusable  
  - single-responsibility  

- Naming:
  - clear and descriptive  
  - no abbreviations unless standard  

- Avoid:
  - unnecessary complexity  
  - premature optimization  
  - over-engineering  

---

## 🚫 Restrictions

- Do NOT introduce complex microservices unless explicitly required  
- Do NOT implement custom ML models (use APIs instead)  
- Do NOT add features without clear purpose  
- Do NOT break existing architecture consistency  

---

## 📂 Documentation Rule (CRITICAL)

- ALWAYS refer to the `/docs` folder before making decisions
- `/docs` contains:
  - architecture decisions  
  - project requirements  
  - system constraints  

- If something is unclear:
  - check `/docs` first  
  - do NOT assume missing context  

---

## 🔄 Development Guidelines

- Prefer:
  - simple solutions  
  - incremental improvements  
  - readable code  

- When adding features:
  - explain reasoning  
  - consider trade-offs  
  - align with existing architecture  

---

## 🎯 Goal for AI Agent

- Assist in building a **clean, maintainable, and scalable system**
- Support **learning and understanding**, not just code generation
- Provide solutions that match:
  - project scope  
  - current architecture  
  - user-focused design  

---