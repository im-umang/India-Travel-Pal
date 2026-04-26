# PROJECT REPORT
# INDIA TRAVEL PAL — AI-POWERED TRAVEL INTELLIGENCE SYSTEM

---

**Submitted By:** Umang Bharatkumar Trivedi  
**Enrollment No.:** [Your Enrollment Number]  
**Course:** MCA — Master of Computer Applications (Semester IV)  
**University:** LJ University, Ahmedabad  
**Guide Name:** [Your Guide's Name]  
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

India Travel Pal is an AI-powered web application designed to simplify domestic travel planning in India. It integrates Google's Gemini Generative AI model with a custom-built travel knowledge base containing 40+ verified Indian destinations. The system allows users to interact in natural language (English, Hindi) to receive structured trip plans including day-wise itineraries, transport options (flights, trains, buses), hotel recommendations, local food suggestions, and budget breakdowns.

The platform features a real-time conversational interface, user authentication with role-based access, persistent chat history in MongoDB, and a full-featured Admin Dashboard for managing users, destinations, and monitoring system activity.

**Keywords:** Generative AI, Gemini API, Travel Planning, NLP, FastAPI, React, MongoDB, Admin Dashboard, Voice Interface

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

---

## 2. EXISTING SYSTEM & ITS LIMITATIONS

| Platform | Function | Limitation |
|---|---|---|
| IRCTC | Train booking | Only trains, no planning |
| MakeMyTrip | Flight + hotel | No AI, separate tabs |
| TripAdvisor | Reviews | No itinerary, no budgeting |
| Google Search | Information | Unstructured, no conversation |

**Key Limitations:**
1. Information fragmentation — 5+ apps needed for one trip.
2. No natural language understanding.
3. No integrated transport comparison.

---

## 5. PROBLEM DEFINITION

### 5.1 Problem Statement
No single platform in India provides an integrated travel planning experience that understands natural language, compares transport modes, generates itineraries, and provides budget estimates simultaneously.

### 5.2 Proposed Solution

```
User Input (Natural Language / Voice)
        ↓
Gemini 2.5 Flash / 2.0 Flash (LLM + Context)
        ↓
Structured JSON Response
        ↓
Rich Frontend UI (Cards, Tables, Chat Bubbles)
        ↓
Voice Sync (Neural TTS + Highlighting + Auto-scroll)
```

---

## 11. DATABASE DESIGN & DATA DICTIONARY

### Collection: `users`
| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Primary Key |
| `name` | String | User's full name |
| `email` | String | Login email (Unique) |
| `password` | String | bcrypt hashed |
| `role` | String | "user" or "admin" |
| `is_blocked` | Boolean | Default: false |

### Collection: `conversations`
| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Conversation ID |
| `user_id` | String | Reference to user |
| `title` | String | Auto-generated title |
| `messages[]` | Array | Chat message history |

### Collection: `trips` (Knowledge Base)
Contains destination name, state, city, type, description, highlights, best time, and local tips for over 40 Indian locations.

---

## 16. TEST CASES

### Authentication
| TC ID | Test Case | Expected | Status |
|---|---|---|---|
| TC-01 | Valid Login | JWT issued + Redirect | ✅ PASS |
| TC-02 | Invalid Pass | "Invalid credentials" | ✅ PASS |
| TC-03 | Blocked User| Login rejected | ✅ PASS |

### AI Chat
| TC ID | Test Case | Expected | Status |
|---|---|---|---|
| TC-04 | Trip Query | Itinerary + Cards | ✅ PASS |
| FT-05 | Voice Sync | Highlight + Scroll | ✅ PASS |
| FT-06 | Hindi Mode | Pure Hindi Reply | ✅ PASS |

---

## 22. CONCLUSION

**India Travel Pal** successfully demonstrates the application of Generative AI to real-world travel planning. By combining Google Gemini with a curated knowledge base and a premium voice-enabled interface, the system delivers a comprehensive one-stop travel planning experience.

---

## 23. BIBLIOGRAPHY
1. React Documentation — https://react.dev/
2. FastAPI Documentation — https://fastapi.tiangolo.com/
3. Google Gemini AI Documentation — https://ai.google.dev/
4. MongoDB Documentation — https://www.mongodb.com/docs/

---

**Developed for:** LJ University MCA Final Year  
**Submission Date:** March 2026  
**Status:** Completed & Optimized  
