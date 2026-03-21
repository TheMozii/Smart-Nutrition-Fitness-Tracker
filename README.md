# 🥗 Smart Nutrition & Fitness Tracker (AI-powered)

![Status](https://img.shields.io/badge/status-in%20development-yellow)
![License](https://img.shields.io/badge/license-MIT-green)
![Platform](https://img.shields.io/badge/platform-web%20%7C%20mobile-blue)
![AI](https://img.shields.io/badge/AI-OpenAI-purple)

---

## 📌 Overview

Smart Nutrition & Fitness Tracker is an AI-powered application that helps users monitor nutrition, track fitness progress, and build healthier habits through a simple and intuitive interface.

The system combines food tracking, AI-based analysis, and progress visualization into a single platform, reducing complexity compared to traditional fitness apps.

---

## ❗ Problem

Tracking nutrition and fitness is often inefficient and confusing:

- manual food logging is time-consuming  
- nutritional data is difficult to interpret  
- existing apps are overloaded with unnecessary features  
- users lack a unified tool for diet + fitness tracking  

As a result, many users stop tracking or never start.

---

## 🎯 Target Users

- beginners learning about nutrition  
- users aiming to lose weight or gain muscle  
- gym users tracking performance and diet  
- people who want a simple alternative to complex apps  

---

## ⚙️ Core Features

### 🥑 Food Logging
- manual meal input  
- barcode scanning (Open Food Facts API)  

### 🤖 AI Food Analysis
- analyze food via text input  
- analyze food via images (calories & macros estimation)  

### 📊 Nutrition Tracking
- calories, protein, fats, carbs  
- daily & weekly summaries  

### 🏋️ Fitness Tracking
- weight tracking  
- progress history with charts  

### 🎯 Goals System
- calorie targets  
- weight goals (loss / gain / maintenance)  

### 🔐 Authentication
- secure login & registration  
- JWT-based authentication  

### 📈 Data Visualization
- charts for nutrition & progress  

### 🎨 UI/UX
- minimal and user-friendly design  

---

## 🧠 System Architecture (High-Level)

Client (React / React Native)
↓
API Layer (FastAPI / Node.js)
↓
Services:

Auth Service
Nutrition Service
AI Service
↓
Database (PostgreSQL / Supabase)
↓
External APIs:
OpenAI (AI analysis)
Open Food Facts (barcode data)


---

## 🛠️ Tech Stack

### Frontend
- React / React Native (Expo)
- TypeScript
- Chart libraries (Recharts / Victory)

### Backend
- FastAPI (Python) / Node.js (Express)
- REST API / GraphQL

### Database
- PostgreSQL / Supabase

### AI Integration
- OpenAI API (text + image analysis)

### Other
- JWT Authentication
- Docker (optional)
- CI/CD (GitHub Actions)

## 👨‍💻 Author

**Ruvims Ungeitis**  
Computer Science Student  

---
