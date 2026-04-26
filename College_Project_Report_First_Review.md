# PROJECT REPORT
# INDIA TRAVEL PAL — AI-POWERED TRAVEL INTELLIGENCE SYSTEM

---

**Submitted By:** Umang Bharatkumar Trivedi
**Enrollment No.:** *(Your Enrollment Number)*
**Course:** MCA — Master of Computer Applications (Semester III / IV)
**University:** LJ University, Ahmedabad
**Guide Name:** *(Your Guide's Name)*
**Submission Date:** March 2026
**Project Duration:** 3 Months (January 2026 – March 2026)

---

## CERTIFICATE

*This is to certify that the project titled **"India Travel Pal — AI-Powered Travel Intelligence System"** is a bonafide work carried out by **Umang Bharatkumar Trivedi** in partial fulfillment of the requirements for the degree of Master of Computer Applications at LJ University, Ahmedabad.*

*(Guide Signature)* &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; *(HOD Signature)*

---

## DECLARATION

*I hereby declare that the project report entitled "India Travel Pal — AI-Powered Travel Intelligence System" submitted to LJ University is an original work carried out by me under the guidance of my project guide.*

**Umang Bharatkumar Trivedi** | Date: March 2026

---

## ABSTRACT

India Travel Pal is an AI-powered web application designed to simplify domestic travel planning in India. It integrates Google's Gemini 2.5 Flash large language model with a custom-built travel knowledge base containing 40+ verified Indian destinations. The system allows users to interact in natural language (English, Hindi, Gujarati) to receive structured trip plans including day-wise itineraries, transport options (flights, trains, buses), hotel recommendations, local food suggestions, and budget breakdowns.

The platform features a real-time conversational interface, user authentication with role-based access, persistent chat history in MongoDB, and a full-featured Admin Dashboard for managing users, destinations, and monitoring system activity.

**Keywords:** Generative AI, Gemini API, Travel Planning, NLP, FastAPI, React, MongoDB, Admin Dashboard

---

## TABLE OF CONTENTS

1. Introduction
2. Existing System & Its Limitations
3. Need for the New System
4. Objectives of the Proposed System
5. Problem Definition
6. Project Profile
7. System Architecture
8. Technology Stack
9. Module Description
10. Use Case Analysis
11. Database Design & Data Dictionary
12. API Documentation
13. Functional Requirements
14. Non-Functional Requirements
15. Coding Standards
16. Test Cases
17. Screenshots
18. Agile Methodology
19. Sprint Plan & Backlog
20. Earned Value Analysis
21. Future Enhancements
22. Conclusion
23. Bibliography

---

## 1. INTRODUCTION

### 1.1 Background
India is one of the world's most diverse travel destinations with thousands of sites across 28 states. However, planning domestic travel remains fragmented — travelers use IRCTC for trains, MakeMyTrip for flights, RedBus for buses, TripAdvisor for hotels, and Google for local tips — all separately.

### 1.2 Project Idea
India Travel Pal integrates Google Gemini AI with India-specific knowledge to create a single conversational interface handling the entire travel planning lifecycle.

### 1.3 Scope
- **Users:** Domestic travelers in India
- **Coverage:** 40+ major Indian destinations
- **Languages:** English, Hindi, Hinglish
- **Platform:** Responsive Web Application

---

## 2. EXISTING SYSTEM & ITS LIMITATIONS

| Platform | Function | Limitation |
|---|---|---|
| IRCTC | Train booking | Only trains, no planning |
| MakeMyTrip | Flight + hotel | No AI, separate tabs |
| TripAdvisor | Reviews | No itinerary, no budgeting |
| Google Search | Information | Unstructured, no conversation |
| ChatGPT | AI chat | No India-specific KB |

**Key Limitations:**
1. Information fragmentation — 5+ apps needed for one trip
2. No natural language understanding
3. No personalized budget calculation
4. No Hindi/regional language support
5. No integrated transport comparison

---

## 3. NEED FOR THE NEW SYSTEM

| Need | India Travel Pal Solution |
|---|---|
| Unified Platform | Single chat handles all travel queries |
| Natural Language | Plain Hindi/English accepted |
| Budget Planning | AI calculates complete cost breakdown |
| Comparison | Flight + Train + Bus shown together |
| Local Knowledge | 40+ verified destinations with tips |
| Multilingual | EN + Hindi + Hinglish responses |
| Admin Control | Full admin dashboard |

---

## 4. OBJECTIVES

1. Build a Conversational AI Travel Assistant for complex multi-intent queries
2. Provide Structured Travel Output — itinerary, transport, hotels, budget cards
3. Support Multilingual Interaction — English, Hindi, Hinglish
4. Implement Secure JWT-based User Authentication with role-based access
5. Create Comprehensive Admin Dashboard for user and content management
6. Build Travel Knowledge Base with 40+ Indian destinations
7. Persist Chat History in MongoDB for continuity and admin monitoring
8. Design Responsive Premium UI for mobile and desktop

---

## 5. PROBLEM DEFINITION

### 5.1 Problem Statement
No single platform in India provides an integrated travel planning experience that understands natural language, compares transport modes, generates itineraries, and provides budget estimates simultaneously.

### 5.2 Proposed Solution

```
User Input (Natural Language)
        ↓
Language Detection (EN / HI / HI-EN Hinglish)
        ↓
Gemini 2.5 Flash (LLM + Travel Prompt + KB Context)
        ↓
Structured JSON Response
{
  reply, itinerary[], nearby_hotels[],
  flight_options[], train_options[], bus_options[],
  budget_summary, famous_food_items[]
}
        ↓
Rich Frontend UI (Cards, Tables, Chat Bubbles)
        ↓
MongoDB (Chat History Persistence)
```

---

## 6. PROJECT PROFILE

| Attribute | Details |
|---|---|
| **Project Title** | India Travel Pal — AI-Powered Travel Intelligence System |
| **Domain** | Artificial Intelligence / Travel Technology |
| **Frontend** | React.js 18 (TypeScript), Vite, Tailwind CSS, Framer Motion |
| **Backend** | Python 3.11+, FastAPI, Uvicorn |
| **Database** | MongoDB (Motor async driver) |
| **AI Engine** | Google Gemini 2.5 Flash (google-genai SDK) |
| **Auth** | JWT (JSON Web Tokens), bcrypt |
| **Team Size** | 1 (Individual Project) |
| **Developed By** | Umang Bharatkumar Trivedi |
| **University** | LJ University, Ahmedabad |
| **Academic Year** | 2025–2026 |

---

## 7. SYSTEM ARCHITECTURE

### 7.1 Three-Tier Architecture

```
┌─────────────────────────────────────────────────┐
│            PRESENTATION TIER                     │
│  React.js + TypeScript + Tailwind CSS + Vite     │
│  Port: 8080                                      │
│  Pages: Login, Register, Chat, Dashboard,        │
│         Profile, Settings, Admin Panel           │
└────────────────────┬────────────────────────────┘
                     │ HTTP/REST API (JSON)
                     │ JWT Authorization Header
┌────────────────────▼────────────────────────────┐
│             APPLICATION TIER                     │
│       FastAPI (Python) + Uvicorn | Port: 8000    │
│  Routes: Auth, Chat, Trips, Admin                │
│  Services: ChatService, KnowledgeService         │
└────────────────────┬────────────────────────────┘
                     │ Motor (Async MongoDB Driver)
┌────────────────────▼────────────────────────────┐
│                DATA TIER                         │
│  MongoDB | Collections:                          │
│  users, conversations, chat_history,             │
│  trips (destinations), admin_logs                │
└─────────────────────────────────────────────────┘
```

### 7.2 AI Integration

```
User Message → Language Detection → Query Classification
→ Knowledge Base Context Injection
→ Gemini 2.5 Flash API (fallback: 2.0-flash → flash-latest)
→ JSON Parsing → Frontend Rendering
```

---

## 8. TECHNOLOGY STACK

### 8.1 Frontend
| Technology | Purpose |
|---|---|
| React.js 18 (TypeScript) | UI component framework |
| Vite | Build tool & dev server |
| Tailwind CSS | Utility-first styling |
| Framer Motion | Animations & transitions |
| React Router DOM 6 | Client-side routing |
| Lucide React | Icon library |
| Axios | HTTP client |

### 8.2 Backend
| Technology | Purpose |
|---|---|
| Python 3.11+ | Core language |
| FastAPI | REST API framework |
| Uvicorn | ASGI server |
| Motor | Async MongoDB driver |
| PyJWT + bcrypt | Auth tokens + password hashing |
| Pydantic v2 | Data validation |
| google-genai | Google Gemini AI SDK |
| python-dotenv | Environment variables |

### 8.3 Database & Tools
| Tool | Purpose |
|---|---|
| MongoDB 7.x | NoSQL database |
| Git | Version control |
| VS Code | Development IDE |
| Postman | API testing |

---

## 9. MODULE DESCRIPTION

### Module 1: Authentication & Authorization
- User registration with bcrypt password hashing
- JWT login with 24-hour token expiry
- Role-based: `user` → Chat/Dashboard, `admin` → Admin Panel
- Protected routes: `ProtectedRoute`, `AdminRoute` components
- Admin: `admin@indiatravelpal.com` pre-configured

### Module 2: AI Chat Service
- Processes queries via Google Gemini 2.5 Flash
- Language detection: Hindi/Gujarati/English/Hinglish
- Simple vs complex query classification
- Knowledge Base context injection into AI prompt
- Returns 10-field structured JSON response
- Fallback chain: 2.5-flash → 2.0-flash → flash-latest
- User-friendly error messages (no raw errors shown)

### Module 3: Knowledge Base
- 40+ Indian destinations in MongoDB `trips` collection
- Auto-seeded on startup
- Fields: name, state, type, description, highlights, tips, coordinates
- Context builder matches user query to relevant destinations

### Module 4: Chat Interface
- Conversational UI with animated bubbles
- Renders AI response as structured cards:
  - Itinerary (expandable day-wise cards)
  - Hotel recommendations (categorized)
  - Transport comparison (flight/train/bus)
  - Budget breakdown
  - Local food items
- Voice input + text-to-speech
- Persistent sessions with auto-generated titles

### Module 5: Admin Panel (5 tabs)
| Tab | Features |
|---|---|
| Dashboard | Stats, charts, quick actions, system info |
| Travelers | View/Block/Unblock/Delete users |
| Destinations | Add/remove from KB, search, 40+ entries |
| Chat History | All user conversations with messages |
| Activity Logs | 30+ color-coded admin action logs |

### Module 6: User Dashboard & Profile
- Personalized welcome, stats, navigation
- Profile editing, theme toggle, settings

---

## 10. USE CASE ANALYSIS

### Actors: User, Admin, Gemini AI API, MongoDB

### User Use Cases
| UC | Use Case | Status |
|---|---|---|
| UC-01 | Authenticate User | ✅ Implemented |
| UC-02 | Ask Travel Query | ✅ Implemented |
| UC-03 | Search Transport | ✅ Implemented |
| UC-04 | Compare Transport Modes | ✅ Implemented |
| UC-05 | Generate Itinerary | ✅ Implemented |
| UC-06 | Calculate Budget | ✅ Implemented |
| UC-07 | View Hotel Recommendations | ✅ Implemented |
| UC-08 | View Local Commute Options | ✅ Implemented |
| UC-09 | View Travel History | ✅ Implemented |

### Admin Use Cases
| UC | Use Case | Status |
|---|---|---|
| UC-10 | Manage Users | ✅ Implemented |
| UC-11 | Manage Destinations | ✅ Implemented |
| UC-12 | Update Knowledge Base | ✅ Implemented |
| UC-13 | View Audit/Activity Logs | ✅ Implemented |
| UC-14 | View All Chat History | ✅ Implemented |

---

## 11. DATABASE DESIGN & DATA DICTIONARY

### Collections Overview
```
MongoDB: india_travel_pal
├── users
├── conversations
├── chat_history
├── trips (destinations KB)
└── admin_logs
```

### Collection: `users`
| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Primary Key |
| `name` | String | User's full name |
| `email` | String | Login email (Unique, Indexed) |
| `password` | String | bcrypt hashed |
| `role` | String | "user" or "admin" |
| `is_blocked` | Boolean | Default: false |
| `created_at` | String (ISO) | Registration time |

### Collection: `conversations`
| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Conversation ID |
| `user_id` | String | Reference to user |
| `title` | String | Auto-generated title |
| `messages[]` | Array | Message history |
| `messages[].role` | String | "user" or "assistant" |
| `messages[].content` | String | Message text |
| `updated_at` | String | Last message time |

### Collection: `trips` (Knowledge Base)
| Field | Type | Description |
|---|---|---|
| `name` | String | Destination display name |
| `city` | String | City name |
| `state` | String | Indian state |
| `type` | String | Heritage/Beach/Hill Station etc. |
| `description` | String | Detailed overview |
| `highlights` | Array | Key attractions |
| `best_time` | String | Best visit season |
| `entry_fee` | String | Entry charges |
| `tips` | Array | Travel tips |
| `coordinates` | Object {lat,lng} | GPS position |

### Collection: `admin_logs`
| Field | Type | Description |
|---|---|---|
| `admin_id` | String | Admin reference |
| `action` | String | BLOCK_USER, ADD_DESTINATION etc. |
| `target` | String | Affected entity |
| `details` | String | Description |
| `created_at` | String | Timestamp |

---

## 12. API DOCUMENTATION

### Authentication APIs

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/v1/auth/login` | User login → JWT | No |
| POST | `/api/v1/auth/register` | Register new user | No |
| GET | `/api/v1/auth/me` | Get current user | JWT |

**Login Response:**
```json
{
  "access_token": "eyJhbGci...",
  "token_type": "bearer",
  "user": { "id": "...", "name": "Umang", "role": "user" }
}
```

### Chat API

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/chat` | Send message → AI response | JWT |
| GET | `/api/conversations` | Chat history | JWT |

**Chat Request:**
```json
{
  "message": "Plan 3-day Goa trip budget Rs.10000",
  "conversation_id": "uuid",
  "history": []
}
```

**Chat Response (10 fields):**
```json
{
  "reply": "Namaste! Here's your Goa plan...",
  "lang": "en",
  "route_summary": {"origin": "Ahmedabad", "destination": "Goa"},
  "itinerary": [{"day": 1, "title": "Beach Day", "activities": [...]}],
  "nearby_hotels": [{"hotel_name": "...", "price_per_night": "Rs.800"}],
  "famous_food_items": ["Fish Curry", "Bebinca"],
  "budget_summary": {"total_estimated": "Rs.9500", "breakdown": {...}},
  "flight_options": [{"airline": "IndiGo", "price_range": "Rs.2500"}],
  "train_options": [],
  "bus_options": []
}
```

### Admin APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/stats` | Dashboard stats |
| GET | `/api/admin/users` | All users |
| PATCH | `/api/admin/users/{id}/block` | Block user |
| DELETE | `/api/admin/users/{id}` | Delete user |
| GET | `/api/admin/logs` | Activity logs |
| GET | `/api/admin/chat-history` | All chats |

---

## 13. FUNCTIONAL REQUIREMENTS

| ID | Requirement | Priority |
|---|---|---|
| FR-01 | User registration with email/password | High |
| FR-02 | JWT authentication + role-based routing | High |
| FR-03 | AI processes natural language travel queries | High |
| FR-04 | Auto language detection (EN/HI/GU) | High |
| FR-05 | Structured JSON response with 10 fields | High |
| FR-06 | Conversation context (last 6 messages) | Medium |
| FR-07 | Chat history saved to MongoDB | High |
| FR-08 | Admin can view/block/delete users | High |
| FR-09 | Admin can manage 40+ destinations | High |
| FR-10 | Activity logs for all admin actions | Medium |
| FR-11 | Fallback AI models on quota error | High |

---

## 14. NON-FUNCTIONAL REQUIREMENTS

| ID | Requirement | Target |
|---|---|---|
| NFR-01 | Performance — AI response time | < 5 seconds |
| NFR-02 | Security — Password storage | bcrypt hashed |
| NFR-03 | Security — API auth | JWT 24h expiry |
| NFR-04 | Responsiveness | 320px to 1920px |
| NFR-05 | Error Handling | User-friendly messages only |
| NFR-06 | Scalability | 40+ destinations, easily extended |
| NFR-07 | Maintainability | Service-Controller pattern |

---

## 15. CODING STANDARDS

**Backend (Python):**
- `snake_case` — variables/functions; `PascalCase` — classes
- Service-Controller pattern: route → controller → service → DB
- Async/await for all DB operations
- Secrets in `.env` (never in code)

**Frontend (TypeScript):**
- `camelCase` — variables; `PascalCase` — components
- TypeScript interfaces for all API responses
- Tailwind CSS for styling; no ad-hoc inline styles

**API Design:**
- RESTful noun-based endpoints
- Standard JSON response: `{ "success": true, "data": {...} }`
- CORS restricted to frontend origin

---

## 16. TEST CASES

### Authentication
| TC | Test | Input | Expected | Status |
|---|---|---|---|---|
| TC-01 | Valid login | Correct credentials | JWT + redirect | ✅ PASS |
| TC-02 | Invalid password | Wrong password | Error message | ✅ PASS |
| TC-03 | Admin login | admin@indiatravelpal.com | Redirect to /admin | ✅ PASS |
| TC-04 | Duplicate register | Existing email | "Already registered" | ✅ PASS |
| TC-05 | Unauthorized route | No JWT | Redirect to /login | ✅ PASS |

### AI Chat
| TC | Test | Input | Expected | Status |
|---|---|---|---|---|
| TC-06 | Greeting | "Hello" | Warm greeting, no cards | ✅ PASS |
| TC-07 | Trip planning | "Jaipur 2 days Rs 5000" | Itinerary + Hotels + Budget | ✅ PASS |
| TC-08 | Hindi query | "गोवा के बारे में बताओ" | Hindi response | ✅ PASS |
| TC-09 | Transport | "Train Ahmedabad to Mumbai" | Train options card | ✅ PASS |
| TC-10 | Off-topic | "What is 2+2?" | Redirect to travel | ✅ PASS |
| TC-11 | API error | Quota exceeded | Friendly message | ✅ PASS |

### Admin
| TC | Test | Expected | Status |
|---|---|---|---|
| TC-12 | View users | All users listed | ✅ PASS |
| TC-13 | Block user | User blocked, log created | ✅ PASS |
| TC-14 | View destinations | 40+ shown | ✅ PASS |
| TC-15 | View activity logs | 30+ color-coded entries | ✅ PASS |

---

## 17. SCREENSHOTS

*(Insert actual screenshots in Word document / Printed copy)*

| S# | Screenshot Description |
|---|---|
| S-01 | Login Page — Dark premium theme |
| S-02 | Registration Page — Form validation |
| S-03 | Chat Interface — Conversational bubbles |
| S-04 | AI Itinerary Cards — Day-wise collapsible |
| S-05 | Hotel Recommendation Cards |
| S-06 | Transport Comparison — Flights/Trains/Buses |
| S-07 | Budget Breakdown Cards |
| S-08 | Admin Dashboard — Stats & Charts |
| S-09 | Admin Travelers Tab — User management |
| S-10 | Admin Destinations Tab — 40+ destinations |
| S-11 | Admin Chat History — User conversations |
| S-12 | Admin Activity Logs — Color-coded timeline |

---

## 18. AGILE METHODOLOGY

This project used **Agile Scrum** with 2-week sprints.

### User Stories
| US | As a... | I want to... |
|---|---|---|
| US-01 | Traveler | Type query in plain language |
| US-02 | Student | See budget breakdown |
| US-03 | Tourist | Get day-wise auto plan |
| US-04 | Hindi speaker | Chat in Hindi |
| US-05 | Admin | Monitor user conversations |
| US-06 | Admin | Block abusive users |

---

## 19. SPRINT PLAN

| Sprint | Duration | Deliverables |
|---|---|---|
| Sprint 1 | Week 1-2 | Auth, project setup, MongoDB, Gemini API base |
| Sprint 2 | Week 3-4 | AI prompt design, KB seeding, itinerary cards |
| Sprint 3 | Week 5-6 | Hotel/transport/budget cards, Hindi support |
| Sprint 4 | Week 7-8 | Admin panel (users, destinations, logs) |
| Sprint 5 | Week 9-10 | 40 destinations, error handling, mobile UI |
| Sprint 6 | Week 11-12 | Testing, documentation, final polish |

---

## 20. EARNED VALUE ANALYSIS

| Metric | Sp1 | Sp2 | Sp3 | Sp4 | Sp5 | Sp6 |
|---|---|---|---|---|---|---|
| Planned Value (PV) | 17% | 33% | 50% | 67% | 83% | 100% |
| Earned Value (EV) | 17% | 33% | 49% | 68% | 85% | 100% |
| Status | On Track | On Track | -1% | +1% | +2% | ✅ |

**Result: Project completed on time within 12 weeks.**

---

## 21. FUTURE ENHANCEMENTS

1. **Live APIs** — Amadeus / IRCTC for real-time prices
2. **Map Integration** — Google Maps for visual itinerary
3. **Booking Links** — Direct redirect to IRCTC/MakeMyTrip
4. **Mobile App** — React Native for Android/iOS
5. **More Languages** — Tamil, Telugu, Gujarati, Marathi
6. **Trip Sharing** — Save and share plans as PDF
7. **Budget Rules Admin** — Admin-configurable budget caps
8. **Comparison Dashboard** — Side-by-side destination comparison

---

## 22. CONCLUSION

**India Travel Pal** successfully demonstrates the application of Generative AI to real-world travel planning. By combining Google Gemini 2.5 Flash with a curated knowledge base of 40+ Indian destinations and a premium full-stack interface, the system delivers a comprehensive one-stop travel planning experience.

**Achievements:**
- ✅ Natural language travel queries in English/Hindi/Hinglish
- ✅ Structured output with itinerary, transport, hotels, and budget
- ✅ Secure JWT authentication with role-based access
- ✅ Complete Admin Dashboard with monitoring
- ✅ Persistent chat history with context continuity
- ✅ Robust AI error handling with graceful fallback

The project follows industry best practices (Agile, RESTful APIs, JWT security, responsive UI), making it a production-quality application ready for real-world deployment.

---

## 23. BIBLIOGRAPHY

1. React Documentation — https://react.dev/
2. FastAPI Documentation — https://fastapi.tiangolo.com/
3. Google Gemini AI Documentation — https://ai.google.dev/
4. MongoDB Documentation — https://www.mongodb.com/docs/
5. Motor Async Driver — https://motor.readthedocs.io/
6. Tailwind CSS — https://tailwindcss.com/docs
7. Framer Motion — https://www.framer.com/motion/
8. JWT Introduction — https://jwt.io/introduction
9. Pydantic Documentation — https://docs.pydantic.dev/
10. India Tourism — https://tourism.gov.in/
11. Vite Documentation — https://vitejs.dev/

---

*End of Project Report*

**Umang Bharatkumar Trivedi | MCA — LJ University | March 2026**
   


   API Key change prompt for responce change hota haii uske liiye ....
   
   Maine aapke liye ek "Consistency-Locked Master Prompt" taiyar kiya hai. Ye prompt is tarike se likha gaya hai ki agar aap future mein Gemini badal kar koi aur model (jaise OpenAI ya Anthropic) bhi use karein, toh agent ka vyavhar (behavior), tone aur flow bilkul vahi rahega.

Maine aapke backend/app/services/prompts.py file ko is naye strict framework ke sath update kar diya hai.

Prompt mein naye features:
State Memory: Agent ab hamesha yaad rakhega ki vo kaunse step par hai. Agar user beech mein khane ke bare mein puche, toh agent jawab dekar wapas transport par le aayega.
No Generic Questions: "What next?" bolna ban hai. Agent hamesha specific command dega (e.g., "Ab stay ke liye hotels check karein").
Strict Hinglish: Voice compatibility ke liye language ko aur natural banaya gaya hai.
Zero-Mix Rule: Agar user ne sirf hotels pucha hai, toh agent faltu mein flights ki details nahi dega.
Aap niche naya code dekh sakte hain jo maine update kiya hai:

python
# backend/app/services/prompts.py mein updated prompt:
MASTER_TRAVEL_PAL_PROMPT = """
You are the "Production-Grade AI Travel Agent" for India Travel Pal. 
Consistency is your #1 priority. Your behavior must remain stable across different API/Model changes.
🎯 PRIMARY MISSION:
Provide structured, step-by-step travel guidance using 99% realistic Indian travel data.
━━━━━━━━━━━━━━━━━━━━━━━
1. 📊 FIXED FLOW (STRICT ORDER)
━━━━━━━━━━━━━━━━━━━━━━━
When planning a full trip, ALWAYS follow this sequence:
Step 1: Budget Selection (Low / Mid / High)
Step 2: Travel / Transport (Flight / Train / Bus)
Step 3: Stays (Hotels / Homestays)
Step 4: Food (Local Cuisines / Restaurants)
Step 5: Final Itinerary (Day-wise schedule)
❌ NEVER skip steps. ❌ NEVER change the order.
━━━━━━━━━━━━━━━━━━━━━━━
2. 🧠 STATE & INTERRUPTION AWARENESS
━━━━━━━━━━━━━━━━━━━━━━━
- If the user asks for something out of order (e.g., asking for Food during Step 2):
  1. Answer the specific query immediately.
  2. Provide a transition sentence to resume the flow.
  3. Re-state the pending Step.
  Example: "Ye rahe Dwarka ke famous khale... Ab chaliye, hum transport options nikalte hain. Aap kahan se travel start karenge?"
━━━━━━━━━━━━━━━━━━━━━━━
3. 🗣️ RESPONSE STYLE & VOICE (HINGLISH)
━━━━━━━━━━━━━━━━━━━━━━━
- FORMAT: [Direct Answer] -> [Quick Recommendations] -> [Specific Next Step Call-to-Action]
- TONE: Professional but friendly Hinglish (e.g., "Namaste! Aapka budget ₹15,000 kaafi sahi hai.")
- ❌ NEVER say: "What next?" or "How can I help?".
- ✅ ALWAYS say: "Next step ke liye, please [next action] select karein."
━━━━━━━━━━━━━━━━━━━━━━━
4. ⚙️ DATA INTEGRITY (NO PLACEHOLDERS)
━━━━━━━━━━━━━━━━━━━━━━━
- YOU MUST INVENT REALISTIC DATA. 
- ❌ NO "TBA", NO "Schedule Pending", NO "Check website".
- ✅ Provide exact prices in ₹, Train numbers (e.g., 12267), Hotel names, and realistic timing.
━━━━━━━━━━━━━━━━━━━━━━━
5. 🔒 INTENT LOCK (ONLY RESPOND TO IMMEDIATE NEED)
━━━━━━━━━━━━━━━━━━━━━━━
- User asks for Hotels -> RETURN ONLY JSON for 'nearby_hotels' and 'reply'.
- User asks for Food -> RETURN ONLY JSON for 'nearby_food' and 'reply'.
- DO NOT clutter the response with empty data for other categories.
"""
Maine ye saare rules aapke backend code mein prompts.py file ke andar integrate kar diye hain. Ab aapka AI Agent kisi bhi model par ho, vo hamesha stable aur professional behave karega!