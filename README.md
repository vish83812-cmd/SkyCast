# 🌦️ SkyCast — Mausam Personalised Weather Intelligence

> A personalised weather intelligence platform designed for India's diverse weather needs.


## 📌 Overview

SkyCast is a **mobile-first weather intelligence application** designed around the user's needs rather than a generic weather dashboard.

It personalises weather information for different user personas such as **Health, Fitness, Travel, Family, Beach, Agriculture, Commuter and Event Planner**, helping users quickly understand the weather information most relevant to them.

## ✨ Key Features

* 👤 **Persona-based personalised dashboard**
* 🌤️ Real-time weather & forecasts
* 🌫️ Air Quality & CPCB-based AQI calculation
* 🌊 Marine & coastal conditions
* 🌾 Indian pollen estimation
* 🗺️ India-focused weather maps
* 🌀 Cyclone & weather awareness
* 🪔 Festival & travel weather context
* 🌐 Multilingual interface
* 📍 India-specific location search
* 💾 Local preferences & weather caching
* 🔔 Weather notification interface
* 📊 City comparison & weather insights

## 👥 Supported Personas

| Persona          | Key Information                            |
| ---------------- | ------------------------------------------ |
| 🩺 Health        | AQI, UV, heat & outdoor health conditions  |
| 🏃 Fitness       | Temperature, humidity, UV & air quality    |
| 👨‍👩‍👧 Family  | Air quality & outdoor safety               |
| ✈️ Traveller     | Destination weather & conditions           |
| 🏖️ Beach        | Marine and coastal conditions              |
| 🌾 Agriculture   | Weather conditions relevant to farming     |
| 🚗 Commuter      | Rain, wind, visibility & travel conditions |
| 🎪 Event Planner | Outdoor weather risk                       |

## 🛠️ Tech Stack

**Frontend**

* React
* TypeScript
* Vite
* Tailwind CSS

**Data & APIs**

* Open-Meteo Weather API
* Open-Meteo Air Quality API
* Open-Meteo Marine API
* Open-Meteo Geocoding API

**Visualisation**

* Recharts
* D3 / React Simple Maps

**Backend**

* Node.js
* Express

## 🏗️ Architecture

```text
User
 │
 ▼
Persona Selection
 │
 ▼
Personalised Dashboard
 │
 ├── Weather ────────┐
 ├── Air Quality ────┤
 ├── Marine Data ────┤
 └── Location ───────┘
          │
          ▼
    Data Processing
          │
          ▼
 Persona-specific Insights
```

## 🚀 Getting Started

### Prerequisites

* Node.js
* npm

### Installation

```bash
git clone https://github.com/vish83812-cmd/SkyCast.git
cd SkyCast
npm install
```

Create `.env.local` and add the required environment variables:

```env
GEMINI_API_KEY=your_api_key
```

Start the development server:

```bash
npm run dev
```

## 📱 Future Mobile Deployment

SkyCast is being developed with a **mobile-first architecture** and can be extended into an Android application while retaining the existing React/TypeScript codebase.

Planned mobile capabilities include:

* Device-based location
* Push notifications
* Offline/last-known weather
* Native Android deployment

## 🔗 Links

**Live Demo:** https://skycast-sih-2026.pages.dev/


**Ministry of Earth Sciences**
