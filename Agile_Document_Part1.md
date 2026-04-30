
## 4. AGILE DOCUMENT

---

## 4.1 AGILE PROJECT CHARTER

Project Title: India Travel Pal — AI-Powered Travel Intelligence System

Project Vision:
To build a single AI-powered conversational web application that allows Indian travelers to plan complete domestic trips — including itinerary, transport comparison, hotel recommendations, and budget estimation — using natural language in English, Hindi, or Hinglish.

Project Sponsor / Owner: Umang Bharatkumar Trivedi

University: LJ University, Ahmedabad

Course: MCA — Master of Computer Applications

Project Guide: (Guide Name)

Project Start Date: January 6, 2026

Project End Date: March 30, 2026

Total Duration: 12 Weeks (6 Sprints x 2 Weeks Each)

Team Size: 1 (Individual Project)

---

Project Objectives:

1. Develop a conversational AI chatbot for Indian domestic travel planning using Google Gemini 2.5 Flash.
2. Provide structured outputs — day-wise itinerary, hotel suggestions, transport options (flight/train/bus), and budget breakdown.
3. Support multilingual interaction in English, Hindi, and Hinglish.
4. Implement secure user authentication with JWT and role-based access control.
5. Build a comprehensive Admin Dashboard for user, destination, and content management.
6. Create a Travel Knowledge Base with 40+ verified Indian destinations.
7. Persist all chat conversations in MongoDB for continuity and admin monitoring.

---

Project Scope (In-Scope):

- User registration and login with JWT authentication
- AI-powered chat interface using Google Gemini 2.5 Flash
- Structured AI response with 10 data fields (itinerary, hotels, transport, budget, food)
- Travel Knowledge Base with 40+ destinations (MongoDB seeded)
- Admin Panel: user management, destination management, chat history, activity logs
- Voice input (speech-to-text) and text-to-speech output
- Responsive web design (mobile and desktop)
- Persistent chat history in MongoDB

Out of Scope (Current Version):

- Real-time flight/train pricing via live APIs (Amadeus, IRCTC)
- Direct ticket booking
- Native mobile application (Android/iOS)
- Payment gateway integration
- Regional languages beyond Hindi/English (Tamil, Telugu, Marathi)

---

Project Success Criteria:

1. All 25 Functional Requirements implemented and tested (100% FR coverage)
2. AI response time under 5 seconds for all query types
3. Admin panel fully functional with 5 working tabs
4. Chat history persisted and retrievable for all users
5. 40+ destinations seeded in knowledge base
6. Overall test pass rate above 95%
7. Project delivered within 12-week timeline

---

Risks and Mitigation:

Risk 1: Google Gemini API quota exceeded during heavy usage
Mitigation: Implement 3-model fallback chain (gemini-2.5-flash → gemini-2.0-flash → gemini-flash-latest)

Risk 2: AI returns malformed JSON response
Mitigation: JSON parser with try/except; fallback to plain text reply

Risk 3: MongoDB connection failure
Mitigation: User-friendly error displayed; retry logic in Motor driver config

Risk 4: Sprint deadline slippage due to complex AI prompt engineering
Mitigation: Time-boxed sprints; scope reduction prioritized over deadline breach

Risk 5: TypeScript type errors blocking frontend build
Mitigation: Strict TypeScript with interfaces for all API responses; daily build checks

---

Agile Methodology Chosen: Scrum

Sprint Duration: 2 Weeks per Sprint

Total Sprints: 6

Daily Standups: Self-review checklist (individual project)

Sprint Review: End-of-sprint demo and retrospective notes

Definition of Done:
- Feature is implemented and manually tested
- No console errors in browser or terminal
- Code committed to Git with proper commit message
- Functional requirement linked to feature is marked complete

---

## 4.2 SPRINT ROADMAP

Total Project Duration: 12 Weeks | 6 Sprints | January 2026 — March 2026

---

Sprint 1: Project Foundation
Duration: Week 1 — Week 2 (Jan 6 — Jan 19)
Theme: Setup, Authentication, Database

Goal: Establish the complete project infrastructure and working user authentication.

