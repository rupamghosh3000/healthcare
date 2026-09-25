# CareConnect — Civic Healthcare Navigation & Volunteer Network

[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth_%26_Firestore-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Gemini API](https://img.shields.io/badge/Google_Gemini-Live_%26_Flash-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)

**CareConnect** is an open, community-first non-emergency healthcare navigation network. It bridges the critical divide between healthcare systems and vulnerable community members by mobilizing screened volunteers to provide companion support, appointment transportation, and wellness checks—guided by compassionate AI and real-time location grounding.

---

## 📖 Table of Contents
1. [NGO & Civic Impact Use Case](#-ngo--civic-impact-use-case)
2. [Key Features](#-key-features)
3. [AI Idea & Architecture](#-ai-idea--architecture)
4. [Tech Stack](#-tech-stack)
5. [Database & Security (Firebase)](#-database--security-firebase)
6. [System Workflow](#-system-workflow)
7. [Getting Started & Local Development](#-getting-started--local-development)
8. [Safety & Clinical Boundary Policies](#-safety--clinical-boundary-policies)

---

## 🤝 NGO & Civic Impact Use Case

Every day, vulnerable individuals—particularly low-income seniors, individuals with disabilities, and underserved patients—miss essential medical treatments (such as dialysis, oncology follow-ups, and post-operative evaluations) due to logistical barriers rather than lack of clinical care.

### The Problem
* **Social Isolation in Clinical Settings:** Hospital discharge instructions, complex medical pavilions, and prolonged waiting rooms cause profound anxiety for unassisted elderly individuals.
* **Non-Emergency Transit Gaps:** Ambulance services are cost-prohibitive and overburdened for basic transit, while ride-hailing services lack companion escort, wheelchair staging, and waiting-room support.
* **Overburdened Hospital Staff:** Nurses and administrative intake staff spend excessive hours coordinating rides, tracking lost patients across hospital wings, and addressing basic navigation questions.

### The NGO Solution
CareConnect empowers local NGOs, healthcare charities, mutual-aid networks, and municipal public health departments to:
1. **Coordinate Non-Clinical Care Escorts:** Deploy vetted community volunteers who wait alongside patients, take notes during non-clinical discharge, and provide compassionate accompaniment.
2. **Provide Accessible Appointment Transit:** Organize volunteer drivers with verified licenses, wheelchair-accessible vehicle staging, and personalized curbside assistance.
3. **Conduct Routine Wellness Checks:** Deliver groceries, check on homebound elders, and provide companion check-ins to prevent chronic condition deterioration.
4. **Relieve Municipal Emergency Resources:** Filter out non-emergency logistics from 911 dispatch, ensuring emergency paramedics focus on acute life-threatening calls.

---

## 🌟 Key Features

### 1. Support Request Portal (`/request-support`)
* **Intuitive Intake Form:** Citizens or family members can request companion aid, appointment transportation, or wellness checks in under 2 minutes.
* **Google Maps Facility Locator:** Integrated address finder powered by Google Maps grounding (`gemini-3.5-flash`), allowing users to locate hospital pavilions, outpatient clinic entrances, and accessibility features with 1 click.
* **Intelligent Urgency Triage:** Categorizes requests into *Normal*, *Soon*, and *Urgent* with companion logistics notes.

### 2. Volunteer Registration & Onboarding (`/volunteer`)
* **Community Enrollment:** Prospective volunteers register availability, geographic zones, preferred support types, and personal motivations.
* **Verification Pipeline:** NGO coordinators review background verification, driver credentials, and adherence to civic codes of conduct.

### 3. Administrative Coordinator Dashboard (`/admin/dashboard`)
* **Live Ticket Tracking:** Search, filter, inspect, and update the status of all support requests (*Pending*, *Reviewing*, *Volunteer Assigned*, *In Progress*, *Completed*).
* **Volunteer Assignment Matrix:** Assign verified local volunteers to open community tickets based on district proximity and availability.
* **Operational Analytics:** Real-time metrics tracking active tickets, fulfillment rates, and community coverage.

### 4. Interactive AI Care Assistant (`/ai-assistant`)
* **Multi-Turn Conversational Navigation:** Persistent conversation history thread with role-specific system guidance.
* **Specialized Role Switching:**
  * **Care Navigator:** Focuses on companion logistics, outpatient escort, and mobility options.
  * **Volunteer Coordinator:** Guides volunteers through vetting, hours logging, and community guidelines.
  * **Civic Triage Specialist:** Assists with complex multi-stop transit and accessibility requirements.
  * **General Guide:** Answers civic policies and non-emergency FAQs.
* **Model Tier Selector:** Dynamically switch between `gemini-3.1-flash-lite` (instant speed), `gemini-3.5-flash` (balanced reasoning), and `gemini-3.8-flash` (complex triage).

### 5. Real-Time Live Voice Companion (`gemini-3.8-live`)
* **Voice-to-Voice Interaction:** Accessible directly from the navigation bar. Citizens who cannot type or read small text can speak naturally into their microphone.
* **Full-Duplex Audio Engine:** 16kHz microphone stream transmitted over WebSockets to Gemini Live API with 24kHz synthesized audio playback and instant interruption handling.

---

## 🧠 AI Idea & Architecture

CareConnect uses Google's latest Gemini models via the `@google/genai` TypeScript SDK:

```
                          ┌────────────────────────────┐
                          │   CareConnect Frontend     │
                          │   (React 19 + Tailwind v4) │
                          └──────────────┬─────────────┘
                                         │
                    ┌────────────────────┼────────────────────┐
                    │ HTTP REST          │ WebSockets (/live) │
                    ▼                    ▼                    ▼
        ┌────────────────────────────────────────────────────────┐
        │                 CareConnect Express Server             │
        └───────┬────────────────────────┬───────────────────────┬┘
                │                        │                       │
                ▼                        ▼                       ▼
    ┌──────────────────────┐  ┌────────────────────┐  ┌────────────────────┐
    │ gemini-3.1-flash-lite│  │ gemini-3.5-flash   │  │ gemini-3.8-live    │
    │ High-availability,   │  │ Google Maps        │  │ Full-duplex voice  │
    │ structured intake &  │  │ grounding for      │  │ companion over     │
    │ fast chat responses  │  │ hospital locator   │  │ WebSocket stream   │
    └──────────────────────┘  └────────────────────┘  └────────────────────┘
```

### 1. High-Availability Model Cascading
To prevent user disruption during upstream peak demand spikes, CareConnect implements an automatic fallback cascade:
* Primary query evaluates user tier (`gemini-3.1-flash-lite`, `gemini-3.5-flash`, or `gemini-3.8-flash`).
* If a model encounters a transient `503 High Demand` or rate limit error, the service automatically falls back within milliseconds to `gemini-3.1-flash-lite` without failing the user's request.

### 2. Google Maps Grounding (`gemini-3.5-flash`)
* Invokes `gemini-3.5-flash` with `{ googleMaps: {} }` tool.
* Returns verified facility names, drop-off gates, wheelchair accessibility tags, distances, and operating hours for clinics and pharmacies.

### 3. Live Voice WebSocket Gateway (`gemini-3.8-live`)
* Server mounts a WebSocket endpoint at `/live`.
* Establishes a bidirectional session with `gemini-3.8-live` using `Modality.AUDIO` and prebuilt `Zephyr` voice.
* Browser handles 16kHz PCM audio capture and 24kHz PCM playback with an interactive visualizer orb.

---

## 💻 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite 8, Tailwind CSS v4, Motion, Lucide React, Canvas Confetti |
| **Backend** | Node.js, Express 4, WebSocket (`ws`), TypeScript (`tsx`), Dotenv |
| **Database** | Google Cloud Firestore (custom database: `ai-studio-careconnect-52674763-ab36-405b-87d6-b603aa505f51`) |
| **Authentication** | Firebase Authentication (Google Sign-In Popup & Token Validation) |
| **AI & LLM SDK** | `@google/genai` TypeScript SDK (Live API, Flash-Lite, 3.5-Flash, 3.8-Flash) |
| **Security** | Firestore Attribute-Based Access Control (`firestore.rules`), JWT Tokens, Bcrypt |

---

## 🔒 Database & Security (Firebase)

CareConnect uses Firebase for real-time data persistence and authentication.

### Collections Architecture (`firebase-blueprint.json`)
* `/users/{userId}`: Stores user credentials, Google profile photo, display name, and role (`patient`, `volunteer`, `coordinator`, `admin`).
* `/requests/{requestId}`: Stores civic support requests, location coordinates, urgency flags, assigned volunteer IDs, and AI-synthesized summaries.
* `/volunteers/{volunteerId}`: Stores volunteer profiles, contact numbers, cities, covered support categories, and background approval statuses.

### Security Rules (`firestore.rules`)
* Public users can view community support tickets and submit requests.
* Authenticated coordinators and assigned volunteers have permission to update and manage dispatch tickets.
* Personal profile documents in `/users/{userId}` are strictly protected by user ownership checks (`request.auth.uid == userId`).

---

## 🚦 System Workflow

1. **Intake:** A senior or family member submits a request (e.g., *"Need an escort for my 10:00 AM cataract surgery at City Hospital"*).
2. **Maps Grounding:** The user selects *"Find with Google Maps"* to choose the exact outpatient wing and confirm wheelchair accessibility.
3. **AI Synthesis:** Gemini automatically extracts structured logistical requirements into JSON:
   * **Category:** Hospital Companion
   * **Requirement:** Escort patient inside surgical suite and stay in waiting room
   * **Priority:** Normal
   * **Zone:** West Health District #04
4. **Dispatch:** Coordinators review the ticket on the Admin Dashboard, inspect the AI summary, and assign an active volunteer who covers that district.
5. **Fulfillment:** The volunteer receives details, assists the community member, and the ticket is marked *Completed*.

---

## 🚀 Getting Started & Local Development

### Prerequisites
* **Node.js** v20+ or v22+
* **npm** or **bun**
* **Google Gemini API Key** (set in environment)

### Installation
```bash
# 1. Clone repository & install dependencies
npm install

# 2. Configure environment variables (.env)
cp .env.example .env
```

Ensure your `.env` contains:
```env
PORT=3000
GEMINI_API_KEY=your_gemini_api_key_here
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
JWT_SECRET=your_jwt_secret_here
```

### Running the App
```bash
# Run the full-stack development server (Express + Vite)
npm run dev

# Run type-checking & lint
npm run lint

# Build production bundle
npm run build

# Start production server
npm start
```
The application will be running at `http://localhost:3000`.

---

## 🛡️ Safety & Clinical Boundary Policies

CareConnect is committed to strict healthcare safety and liability boundaries:
* ⚠️ **No Medical Diagnosis:** CareConnect AI strictly refuses to diagnose diseases, prescribe medications, or interpret laboratory values.
* 🚑 **Emergency Escalation:** Any detection of acute medical crises (e.g., chest pain, shortness of breath, heavy bleeding) triggers an immediate emergency banner instructing the user to call 911 or local emergency services.
* 📋 **Mandatory Disclaimer:** Every AI response clearly concludes with:
  > *"CareConnect AI provides general platform information and does not diagnose conditions or provide medical treatment."*

---

*CareConnect — Empowering communities, honoring caregivers, and connecting neighbors in need.*
