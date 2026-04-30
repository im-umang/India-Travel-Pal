
## 4.5 AGILE RELEASE PLAN

Project: India Travel Pal — AI-Powered Travel Intelligence System
Total Duration: 12 Weeks | 6 Sprints | Jan 6, 2026 — Mar 30, 2026
Release Strategy: Incremental delivery — each sprint produces a working, testable increment.

---

RELEASE 1 — MVP Core (End of Sprint 2 — Feb 2, 2026)

Release Name: MVP Alpha
Features Included:
- User registration and login with JWT authentication
- Role-based routing (user vs admin)
- Basic AI chat interface connected to Google Gemini 2.5 Flash
- Language detection (English / Hindi / Hinglish)
- Simple text reply from AI (no structured cards yet)
- Chat conversation saved to MongoDB
- Knowledge base with 20 destinations seeded
- 3-model AI fallback chain operational

Testing Required: Auth APIs, basic chat flow, DB persistence
Audience: Developer self-testing only
Deployment: Local (localhost:8000 backend, localhost:8080 frontend)

---

RELEASE 2 — Feature Complete UI (End of Sprint 3 — Feb 16, 2026)

Release Name: Beta v1.0
Features Included:
- All Sprint 1 + Sprint 2 features
- ItineraryCard, HotelCard, TransportCard, BudgetCard, FoodCard components
- Cards conditionally rendered from AI JSON fields
- Chat sidebar with conversation history list
- Auto-generated conversation titles
- AI thinking/loading animation
- Structured 10-field JSON response fully parsed and displayed

Testing Required: Card rendering, conditional display, chat history UI
Audience: Developer + Academic Guide demo
Deployment: Local environment

---

RELEASE 3 — Admin Panel Complete (End of Sprint 4 — Mar 2, 2026)

Release Name: Beta v2.0
Features Included:
- All previous release features
- Admin Panel with 5 tabs: Dashboard, Travelers, Destinations, Chat History, Activity Logs
- User block/unblock/delete with admin action logging
- Destination add/remove from knowledge base via admin UI
- All admin API endpoints complete
- Admin route guard in React

Testing Required: Admin CRUD operations, action logging, role-based access
Audience: Developer + Academic Guide
Deployment: Local environment

---

RELEASE 4 — Final Complete Release (End of Sprint 6 — Mar 30, 2026)

Release Name: v1.0 Final (Submission Build)
Features Included:
- All previous release features
- Knowledge base expanded to 40+ destinations
- Voice input (speech-to-text) in chat
- Text-to-speech AI response reading
- Mobile responsive design across all pages
- Theme toggle (dark/light mode)
- User profile page with editable details
- All bugs from testing resolved
- Complete test suite executed (97.9% pass rate)
- Project report finalized

Testing Required: Full regression testing, UAT with 5 users, browser compatibility
Audience: University Guide, Examiner, College Viva Panel
Deployment: Local demo environment / cloud if required

---

Release Summary Table (Plain Text):

Release 1 — MVP Alpha — End Sprint 2 — Feb 2, 2026 — Auth + Basic AI Chat — Local Dev
Release 2 — Beta v1.0 — End Sprint 3 — Feb 16, 2026 — Full UI Cards — Local Dev + Guide Demo
Release 3 — Beta v2.0 — End Sprint 4 — Mar 2, 2026 — Admin Panel Complete — Local Dev
Release 4 — v1.0 Final — End Sprint 6 — Mar 30, 2026 — Complete System — Submission Build

---

## 4.6 AGILE SPRINT BACKLOG

The Sprint Backlog lists all tasks planned for each sprint with estimated hours, assigned developer, and completion status.

Developer: Umang Bharatkumar Trivedi (all tasks)
Estimation Unit: Hours

---

SPRINT 1 BACKLOG — Project Foundation (Jan 6 — Jan 19)

