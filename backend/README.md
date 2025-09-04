# Backend (Node.js + Express + SQLite)

## Setup (Windows)
1. Open PowerShell and navigate to backend folder.
2. Run `npm install`.
3. Run `npm start` to start server on http://localhost:5000.

APIs:
- POST /api/auth/register { email, password }
- POST /api/auth/login { email, password }
- GET  /api/auth/user (requires session cookie)
- POST /api/auth/logout
- GET  /api/dashboard (protected)
