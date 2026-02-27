# EngageAI Backend — Setup & Run Guide

## Project Structure

```
Student Engagement Analysis/
├── EngageAI/          ← Frontend (React + Vite)  — DO NOT TOUCH
├── Backend/           ← Node.js + Express backend  ← YOU ARE HERE
│   ├── server.js
│   ├── .env
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Session.js
│   │   ├── EngagementRecord.js
│   │   └── Classroom.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── sessionController.js
│   │   ├── engagementController.js
│   │   └── analyticsController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── sessionRoutes.js
│   │   ├── engagementRoutes.js
│   │   └── analyticsRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── validateRequest.js
│   ├── sockets/
│   │   └── socketHandler.js
│   └── utils/
│       ├── aiService.js
│       ├── jwtHelper.js
│       ├── responseHelper.js
│       └── seed.js
└── AIService/         ← Python FastAPI AI microservice
    ├── main.py
    ├── requirements.txt
    ├── .env
    └── model/         ← Drop trained model file here
        └── README.txt
```

---

## Prerequisites

| Tool       | Version  | Notes                           |
|------------|----------|---------------------------------|
| Node.js    | ≥ 18     | https://nodejs.org               |
| MongoDB    | ≥ 6      | Run locally or use Atlas        |
| Python     | ≥ 3.10   | For AI microservice             |
| pip        | latest   | Python package manager          |

---

## Step 1 — Start MongoDB

```bash
# Local install
mongod

# OR MongoDB Atlas — update MONGODB_URI in Backend/.env
```

---

## Step 2 — Backend Setup

```bash
cd Backend

# Dependencies already installed. If fresh clone:
npm install

# Copy env (already done — edit if needed)
# Backend/.env is pre-configured for local dev

# Seed database with demo users
npm run seed

# Start development server (auto-restart on changes)
npm run dev

# OR production start
npm start
```

Backend runs on: **http://localhost:5000**

---

## Step 3 — AI Microservice Setup

```bash
cd AIService

# Create virtual environment
python -m venv venv

# Activate
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Place your trained model in AIService/model/
# (see AIService/model/README.txt for supported formats)

# Start the service
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

AI Service runs on: **http://localhost:8000**

---

## Step 4 — Start Frontend

```bash
cd EngageAI
npm run dev
```

Frontend runs on: **http://localhost:5173**

---

## Demo Login Credentials (after seed)

| Role     | Email                  | Password     |
|----------|------------------------|--------------|
| Admin    | admin@school.edu       | admin123     |
| Teacher  | kavya@school.edu       | teacher123   |
| Teacher  | arjun@school.edu       | teacher123   |
| Student  | aarav@school.edu       | student123   |
| Student  | ananya@school.edu      | student123   |

*(All 10 students use password: student123)*

---

## API Endpoints

### Auth
| Method | Endpoint              | Auth | Body                           |
|--------|-----------------------|------|--------------------------------|
| POST   | /api/auth/register    | ✗    | name, email, password, role    |
| POST   | /api/auth/login       | ✗    | email, password, role          |
| GET    | /api/auth/me          | ✓    | —                              |

**Login Response (matches frontend AuthContext shape):**
```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "token": "eyJhbGci...",
    "user": {
      "_id": "...",
      "name": "Ms. Kavya Sharma",
      "email": "kavya@school.edu",
      "role": "teacher"
    }
  }
}
```

### Session
| Method | Endpoint              | Auth    | Role    |
|--------|-----------------------|---------|---------|
| POST   | /api/session/start    | ✓       | teacher |
| POST   | /api/session/end      | ✓       | teacher |
| GET    | /api/session/active   | ✓       | student |
| POST   | /api/session/join     | ✓       | student |
| GET    | /api/session/:id      | ✓       | teacher/admin |

### Engagement
| Method | Endpoint                    | Auth | Role    | Body (multipart) |
|--------|-----------------------------|------|---------|------------------|
| POST   | /api/engagement/update      | ✓    | student | file (image), sessionId |

### Analytics
| Method | Endpoint                          | Auth | Role           |
|--------|-----------------------------------|------|----------------|
| GET    | /api/analytics/session/:id        | ✓    | teacher/admin  |
| GET    | /api/analytics/student/:id        | ✓    | all roles      |
| GET    | /api/analytics/class/:classroomId | ✓    | teacher/admin  |

---

## Socket.io Events

**Client → Server**
| Event                  | Payload                    | Who      |
|------------------------|----------------------------|----------|
| session:join_room      | { sessionId }              | student  |
| teacher:join_session   | { sessionId }              | teacher  |
| session:leave_room     | { sessionId }              | student  |
| flag:no_face           | { sessionId }              | student  |
| flag:multiple_faces    | { sessionId }              | student  |
| flag:camera_blackout   | { sessionId }              | student  |
| flag:long_inactivity   | { sessionId }              | student  |

**Server → Client**
| Event                  | Payload                                              | To        |
|------------------------|------------------------------------------------------|-----------|
| session:started        | { sessionId, subject, title, startTime }            | teacher   |
| session:ended          | { sessionId, summary }                              | all room  |
| student:joined         | { sessionId, studentId, name }                      | teacher   |
| student:connected      | { sessionId, studentId, name }                      | teacher   |
| student:disconnected   | { sessionId, studentId, name }                      | teacher   |
| engagement:update      | { studentId, name, engagementPercent, state, statusColor, flags } | all room |
| student:flagged        | { studentId, name, flag, sessionId }                | all room  |

**Engagement Update Payload (teacher live dashboard):**
```json
{
  "studentId": "...",
  "studentName": "Aarav Patel",
  "engagementPercent": 78,
  "state": "Attentive",
  "confidence": 0.92,
  "statusColor": "green",
  "timestamp": "2026-02-24T10:30:00.000Z",
  "flags": { "noFace": false, "multipleFaces": false }
}
```
statusColor mapping:
- `green`  → engagementScore ≥ 0.70 (Engaged)
- `yellow` → engagementScore ≥ 0.40 (Neutral)
- `red`    → engagementScore < 0.40  (Disengaged)

---

## Environment Variables (Backend/.env)

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/engageai
JWT_SECRET=<change_this_in_production>
JWT_EXPIRES_IN=7d
AI_SERVICE_URL=http://localhost:8000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

---

## AI Microservice — Model Integration

Place your trained model file in `AIService/model/`:

| File name                    | Framework       |
|------------------------------|-----------------|
| engagement_model.onnx        | ONNX Runtime    |
| engagement_model.h5          | Keras/TensorFlow|
| engagement_model.pt          | PyTorch         |
| engagement_model.pkl         | scikit-learn    |

If no model is found, a **mock predictor** activates automatically  
(uses frame brightness + edge density — useful for testing).

The AI service auto-detects and loads whichever file is present.  
**No code changes needed** — just drop the file and restart.

---

## All 3 Services Summary

| Service    | Port | Command                              |
|------------|------|--------------------------------------|
| Frontend   | 5173 | `cd EngageAI && npm run dev`         |
| Backend    | 5000 | `cd Backend && npm run dev`          |
| AI Service | 8000 | `cd AIService && uvicorn main:app --port 8000 --workers 4` |
| MongoDB    | 27017| `mongod`                             |