Task 1: Initialize React + Vite + TypeScript frontend project — 2 hrs — Done
Task 2: Initialize FastAPI backend project with folder structure — 2 hrs — Done
Task 3: Set up MongoDB Atlas connection with Motor async driver — 3 hrs — Done
Task 4: Create Pydantic schemas for User model — 2 hrs — Done
Task 5: Implement bcrypt password hashing utility — 2 hrs — Done
Task 6: Build POST /api/v1/auth/register endpoint — 3 hrs — Done
Task 7: Build POST /api/v1/auth/login endpoint with JWT generation — 3 hrs — Done
Task 8: Build GET /api/v1/auth/me protected endpoint — 2 hrs — Done
Task 9: Create JWT validation middleware (FastAPI dependency) — 3 hrs — Done
Task 10: Build Login page in React with form and validation — 4 hrs — Done
Task 11: Build Register page in React with form and validation — 3 hrs — Done
Task 12: Implement AuthContext (global user/token state) — 3 hrs — Done
Task 13: Build ProtectedRoute and AdminRoute components — 2 hrs — Done
Task 14: Set up React Router with all routes — 2 hrs — Done
Task 15: Configure CORS in FastAPI for frontend origin — 1 hr — Done
Task 16: Create .env for backend secrets — 1 hr — Done

Sprint 1 Total: 38 hours estimated | 38 hours actual | Status: Completed

---

SPRINT 2 BACKLOG — AI Chat Engine (Jan 20 — Feb 2)

Task 1: Install and configure google-genai SDK in backend — 2 hrs — Done
Task 2: Design main travel system prompt for Gemini — 5 hrs — Done
Task 3: Implement language detection logic (EN/HI/GU/Hinglish) — 3 hrs — Done
Task 4: Build ChatService class with Gemini API call — 4 hrs — Done
Task 5: Implement 10-field JSON response parsing with fallback — 4 hrs — Done
Task 6: Implement 3-model fallback chain (quota error handling) — 3 hrs — Done
Task 7: Build POST /api/chat endpoint — 3 hrs — Done
Task 8: Build GET /api/conversations endpoint — 2 hrs — Done
Task 9: Create MongoDB trips collection seed data (20 destinations) — 4 hrs — Done
Task 10: Build KnowledgeService context builder (top 3 destination match) — 4 hrs — Done
Task 11: Build basic ChatInterface.tsx component — 5 hrs — Done
Task 12: Build MessageBubble.tsx (user and AI bubbles) — 3 hrs — Done
Task 13: Connect frontend chat to backend API via Axios — 3 hrs — Done
Task 14: Save conversation to MongoDB after each exchange — 2 hrs — Done
Task 15: Add user-friendly error messages on API failures — 2 hrs — Done

Sprint 2 Total: 49 hours estimated | 51 hours actual | Status: Completed (1 day delay)

---

SPRINT 3 BACKLOG — Rich UI Cards (Feb 3 — Feb 16)

Task 1: Design data interfaces (TypeScript) for all 10 AI response fields — 3 hrs — Done
Task 2: Build ItineraryCard.tsx component (day-wise accordion) — 5 hrs — Done
Task 3: Build HotelCard.tsx (Budget/Mid-Range/Luxury columns) — 4 hrs — Done
Task 4: Build TransportCard.tsx (Flight/Train/Bus tabs) — 5 hrs — Done
Task 5: Build BudgetCard.tsx (total + itemized breakdown) — 4 hrs — Done
Task 6: Build FoodCard.tsx (local food pill tags) — 2 hrs — Done
Task 7: Conditional card rendering based on AI JSON fields — 3 hrs — Done
Task 8: Build chat sidebar with conversation list — 4 hrs — Done
Task 9: Implement new chat button and conversation switching — 3 hrs — Done
Task 10: Auto-generate conversation title from first user message — 2 hrs — Done
Task 11: Add thinking/loading animation (animated dots) — 2 hrs — Done
Task 12: Style all cards with dark glassmorphism theme — 4 hrs — Done
Task 13: Add Framer Motion animations to card entry — 3 hrs — Done

Sprint 3 Total: 44 hours estimated | 44 hours actual | Status: Completed

---

SPRINT 4 BACKLOG — Admin Panel (Feb 17 — Mar 2)