Deliverables:
- React + Vite + TypeScript frontend project initialized
- FastAPI backend project initialized with folder structure
- MongoDB connection established via Motor async driver
- User registration API (POST /api/v1/auth/register) complete
- User login API (POST /api/v1/auth/login) with JWT token
- bcrypt password hashing implemented
- Protected route middleware (JWT validation dependency)
- Login and Register pages in React with form validation
- AuthContext for global user state management
- Role-based redirect: user → /dashboard, admin → /admin

Sprint 1 Status: Completed on time

---

Sprint 2: AI Chat Engine
Duration: Week 3 — Week 4 (Jan 20 — Feb 2)
Theme: Gemini Integration, Knowledge Base, Basic Chat

Goal: Get a working AI chat interface that responds to travel queries.

Deliverables:
- Google Gemini 2.5 Flash SDK integrated (google-genai)
- System prompt engineered for India travel context
- Language detection logic (EN / HI / HI-EN Hinglish)
- Chat API endpoint (POST /api/chat) implemented
- Structured 10-field JSON response parsing
- MongoDB trips collection seeded with 20 destinations
- Knowledge Base context builder (top 3 relevant destinations injected)
- Basic chat UI with message bubbles (user right, AI left)
- Conversation saved to MongoDB on every exchange
- 3-model fallback chain on API quota errors

Sprint 2 Status: Completed, 1 day delayed (JSON parsing edge cases)

---

Sprint 3: Rich UI Cards
Duration: Week 5 — Week 6 (Feb 3 — Feb 16)
Theme: Structured Output Rendering

Goal: Display AI response as rich visual cards instead of raw text.

Deliverables:
- ItineraryCard component — day-wise collapsible accordion
- HotelCard component — Budget/Mid-Range/Luxury columns
- TransportCard component — Flight/Train/Bus tabbed view
- BudgetCard component — total + itemized breakdown
- FoodCard component — local food items as pills
- Cards conditionally rendered based on AI JSON fields
- Chat sidebar with conversation list and new chat button
- Auto-generated conversation titles
- Loading animation (thinking indicator) while AI processes

Sprint 3 Status: Completed on time

---

Sprint 4: Admin Panel
Duration: Week 7 — Week 8 (Feb 17 — Mar 2)
Theme: Admin Dashboard Development

Goal: Build the complete 5-tab Admin Panel with full user and content management.

Deliverables:
- Admin Panel React component with 5 tabs
- Dashboard Tab: stats (users, conversations, destinations, logs), recent activity
- Travelers Tab: list all users, block/unblock/delete with confirmation
- Destinations Tab: list all 40+ destinations, add new, delete existing
- Chat History Tab: view all user conversations with messages
- Activity Logs Tab: color-coded timeline of admin actions
- All admin APIs in FastAPI: /api/admin/users, /api/admin/logs etc.
- Admin action logging on every operation (block, unblock, delete, add)
- AdminRoute guard in React (redirects non-admin users)

Sprint 4 Status: Completed, 2 days delayed (activity log color-coding)

---

Sprint 5: Knowledge Base Expansion and Error Handling
Duration: Week 9 — Week 10 (Mar 3 — Mar 16)
Theme: Content Expansion, Robustness

Goal: Expand KB to 40+ destinations and harden the system against errors.

Deliverables:
- Knowledge base expanded from 20 to 40+ destinations
- States covered: Goa, Rajasthan, Kerala, HP, Uttarakhand, Maharashtra, Gujarat, UP, Karnataka, Tamil Nadu
- Voice input (speech-to-text) integrated in chat input
- Text-to-speech (TTS) output for AI responses
- Friendly error messages for all failure scenarios
- Mobile responsive layout fixes across all pages
- Theme toggle (dark/light mode) in settings
- User profile page with editable name/email
- Blocked user login prevention enforced

Sprint 5 Status: Completed on time

---

Sprint 6: Testing, Documentation, Final Polish
Duration: Week 11 — Week 12 (Mar 17 — Mar 30)
Theme: Quality Assurance and Submission

Goal: Complete all testing, fix remaining issues, and prepare final submission.

