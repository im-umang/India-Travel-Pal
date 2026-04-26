# 🇮🇳 India AI Travel Planning Chatbot

A clean, responsive React.js frontend for an India-only AI travel planning chatbot with WhatsApp-style chat interface and voice input support.

## Features

- **Authentication** - Login/Register with email & password (mock auth)
- **Dashboard** - Welcome screen with quick tips
- **Chatbot** - WhatsApp-style chat interface
  - User messages aligned right (blue)
  - Bot messages aligned left (gray)
  - Typing indicator with animated dots
  - Auto-scroll to latest message
  - Timestamps on messages
- **Voice Input** - Web Speech API for speech-to-text
- **Responsive** - Mobile-first, works on all devices

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- npm or yarn or bun

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd india-travel-bot

# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
# or
bun dev
```

The app will be available at `http://localhost:5173`

##  Screens

1. **Login** (`/login`) - Sign in with email/password
2. **Register** (`/register`) - Create new account
3. **Dashboard** (`/dashboard`) - Welcome & start chat
4. **Chat** (`/chat`) - Main chatbot interface

## Supported Routes

The chatbot has mock data for popular Indian routes:

| From | To | Highlights |
|------|-----|------------|
| Delhi | Agra | Taj Mahal, trains, buses |
| Mumbai | Goa | Beaches, flights, sleeper buses |
| Bangalore | Mysore | Palace, heritage, cabs |
| Chennai | Pondicherry | French Quarter, coastal drive |
| Jaipur | Udaipur | Lakes, palaces, Rajasthan heritage |

For other routes, the bot provides generic travel tips.

## Voice Input

Voice input uses the Web Speech API:
- Click the microphone button to start recording
- Speak your message in English
- The text will appear in the input field
- Click send to submit

**Note:** Voice input requires a modern browser (Chrome, Edge, Safari) and microphone permission.

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **React Hook Form** - Form handling
- **Zod** - Validation
- **Lucide React** - Icons

## Project Structure

```
src/
├── components/
│   ├── ui/           # Shadcn UI components
│   ├── ChatMessage.tsx
│   ├── ChatInput.tsx
│   ├── ChatHeader.tsx
│   ├── TypingIndicator.tsx
│   └── ProtectedRoute.tsx
├── context/
│   ├── AuthContext.tsx
│   └── ChatContext.tsx
├── pages/
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Dashboard.tsx
│   └── Chat.tsx
├── services/
│   └── api.ts        # Mock travel data
└── App.tsx
```

## Future Backend Integration

To connect a real backend:

1. **Replace mock auth** - Update `AuthContext.tsx` to call real API
2. **Replace mock chat** - Update `ChatContext.tsx` and `api.ts`
3. **Add real speech-to-text** - Integrate Google/Azure Speech API
4. **Add AI responses** - Connect to ChatGPT/Gemini API

---

Made with for travelers exploring incredible India! 🇮🇳
