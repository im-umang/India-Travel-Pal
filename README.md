# 🇮🇳 India Travel Pal - AI Travel Intelligence System

### 🤖 Next-Gen AI Travel Consultant | MCA Final Year Project
**Developed by:** Umang Bharatkumar Trivedi  
**University:** LJ University, Ahmedabad  
**Course:** Master of Computer Applications (MCA)  

---

## 🚀 Project Vision
**India Travel Pal** is an advanced AI-powered autonomous agent that simplifies domestic travel planning. By leveraging **Google Gemini 2.0 Flash**, it provides high-fidelity itineraries, side-by-side transport comparisons, and granular budget breakdowns through a premium, voice-enabled interface.

## ✨ Key Features
- **Voice-to-Voice Planning:** Talk to the agent just like a real travel consultant.
- **Smart Itineraries:** Automated day-wise plans with real-time speech-to-UI highlighting.
- **Transport Intelligence:** Compare Trains, Flights, and Buses in one unified view.
- **Dual Language Support:** Seamless toggle between English and Hindi with zero Hinglish artifacts.
- **Budget Intelligence:** Get detailed cost estimates tailored to your travel style (Budget/Mid-Range/Luxury).

## 🛠 Tech Stack
- **Frontend:** React 18, TypeScript, Tailwind CSS, Framer Motion
- **Backend:** FastAPI (Python 3.11)
- **AI Core:** Google Gemini 2.0 Flash
- **Voice Engine:** Web Speech API
- **Deployment:** Docker & Cloud Run compatible

## 📂 Project Structure
```
India-Travel-Pal/
├── backend/                 # Python FastAPI Services
│   ├── app/
│   │   ├── services/        # Travel Planner, Knowledge Base, AI logic
│   │   ├── controllers/     # Chat & User endpoints
├── frontend/                # React TypeScript Application
│   ├── src/
│   │   ├── components/      # UI, Voice, and Travel Cards
│   │   ├── context/         # Global Chat State & Language logic
├── README.md                # Quick Start
└── FINAL_PROJECT_DOCUMENTATION.md # Comprehensive Technical Documentation
```

## ⚡ Quick Start

### 1. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
# Set GEMINI_API_KEY in .env
python run.py
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 📖 Full Documentation
For a deep dive into the architecture, AI prompts, and implementation details, please refer to the:
👉 **[FINAL_PROJECT_DOCUMENTATION.md](./FINAL_PROJECT_DOCUMENTATION.md)**

---
*© 2026 Umang Bharatkumar Trivedi | LJ University MCA Project*