Deliverables:
- Functional testing: 28 test cases executed
- Integration testing: 8 integration points verified
- Security testing: 10 security checks performed
- Browser compatibility testing: Chrome, Firefox, Edge, Safari
- Performance testing: response times measured and documented
- User Acceptance Testing with 5 representative users
- All bugs from testing resolved
- Project report written and formatted
- Code cleaned, commented, and committed to GitHub
- Final demo preparation

Sprint 6 Status: Completed on time — 97.9% test pass rate achieved

---

## 4.3 AGILE USER STORIES (SPRINT WISE)

User Story Format: As a [role], I want to [action], so that [benefit].

Priority Levels: High / Medium / Low
Story Points: 1 (Simple) to 8 (Complex)
Status: Done / In Progress / Backlog

---

SPRINT 1 USER STORIES — Authentication and Setup

US-01
As a new user, I want to register with my name, email, and password,
so that I can create an account and access the travel planner.
Priority: High | Story Points: 3 | Status: Done

Acceptance Criteria:
- Registration form accepts name, email, password fields
- Password is validated for minimum 6 characters
- Duplicate email shows "already registered" error
- On success, user is redirected to login page

---

US-02
As a registered user, I want to log in with my email and password,
so that I can access my personalized travel dashboard.
Priority: High | Story Points: 3 | Status: Done

Acceptance Criteria:
- Login form with email and password fields
- Wrong credentials shows "invalid credentials" message
- Successful login returns JWT token stored in localStorage
- User redirected to /dashboard after login

---

US-03
As an admin, I want to log in and be automatically redirected to the admin panel,
so that I can manage the platform without going through user screens.
Priority: High | Story Points: 2 | Status: Done

Acceptance Criteria:
- Admin email (admin@indiatravelpal.com) recognized via role field
- After login, role checked and admin redirected to /admin
- Regular users cannot access /admin route

---

US-04
As a logged-in user, I want my session to stay active for 24 hours,
so that I don't have to log in every time I use the app.
Priority: Medium | Story Points: 2 | Status: Done

Acceptance Criteria:
- JWT token expires after 24 hours
- On expiry, user is redirected to login page
- Token stored securely in localStorage

---

SPRINT 2 USER STORIES — AI Chat Engine

US-05
As a traveler, I want to type a travel query in plain English,
so that I can get a complete trip plan without filling any forms.
Priority: High | Story Points: 8 | Status: Done

Acceptance Criteria:
- Chat input accepts any free-text query
- AI processes query and returns structured JSON
- Response rendered in chat interface within 5 seconds
- Conversation saved to MongoDB automatically

---

US-06
As a Hindi-speaking traveler, I want to type my query in Hindi,
so that I can plan my trip in my native language.
Priority: High | Story Points: 5 | Status: Done

Acceptance Criteria:
- System detects Hindi language automatically
- AI responds in the same language as input
- Hindi text rendered correctly in chat bubbles
- No language-switching needed by user

---

US-07
As a traveler, I want to see transport options (flight, train, bus) in the response,
so that I can compare and choose the best option for my trip.
Priority: High | Story Points: 5 | Status: Done

Acceptance Criteria:
- AI extracts transport options from Gemini response
- Flight, train, bus data returned as separate arrays
- Transport card conditionally shown in UI when data exists

---

US-08
As a traveler, I want my chat history to be saved,
so that I can refer back to past trip plans.
Priority: High | Story Points: 3 | Status: Done

Acceptance Criteria:
- All messages saved to conversations collection in MongoDB
- Chat sidebar shows list of past conversations with titles
- Clicking a conversation reloads its full message history

---

SPRINT 3 USER STORIES — Rich UI Cards

US-09
As a traveler, I want to see a day-wise itinerary as a visual card,
so that I can easily understand my trip plan day by day.
Priority: High | Story Points: 5 | Status: Done

Acceptance Criteria:
- Itinerary card shows each day as a collapsible accordion
- Day title and list of activities shown per day
- Card only appears when AI returns itinerary data

---

US-10
As a budget-conscious traveler, I want to see a budget breakdown card,
so that I know exactly how much each part of the trip will cost.
Priority: High | Story Points: 5 | Status: Done

Acceptance Criteria:
- Budget card shows total estimated cost
- Breakdown includes: stay, food, travel, miscellaneous
- Card rendered with clear labels and amounts