Task 1: Build AdminPanel.tsx with 5-tab navigation structure — 4 hrs — Done
Task 2: Dashboard Tab: stats grid layout — 4 hrs — Done
Task 3: Dashboard Tab: recent activity list — 2 hrs — Done
Task 4: Build GET /api/admin/stats endpoint — 2 hrs — Done
Task 5: Travelers Tab: user data table with search — 5 hrs — Done
Task 6: Build PATCH /api/admin/users/{id}/block endpoint — 2 hrs — Done
Task 7: Build DELETE /api/admin/users/{id} endpoint — 2 hrs — Done
Task 8: Block/Unblock/Delete buttons with confirmation modal — 4 hrs — Done
Task 9: Destinations Tab: destination card grid — 4 hrs — Done
Task 10: Add Destination modal form — 4 hrs — Done
Task 11: Build POST /api/admin/destinations endpoint — 2 hrs — Done
Task 12: Build DELETE /api/admin/destinations/{id} endpoint — 2 hrs — Done
Task 13: Chat History Tab: accordion of user conversations — 4 hrs — Done
Task 14: Build GET /api/admin/chat-history endpoint — 2 hrs — Done
Task 15: Activity Logs Tab: color-coded log timeline — 5 hrs — Done
Task 16: Admin action logging on all admin operations — 3 hrs — Done
Task 17: Admin role guard (FastAPI + React) — 2 hrs — Done

Sprint 4 Total: 53 hours estimated | 57 hours actual | Status: Completed (2 day delay)

---

SPRINT 5 BACKLOG — Content Expansion and Robustness (Mar 3 — Mar 16)

Task 1: Add 20 more destinations to KB (total 40+) — 5 hrs — Done
Task 2: Cover additional states: TN, Karnataka, UP, Gujarat — 3 hrs — Done
Task 3: Integrate Web Speech API for voice input — 5 hrs — Done
Task 4: Implement Text-to-Speech for AI response reading — 4 hrs — Done
Task 5: Add microphone button to chat input bar — 2 hrs — Done
Task 6: Mobile responsive layout — chat sidebar drawer — 5 hrs — Done
Task 7: Mobile responsive — card stack layout — 3 hrs — Done
Task 8: Build User Profile page — 4 hrs — Done
Task 9: Implement theme toggle (dark/light) — 3 hrs — Done
Task 10: Settings page structure — 2 hrs — Done
Task 11: Blocked user login prevention (backend check) — 2 hrs — Done
Task 12: Final CORS configuration for all environments — 1 hr — Done
Task 13: Error boundary component for React crashes — 2 hrs — Done

Sprint 5 Total: 41 hours estimated | 41 hours actual | Status: Completed

---

SPRINT 6 BACKLOG — Testing and Documentation (Mar 17 — Mar 30)

Task 1: Write and execute 28 functional test cases — 8 hrs — Done
Task 2: Write and execute 8 integration test cases — 4 hrs — Done
Task 3: Security testing (10 checks) — 4 hrs — Done
Task 4: Performance testing (response times) — 3 hrs — Done
Task 5: Browser compatibility testing (6 browsers) — 3 hrs — Done
Task 6: UAT with 5 users — 4 hrs — Done
Task 7: Fix bugs identified in testing — 5 hrs — Done
Task 8: Write project report (all chapters) — 10 hrs — Done
Task 9: Write Agile document — 5 hrs — Done
Task 10: Code cleanup and final comments — 3 hrs — Done
Task 11: GitHub final commit and README update — 2 hrs — Done
Task 12: Final demo preparation — 3 hrs — Done

Sprint 6 Total: 54 hours estimated | 54 hours actual | Status: Completed

---

Overall Project Stats:
Total Estimated Hours: 279 hours
Total Actual Hours: 285 hours
Variance: +6 hours (+2.2%) — within acceptable range
All 6 sprints completed | 97.9% test pass rate

---

## 4.7 AGILE TEST PLAN

Project: India Travel Pal
Test Approach: Sprint-end testing after each sprint delivery
Test Manager: Umang Bharatkumar Trivedi
Test Environment: Local development (localhost) + Chrome/Firefox browsers
Test Tools: Postman (API testing), Browser DevTools (performance), Manual testing

---

TEST OBJECTIVES:

1. Verify all 25 functional requirements are correctly implemented
2. Validate AI response structure (10-field JSON) for multiple query types
3. Ensure JWT authentication and role-based access works correctly
4. Verify all admin panel operations (block, delete, add, log)
5. Test system behavior under error conditions (API quota, invalid input, DB failure)
6. Validate mobile responsiveness across device sizes
7. Check cross-browser compatibility
8. Measure and document performance metrics

