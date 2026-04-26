# DATA DICTIONARY
## AI-Powered Travel Planning & Transport Intelligence System

This document defines the data structures and schema used in the **India Travel Pal** system, including MongoDB collections and core AI response objects.

---

## 1. MONGODB COLLECTIONS

### 1.1 Collection: `users`
Stores user profile and authentication data.

| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key (Unique Identifier) |
| `name` | String | Full name of the user |
| `email` | String | Unique email address (Used for login) |
| `password` | String | Bcrypt hashed password |
| `role` | String | User role (`user` or `admin`) |
| `is_blocked` | Boolean | Account status (True if blocked by admin) |
| `created_at` | ISO String | Timestamp of registration |
| `last_login` | ISO String | Timestamp of the most recent successful login |

### 1.2 Collection: `conversations`
Stores the chat history and AI-generated travel plans.

| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key |
| `user_id` | String | Reference to the `users` collection |
| `title` | String | Auto-generated title of the chat (e.g., "Trip to Udaipur") |
| `messages` | Array | List of message objects (see below) |
| `created_at` | ISO String | Timestamp of chat creation |
| `updated_at` | ISO String | Timestamp of last message |

**Message Object Schema:**
- `id`: Unique Message ID
- `text`: Raw text or JSON string from AI
- `sender`: `user` or `bot`
- `timestamp`: Date object
- `language`: `en` or `hi`

### 1.3 Collection: `analytics` (or `user_queries`)
Tracks user intents and searches for the admin dashboard.

| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key |
| `user_id` | String | Reference to the user |
| `intent` | String | Classified intent (e.g., `plan_trip`, `ask_food`) |
| `place` | String | Destination name extracted from query |
| `budget` | String | Budget preference (`Low`, `Mid`, `Luxury`) |
| `transport_mode`| String | Preferred mode (Flight, Train, Bus) |
| `latency_ms` | Number | Response time of the AI engine |
| `status` | String | `success` or `error` |
| `timestamp` | ISO String | Time of query |

### 1.4 Collection: `admin_logs`
Audit trail for administrative actions.

| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key |
| `admin_id` | String | ID of the admin who performed the action |
| `action` | String | Type of action (e.g., `block_user`, `delete_trip`) |
| `target` | String | ID of the user or resource affected |
| `details` | String | Additional metadata about the change |
| `created_at` | ISO String | Timestamp of action |

---

## 2. AI STRUCTURED RESPONSE (JSON SCHEMA)
This is the core data object returned by the Gemini AI to drive the rich UI.

| Property | Type | Description |
| :--- | :--- | :--- |
| `reply` | String | The conversational text response |
| `current_step`| Number | Progress (1-5) in the travel planning flow |
| `lang` | String | Language of the response (`en` or `hi`) |
| `itinerary` | Array | List of Day objects (Day No, Title, Activities, Tip) |
| `route_summary`| Object | Overview of distance, time, and best travel mode |
| `budget_summary`| Object | Estimates for Budget, Mid-range, and Luxury |
| `train_options` | Array | List of available trains with prices and timings |
| `flight_options`| Array | List of available flights with airlines and fares |
| `bus_options` | Array | List of bus operators and pickup points |
| `nearby_hotels` | Array | Recommended stay options with ratings |
| `famous_food` | Array | Must-try local dishes and best areas |

---

## 3. COMPONENT-LEVEL DATA STRUCTURES (Frontend)

### 3.1 `itinerary` Item
- `day`: Day number (Integer)
- `title`: Theme of the day (String)
- `activities`: List of strings (Detailed schedule)
- `tip`: Expert travel advice for that day (String)

### 3.2 `transport_option`
- `operator_name`: Name of provider
- `departure`: Time of departure
- `arrival`: Time of arrival
- `fare`: Price in INR
- `duration`: Travel time (e.g., "6h 30m")

---
**Documentation Level:** Final  
**System Version:** v2.0 (Gemini 2.0 Integrated)  
