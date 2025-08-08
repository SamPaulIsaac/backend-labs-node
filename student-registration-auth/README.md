# Student Registration Service (JWT Secured)

A Node.js + Express service for managing student records, secured with JWT authentication.  
Supports user registration, login, token refresh, and logout, along with protected CRUD operations for students.

## Features

- **JWT Authentication** (access + refresh tokens)
- **Password Hashing** with bcrypt
- **Student CRUD** endpoints
- **Knex.js** for database queries
- **Environment-based Configuration** with dotenv
- **Secure Middleware** for authentication

## Tech Stack

- Node.js
- Express.js
- Knex.js (MySQL/PostgreSQL/SQLite ready)
- bcrypt
- jsonwebtoken
- dotenv

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
DB_CLIENT=mysql2
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=studentdb

JWT_SECRET=your_jwt_secret
REFRESH_SECRET=your_refresh_secret
```

## Setup

```bash
# Install dependencies
npm install

# Run database migrations
npx knex migrate:latest

# Start server
npm start
```

## API Endpoints

| Method | Endpoint         | Description             |
| ------ | ---------------- | ----------------------- |
| POST   | `/auth/register` | Register a new user     |
| POST   | `/auth/login`    | Login and get tokens    |
| POST   | `/auth/refresh`  | Refresh access token    |
| POST   | `/auth/logout`   | Logout and revoke token |


## Student Routes (Protected)

| Method | Endpoint        | Description          |
| ------ | --------------- | -------------------- |
| GET    | `/students`     | Get all students     |
| GET    | `/students/:id` | Get student by ID    |
| POST   | `/students`     | Create a new student |
| PUT    | `/students/:id` | Update a student     |
| DELETE | `/students/:id` | Delete a student     |

## Authentication Flow

1. User registers → gets credentials stored securely.
2. User logs in → receives access token (15 min) + refresh token (7 days).
3. Access token is used in Authorization: Bearer <token> header for protected routes.
4. Refresh token can request a new access token without logging in again.
---