---

TEST TYPES AND SCHEDULE:

Sprint 1 Testing (End of Week 2):
- Test authentication APIs via Postman (register, login, /me)
- Test JWT token validation on protected routes
- Test role-based redirect (user vs admin)
- Test invalid login, duplicate registration edge cases

Sprint 2 Testing (End of Week 4):
- Test AI chat API with English, Hindi, Hinglish queries
- Verify structured JSON response parsing
- Test fallback model chain (simulate quota error)
- Verify chat saved to MongoDB after each message
- Test knowledge base context injection

Sprint 3 Testing (End of Week 6):
- Verify all 5 card types render correctly
- Test conditional card rendering (cards appear only with relevant data)
- Test conversation switching and history loading
- Test auto-title generation
- UI visual check across desktop widths

Sprint 4 Testing (End of Week 8):
- Test all admin APIs via Postman
- Verify block/unblock/delete operations in DB
- Verify action logs created correctly
- Test admin route guard (regular user cannot access /admin)
- Test destination add/remove operations

Sprint 5 Testing (End of Week 10):
- Test voice input on Chrome and Firefox
- Test TTS output functionality
- Mobile responsive testing (320px, 375px, 768px, 1024px, 1440px)
- Test all 40+ destinations appear in admin destinations tab
- Test blocked user login rejection

Sprint 6 Testing (End of Week 12):
- Full regression test: all 28 functional test cases
- Integration test: 8 integration points
- Security test: 10 checks
- Performance test: response times under load
- Browser compatibility: Chrome, Firefox, Edge, Safari
- UAT: 5 representative users
- Final test summary report

---

TEST ENTRY CRITERIA (When testing can start):
- Sprint deliverables are code-complete
- Backend server running without startup errors
- Frontend builds and loads in browser without errors
- API base URL configured correctly in frontend

TEST EXIT CRITERIA (When testing is complete):
- All planned test cases executed
- All High-priority bugs resolved
- Medium/Low bugs documented for next sprint or future enhancement
- Test summary documented with pass/fail counts

---

BUG SEVERITY LEVELS:

Critical: System crashes or core feature completely broken — Fix immediately in current sprint
High: Feature broken for most users but workaround exists — Fix before sprint end
Medium: Feature partially works or minor UI issue — Fix in next sprint if time allows
Low: Cosmetic issue or minor UX problem — Document for future release

---

TEST CASE TEMPLATE USED:

TC ID: unique identifier (e.g. FT-01)
Test Case Title: short description
Precondition: what must be true before test starts
Test Input: data entered / actions performed
Expected Output: what should happen
Actual Output: what actually happened
Status: Pass / Fail / Partial
Severity if Fail: Critical / High / Medium / Low

---

TEST SUMMARY RESULTS (Sprint 6 Final):

Total test cases executed: 94
Passed: 92
Failed: 1 (brute force login — no lockout, documented)
Partial: 1 (Safari voice input — browser limitation)
Overall Pass Rate: 97.9%
Critical Issues Found and Fixed: 0
High Issues Found and Fixed: 3
Medium Issues Documented: 2
Project Status: READY FOR SUBMISSION

---

## 4.8 BURN DOWN CHART AND BURN UP CHART

Definition:
Burn Down Chart: Shows how much work remains (Story Points) across sprints. Ideal line goes from total points to zero.
Burn Up Chart: Shows how much work is completed vs total scope over time. Ideal line rises from zero to total points.

---

TOTAL PROJECT STORY POINTS: 80 points

Story Point Distribution across Sprints:

Sprint 1 — 16 points (Auth + Setup)
Sprint 2 — 16 points (AI Engine + KB + Basic Chat)
Sprint 3 — 14 points (Rich UI Cards)
Sprint 4 — 16 points (Admin Panel)
Sprint 5 — 10 points (Expansion + Robustness)
Sprint 6 — 8 points (Testing + Documentation)

---

BURN DOWN CHART DATA

(Remaining Story Points after each Sprint)