---

US-11
As a traveler, I want hotel recommendations organized by budget category,
so that I can choose accommodation that fits my spending capacity.
Priority: Medium | Story Points: 3 | Status: Done

Acceptance Criteria:
- Hotels categorized as Budget / Mid-Range / Luxury
- Each hotel shows name, estimated price per night, highlights
- Card rendered only when hotel data is returned by AI

---

US-12
As a traveler, I want to see local food recommendations for my destination,
so that I don't miss famous dishes when I visit.
Priority: Low | Story Points: 2 | Status: Done

Acceptance Criteria:
- Food items shown as styled pill tags
- Appears only when AI returns food data
- Linked to the destination in AI response

---

SPRINT 4 USER STORIES — Admin Panel

US-13
As an admin, I want to view all registered users in a table,
so that I can monitor who is using the platform.
Priority: High | Story Points: 3 | Status: Done

Acceptance Criteria:
- Users listed with name, email, role, status, join date
- Table is searchable and sortable
- Blocked users visually highlighted

---

US-14
As an admin, I want to block a user account,
so that I can prevent misuse of the platform.
Priority: High | Story Points: 3 | Status: Done

Acceptance Criteria:
- Block button visible next to each user
- Confirmation prompt before blocking
- Blocked user cannot login after action
- Action logged in admin_logs with timestamp

---

US-15
As an admin, I want to add new Indian destinations to the knowledge base,
so that the AI can answer queries about more places.
Priority: High | Story Points: 5 | Status: Done

Acceptance Criteria:
- Add Destination form with fields: name, city, state, type, description, highlights, tips
- On submission, destination saved to trips collection
- New destination immediately available for AI context injection

---

US-16
As an admin, I want to view a log of all my past actions,
so that there is a complete audit trail of system management activities.
Priority: Medium | Story Points: 3 | Status: Done

Acceptance Criteria:
- Activity logs shown in reverse chronological order
- Each log shows: action type, target, details, timestamp
- Color-coded by action type (block=red, add=green, delete=orange)

---

SPRINT 5 USER STORIES — Content and Robustness

US-17
As a traveler, I want to speak my travel query instead of typing,
so that I can use the app hands-free or on mobile conveniently.
Priority: Medium | Story Points: 5 | Status: Done

Acceptance Criteria:
- Microphone button in chat input
- Speech recognized and converted to text automatically
- Recognized text placed in input field for review before sending

---

US-18
As a traveler, I want to hear the AI response read aloud,
so that I can listen to my trip plan without reading the screen.
Priority: Medium | Story Points: 3 | Status: Done

Acceptance Criteria:
- AI reply text is read aloud using browser TTS
- Audio stops if user navigates away or starts new chat
- Read-aloud can be toggled off

---

US-19
As a traveler, I want the app to work well on my mobile phone,
so that I can plan trips on the go from any device.
Priority: High | Story Points: 5 | Status: Done

Acceptance Criteria:
- App fully usable on screens from 320px (mobile) to 1920px (desktop)
- Chat sidebar collapses into a drawer on mobile
- All cards stack vertically on small screens

---

SPRINT 6 USER STORIES — Testing and Submission

US-20
As the project developer, I want all functional requirements tested with documented test cases,
so that quality and correctness of the system can be verified.
Priority: High | Story Points: 8 | Status: Done

Acceptance Criteria:
- 28 functional test cases documented with TC ID, input, expected, actual, status
- All test cases pass or have documented mitigation
- Test summary report generated

---

## 4.4 WIREFRAME

Note: The following section describes text-based wireframe layouts for each major screen. These descriptions are intended for use with wireframing tools such as Figma, Balsamiq, or Draw.io to create visual wireframes.

---

WIREFRAME 1: LOGIN PAGE

Layout: Centered single card on full-screen dark gradient background

Structure (top to bottom):
- Logo + App Name: "India Travel Pal" with tagline "Your AI Travel Companion"
- Heading: "Welcome Back"
- Input Field 1: Email Address (placeholder: you@example.com)
- Input Field 2: Password (with show/hide eye icon)
- Button: "Login" (full-width, primary color)
- Divider line
- Link: "Don't have an account? Register"
- Error message zone: appears below password on invalid login (red text)

