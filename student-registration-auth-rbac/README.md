# Student Registration Service with JWT Authentication and RBAC

A Node.js + Express service for managing student records, secured with JWT authentication and Role-Based Access Control (RBAC).  
Supports user registration, login, token refresh, and logout, along with protected CRUD operations for student profiles.

## Features

- **JWT Authentication** (access + refresh tokens)
- **Role-Based Access Control** (admin, advisor, student)
- **Password Hashing** with bcrypt
- **Student CRUD** endpoints with role-based permissions
- **Knex.js** for database queries
- **Environment-based Configuration** with dotenv
- **Secure Middleware** for authentication and authorization

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
JWT_REFRESH_SECRET=your_refresh_secret
```
## Setup
```bash
# Install dependencies
npm install
# Run database migrations to create tables
npx knex migrate:latest
# Start the server
npm start
```

## API Endpoints
Authentication
| Method | Endpoint         | Description                              |
| ------ | ---------------- | ---------------------------------------- |
| POST   | `/auth/register` | Register a new user                      |
| POST   | `/auth/login`    | Login and receive JWT tokens             |
| POST   | `/auth/refresh`  | Refresh access token using refresh token |
| POST   | `/auth/logout`   | Logout and invalidate refresh token      |

## Student Management (Protected)
| Method | Endpoint        | Roles Allowed                 | Description               |
| ------ | --------------- | ----------------------------- | ------------------------- |
| GET    | `/students`     | admin, advisor                | Get all student profiles  |
| GET    | `/students/:id` | admin, advisor, student (own) | Get student profile by ID |
| POST   | `/students`     | admin, advisor                | Create a student profile  |
| PUT    | `/students/:id` | admin, advisor, student (own) | Update student profile    |
| DELETE | `/students/:id` | admin                         | Delete a student profile  |

## Authentication & Authorization Flow

1. User registers → credentials stored securely.
2. User logs in → receives access token (15 min) + refresh token (7 days).
3. Access token sent in Authorization: Bearer <token> header for protected routes.
4. Role-based access control restricts what actions users can perform:
    - Admin: Full access (CRUD on students).
    - Advisor: Can view and modify student profiles but cannot delete.
    - Student: Can view and update own profile only.
5. Refresh token used to obtain new access tokens without re-login.
6. Logout invalidates the refresh token.
---


