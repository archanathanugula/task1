# Team Task Manager

A full-stack web app for managing tasks across teams. Built with React on the frontend and Node/Express on the backend, using PostgreSQL for storage.

## Stack

- React 18 + Vite + React Router v6
- Node.js + Express
- PostgreSQL
- JWT authentication

## Running locally

You'll need Node.js v18+ and a running PostgreSQL instance.

**Backend:**

```bash
cd backend
npm install
cp .env.example .env
# fill in your DB credentials and a JWT secret in .env
npm start
```

The server starts on `http://localhost:5000`. On first run it will create the database tables automatically.

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

The dev server runs on `http://localhost:5173`.
