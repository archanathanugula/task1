# Team Task Manager — Backend

## Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express 5
- **Database**: PostgreSQL
- **Auth**: JWT (`jsonwebtoken`), Bcrypt.js
- **DB Driver**: `pg` (node-postgres)
- **Other**: `dotenv`, `cors`

## How to Run

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env` file (or copy `.env.example`):

```env
PORT=5000
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=taskmanager
JWT_SECRET=your_jwt_secret
```

### 3. Start the Server

```bash
npm start
```

API runs at `http://localhost:5000`. The database schema initializes automatically on startup.