Start of Project: 80 points remaining (ideal: 80)

After Sprint 1: Planned remaining = 64 | Actual remaining = 64 | Variance = 0
After Sprint 2: Planned remaining = 48 | Actual remaining = 50 | Variance = +2 (slight delay in JSON parsing)
After Sprint 3: Planned remaining = 34 | Actual remaining = 34 | Variance = 0
After Sprint 4: Planned remaining = 18 | Actual remaining = 20 | Variance = +2 (activity log delay)
After Sprint 5: Planned remaining = 8  | Actual remaining = 8  | Variance = 0
After Sprint 6: Planned remaining = 0  | Actual remaining = 0  | Variance = 0 — PROJECT COMPLETE

Burn Down Chart (Text Representation):

Sprint     | Ideal (Remaining) | Actual (Remaining) | Status
Start      |        80         |        80          | On Track
Sprint 1   |        64         |        64          | On Track
Sprint 2   |        48         |        50          | Slightly Behind
Sprint 3   |        34         |        34          | Back On Track
Sprint 4   |        18         |        20          | Slightly Behind
Sprint 5   |        8          |        8           | On Track
Sprint 6   |        0          |        0           | Completed

---

BURN UP CHART DATA

(Completed Story Points after each Sprint)

After Sprint 1: Planned completed = 16 | Actual completed = 16
After Sprint 2: Planned completed = 32 | Actual completed = 30 (2 pts carried to Sprint 3 start)
After Sprint 3: Planned completed = 46 | Actual completed = 46
After Sprint 4: Planned completed = 62 | Actual completed = 60 (2 pts completed early Sprint 5)
After Sprint 5: Planned completed = 72 | Actual completed = 72
After Sprint 6: Planned completed = 80 | Actual completed = 80 — ALL DONE

Burn Up Chart (Text Representation):

Sprint     | Total Scope | Planned Completed | Actual Completed | Status
Start      |     80      |         0         |        0         | —
Sprint 1   |     80      |        16         |       16         | On Track
Sprint 2   |     80      |        32         |       30         | Slightly Below
Sprint 3   |     80      |        46         |       46         | Back On Track
Sprint 4   |     80      |        62         |       60         | Slightly Below
Sprint 5   |     80      |        72         |       72         | On Track
Sprint 6   |     80      |        80         |       80         | Completed

---

KEY OBSERVATIONS FROM CHARTS:

1. Sprint 2 had a 2-point deficit due to JSON parsing complexity in Gemini response handling. This was recovered by Sprint 3.

2. Sprint 4 had a 2-point deficit due to activity log color-coding taking longer than estimated. Recovered by Sprint 5.

3. Overall project velocity remained consistent — average 13.3 story points per sprint.

4. Zero scope creep occurred — total scope stayed at 80 points throughout.

5. Project completed fully on time (Week 12) with all 80 story points delivered.

6. The Burn Down chart shows a near-ideal trajectory with only minor fluctuations in Sprints 2 and 4 — both recovered in the following sprint.

---

PROJECT VELOCITY SUMMARY:

Sprint 1: 16 points completed in 2 weeks
Sprint 2: 14 points completed (2 carried forward — recovered)
Sprint 3: 16 points completed
Sprint 4: 14 points completed (2 carried forward — recovered)
Sprint 5: 14 points completed (includes 4 carried from Sprint 4)
Sprint 6: 8 points completed

Average Velocity: 13.3 story points per sprint
Total Delivered: 80 / 80 story points = 100% delivery rate

---

CONCLUSION — AGILE PERFORMANCE:

India Travel Pal was successfully delivered using Agile Scrum methodology across 6 sprints in 12 weeks. The project maintained a near-ideal burndown trajectory with minor recoverable delays in Sprints 2 and 4. All planned user stories were completed, all functional requirements were satisfied, and the final release achieved a 97.9% test pass rate. The Agile approach enabled continuous delivery of working increments — from basic auth in Sprint 1 to a production-ready AI travel system in Sprint 6.

---

End of Agile Document (Sections 4.1 to 4.8)

Project: India Travel Pal — AI-Powered Travel Intelligence System
Developed by: Umang Bharatkumar Trivedi | MCA | LJ University, Ahmedabad | 2026
