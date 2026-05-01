# Backend

Node.js + Express REST API backed by PostgreSQL.

## Setup

Install dependencies:

```bash
npm install
```

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

```env
PORT=5000
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=taskmanager
JWT_SECRET=your_jwt_secret
```

Then start the server:

```bash
npm start
```

It runs on `http://localhost:5000`. The database schema is created automatically on startup so you don't need to run any SQL manually.

## Auth

Endpoints are protected with JWT. Pass the token in the `Authorization` header. Admin-only routes additionally check the user's role.