Design Notes:
- Background: dark gradient (#0a0a0f to #1a1a2e)
- Card: glassmorphism effect (frosted glass, semi-transparent)
- Button: indigo gradient with hover scale animation
- Font: Inter, 14px body, 24px heading

---

WIREFRAME 2: REGISTRATION PAGE

Layout: Same centered card as login

Structure (top to bottom):
- Heading: "Create Account"
- Input Field 1: Full Name
- Input Field 2: Email Address
- Input Field 3: Password
- Input Field 4: Confirm Password
- Button: "Create Account" (full-width, primary)
- Link: "Already have an account? Login"
- Inline validation: red error under each field on invalid input

---

WIREFRAME 3: MAIN CHAT INTERFACE

Layout: 3-zone horizontal split (sidebar + chat area)

Left Sidebar (280px wide):
- App logo + name at top
- Button: "+ New Chat" (full-width)
- Scrollable list of past conversations (each shows title + date)
- Active conversation highlighted
- Bottom: User name + avatar + logout icon

Center Chat Area (remaining width):
- Top bar: current conversation title + voice toggle icon
- Chat scroll area:
  - User messages: right-aligned bubble (indigo background)
  - AI messages: left-aligned bubble (dark card surface)
  - Timestamp under each bubble
- Below AI message: structured cards (conditionally rendered)
- Bottom input bar:
  - Text input field (placeholder: "Ask me about your trip...")
  - Microphone button (left of input)
  - Send button (right of input, indigo)
  - Thinking animation: animated dots appear while AI processes

---

WIREFRAME 4: AI RESPONSE CARDS (below AI message bubble)

Card A — Itinerary Card:
- Header: "Day-wise Itinerary" with calendar icon
- Each day: collapsible row with Day number + title
- Expanded day: bullet list of activities

Card B — Transport Card:
- Header: "Transport Options"
- 3 tabs: Flight | Train | Bus
- Each tab: list of options with airline/operator, duration, price range

Card C — Hotel Card:
- Header: "Hotel Recommendations"
- 3 columns: Budget | Mid-Range | Luxury
- Each column: 2-3 hotel names with price per night

Card D — Budget Card:
- Header: "Budget Breakdown"
- Total amount (large text, prominent)
- Rows: Accommodation, Food, Travel, Entry Fees, Miscellaneous — each with amount

Card E — Food Card:
- Header: "Famous Local Food"
- Horizontal scrollable row of pill-shaped tags

---

WIREFRAME 5: ADMIN PANEL

Layout: Full-width with top navigation tabs

Top Bar:
- App logo + "Admin Panel" label
- Logout button (top right)

Tab Navigation (horizontal): Dashboard | Travelers | Destinations | Chat History | Activity Logs

Tab 1 — Dashboard:
- 4 KPI cards in a row: Total Users | Total Conversations | Destinations | Admin Actions
- Below: Recent Activity list (last 10 logs)
- Below: Quick action buttons (Add Destination, View Users)

Tab 2 — Travelers:
- Search input at top
- Data table: columns — Name, Email, Role, Status, Join Date, Actions
- Actions per row: Block / Unblock / Delete (with confirmation modal)

Tab 3 — Destinations:
- "+ Add Destination" button at top right
- Grid of destination cards: name, state, type, delete button
- Add form: modal popup with fields (name, city, state, type, description, highlights, tips)

Tab 4 — Chat History:
- Accordion list: each user as collapsible row
- Inside each user: their conversation list
- Inside each conversation: full message history with timestamps

Tab 5 — Activity Logs:
- Chronological list of log entries
- Each entry: colored badge (action type) + target + description + timestamp
- Color coding: Block=red, Add=green, Delete=orange, Unblock=teal, View=gray

---

WIREFRAME 6: USER PROFILE PAGE

Layout: Centered content card

Sections:
- Profile Avatar (initials-based circle, editable)
- Display Name (editable inline)
- Email Address (read-only after registration)
- Change Password form (current + new + confirm)
- Theme Toggle: Dark Mode / Light Mode switch
- Save Changes button
- Account Stats: Total Chats, Member Since date

