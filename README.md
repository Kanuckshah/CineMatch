# CineMatch 🎬

**An intelligent movie discovery platform combining user taste signals with a Python-based hybrid recommendation engine**

## 🎯 Project Overview

CineMatch is a personalized movie recommendation system that learns from your preferences and delivers accurate, explainable movie suggestions. Built with a modern tech stack combining React, Python, and machine learning algorithms.

### Key Features
- 🔐 Firebase Authentication (Email + Google OAuth)
- 🎥 Personalized movie recommendations using hybrid ML algorithms
- 💫 Tinder-style swipe interface
- 🧠 Real-time learning from user feedback
- 📊 Content-based filtering with cosine similarity
- 🎨 Beautiful, modern UI with Framer Motion animations

## 🏗️ Architecture

```
CineMatch/
├── frontend/          # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── contexts/     # React contexts (Auth, etc.)
│   │   ├── config/       # Firebase config
│   │   ├── services/     # API services
│   │   └── types/        # TypeScript types
│   └── package.json
│
└── backend/           # Python + FastAPI
    ├── app/
    │   ├── routers/      # API endpoints
    │   ├── services/     # Business logic
    │   ├── models/       # Pydantic models
    │   └── utils/        # Helper functions
    └── requirements.txt
```

## 🚀 Tech Stack

### Frontend
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Auth:** Firebase Auth SDK
- **Database:** Firestore SDK
- **HTTP Client:** Axios

### Backend
- **Framework:** FastAPI (Python 3.9+)
- **ML Libraries:** scikit-learn, NumPy, Pandas
- **Database:** Cloud Firestore
- **API:** TMDB API v3

## 📋 Prerequisites

- **Node.js** 18+ and npm (for frontend)
- **Python** 3.9+ (for backend)
- **TMDB API Key** - [Get one here](https://www.themoviedb.org/settings/api)
- **Firebase Project** - [Create one here](https://console.firebase.google.com)

## 🛠️ Setup Instructions

### 1. Clone the Repository
```bash
cd /Users/kanuckshah/Documents/CineMatch1/CineMatch
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env and add your TMDB API key and Firebase credentials

# Run the server
python app/main.py
```

The API will be available at `http://localhost:8000`

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env and add your Firebase config

# Run the development server
npm run dev
```

The app will be available at `http://localhost:3000`

## 🧪 API Endpoints

### Health Check
- `GET /` - API status
- `GET /health` - Health check

*(More endpoints will be added in subsequent stages)*

## 🎓 Development Stages

This project is built in 12 progressive stages:

1. ✅ **Project Foundation** - Initial setup
2. 🔜 Firebase Authentication
3. 🔜 TMDB API Integration
4. 🔜 Onboarding UI - Movie Selection
5. 🔜 Onboarding UI - Genre & Actor Selection
6. 🔜 User Profile & Feature Extraction
7. 🔜 Python Recommendation Engine Core
8. 🔜 Hybrid Scoring Algorithm
9. 🔜 Swipe Interface & UI
10. 🔜 Real-Time Learning & Feedback
11. 🔜 "For You" Page
12. 🔜 ML Enhancement & Polish

## 🎯 Recommendation Algorithm

CineMatch uses a **hybrid content-based recommendation engine** that combines:

- **Genre Similarity** (35% weight)
- **Actor Affinity** (20% weight)
- **Content-Based Filtering** using cosine similarity (25% weight)
- **Rating Quality** (10% weight)
- **Recency Score** (10% weight)

The system continuously learns from user feedback, adjusting preference weights in real-time.

## 📝 License

This project is built for educational and portfolio purposes.

## 👨‍💻 Author

Built by Kanuck Shah as a demonstration of full-stack development, ML system design, and modern web technologies.

---

**Stage 1 Complete** - Project foundation established ✅
