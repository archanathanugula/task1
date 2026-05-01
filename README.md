# Team Task Manager

A full-stack task management system for teams.

## Tech Stack

- **Frontend**: React 18, Vite, React Router v6, Axios, Lucide React
- **Backend**: Node.js, Express 5
- **Database**: PostgreSQL
- **Auth**: JWT, Bcrypt.js

## How to Run

### Prerequisites
- Node.js v18+
- PostgreSQL installed and running

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env   # add your PostgreSQL credentials and JWT secret
npm start              # runs on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev            # runs on http://localhost:5173
```

> The database schema is created automatically on first backend startup. No manual SQL needed.
