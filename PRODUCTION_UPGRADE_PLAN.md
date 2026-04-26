# Production Upgrade Plan for AI Travel Planning Chatbot

## 1. Upgrade Objectives
- **User Authentication**: Secure JWT-based auth with registration, login, and profile management.
- **Persistent Chat History**: MongoDB storage for "ChatGPT-style" history with multi-session support.
- **Multilingual Support**: Auto-detect Hindi, English, Gujarati and respond in kind.
- **Speech-to-Speech**: Frontend Web Speech API integration with backend text processing.
- **AI Architecture**: Hybrid (Intent + Entity + Generative) pipeline.
- **Production Hardening**: security, logging, rate limiting, and deployment readiness.

---

## 2. Folder Structure (Proposed)

We will transition to a modular, domain-driven structure.

```
backend/
├── app/
│   ├── api/                    # API Route definitions
│   │   ├── v1/                 # Version 1 API
│   │   │   ├── __init__.py
│   │   │   ├── auth.py         # Login, Register, Me
│   │   │   ├── chat.py         # Chatting, History
│   │   │   ├── users.py        # User management
│   │   │   └── admin.py        # Admin stats & controls
│   │   └── deps.py             # Dependencies (get_current_user, etc.)
│   ├── core/                   # Core configurations
│   │   ├── config.py           # Env settings (Pydantic Settings)
│   │   ├── security.py         # JWT, Password Hashing
│   │   ├── database.py         # DB Connection
│   │   └── exceptions.py       # Centralized exception handling
│   ├── models/                 # Database Schema (Pydantic/Beanie/ODM)
│   │   ├── user.py
│   │   ├── conversation.py
│   │   └── ... 
│   ├── schemas/                # Pydantic Schemas for Request/Response
│   │   ├── auth.py
│   │   ├── chat.py
│   │   ├── common.py
│   │   └── ...
│   ├── services/               # Business Logic
│   │   ├── auth_service.py
│   │   ├── chat_service.py     # AI Pipeline Logic
│   │   ├── llm_service.py      # LLM Integration (OpenAI/Mistral)
│   │   └── trip_service.py
│   ├── utils/                  # Helpers
│   │   ├── logger.py
│   │   └── ...
│   ├── main.py                 # Application Entry Point
│   └── run.py                  # Dev Server Runner
├── tests/                      # Unit & Integration Tests
├── requirements.txt
├── Dockerfile
└── .env
```

---

## 3. Backend Architecture Overview

### Technology Stack
- **Framework**: FastAPI (Async, Type-safe)
- **Database**: MongoDB (Motor async driver)
- **Authentication**: OAuth2 with Password Flow + JWT (Access/Refresh Tokens)
- **AI Engine**: 
  - **Intent**: Scikit-Learn TF-IDF (Local) 
  - **LLM**: OpenAI GPT-4o-mini / Mistral / Gemini (External API)
- **Caching**: Simple In-Memory LRU (for frequent intents) or Redis (future)

### Architecture Diagram (Logical)
```
[Frontend (React)] 
      |  (HTTPS / JSON)
[Load Balancer / Reverse Proxy (Nginx/Render)]
      |
[FastAPI Backend]
      |--> [Middleware] (CORS, RateLimit, Logging)
      |--> [API Routes] (Auth, Chat, Users)
            |
            |--> [Services / Logic]
                  |--> [AuthService] <--> [MongoDB Users]
                  |--> [ChatService] 
                        |--> [LanguageDetect] (FastText)
                        |--> [IntentClassifier] (Scikit)
                        |--> [LLMService] (OpenAI/Gemini)
                        |--> [MongoDB Conversations]
```

---

## 4. API Routes List

### Auth (`/api/v1/auth`)
- `POST /register`: Create new account.
- `POST /login`: Get access/refresh tokens.
- `POST /refresh`: Refresh access token.
- `POST /logout`: Invalidate tokens (if using blacklist) or clear cookies.

### Users (`/api/v1/users`)
- `GET /me`: Get current user profile.
- `PATCH /me`: Update profile (avatar, name).
- `PUT /me/password`: Change password.

### Chat (`/api/v1/chat`)
- `POST /message`: Send message, get AI response.
  - Body: `{ conversation_id: str, content: str }`
- `GET /conversations`: List user's conversations (summary).
- `GET /conversations/{id}`: Get full history.
- `POST /conversations`: Create new conversation.
- `DELETE /conversations/{id}`: Delete conversation.
- `PATCH /conversations/{id}/title`: Rename conversation.

---

## 5. Authentication Flow

1.  **Registration**:
    -   User submits `email`, `password`, `full_name`.
    -   Backend hashes password using `bcrypt`.
    -   User document stored in MongoDB.
2.  **Login**:
    -   User submits credentials.
    -   Backend verifies hash.
    -   Backend generates `access_token` (short lived) and `refresh_token` (long lived).
    -   Tokens returned in JSON body or `HTTPOnly` cookies (recommended for security).
3.  **Protection**:
    -   Protected routes use `Depends(get_current_user)`.
    -   Dependency decodes JWT, verifies signature, fetches user from DB.

---

## 6. Database Schema (MongoDB Collections)

**Collection: `users`**
```json
{
  "_id": "ObjectId",
  "email": "user@example.com",
  "password_hash": "$2b$12$...",
  "full_name": "Traveler Name",
  "data_preferences": { "language": "en" },
  "is_active": true,
  "created_at": "ISODate",
  "last_login": "ISODate"
}
```

**Collection: `conversations`**
```json
{
  "_id": "ObjectId",
  "user_id": "ObjectId(ref: users)",
  "title": "Trip to Goa",
  "messages": [
    {
      "role": "user",
      "content": "Plan a trip to Goa",
      "language": "en",
      "timestamp": "ISODate"
    },
    {
      "role": "assistant",
      "content": "JSON response...",
      "timestamp": "ISODate"
    }
  ],
  "created_at": "ISODate",
  "updated_at": "ISODate"
}
```

---

## 7. AI Processing Pipeline

1.  **Pre-processing**:
    -   Input sanitization.
    -   **Language Detection**: Use `fasttext` or `langdetect` to identify Hindi/Gu/En.
2.  **Intent Classification** (Hybrid):
    -   Run local TF-IDF+SVM model to check if query is "greeting", "pricing", "general_info".
    -   If high confidence -> Use simple/template response (faster/cheaper).
    -   If low confidence/complex -> User Generative AI.
3.  **Generative Response**:
    -   Construct Prompt:
        ```text
        SYSTEM: You are an AI Travel Assistant. Respond in {LANGUAGE}.
        Context: {Chat History Summary}
        User: {Input}
        Output content strictly in JSON structure: { ... }
        ```
    -   Call LLM API.
4.  **Post-processing**:
    -   Validate JSON.
    -   Save `User` and `Assistant` messages to DB.
    -   Return to frontend.
