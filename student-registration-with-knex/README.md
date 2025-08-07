# Student Registration System – Express.js + MySQL + Knex.js

This project is a student CRUD backend built using **Express.js**, **MySQL**, and **Knex.js** (SQL query builder and migration tool). It demonstrates how to structure an API backend cleanly and scalably.

## Features

- REST API using Express.js
- MySQL database with Knex.js for:
  - Query building
  - Connection pooling
  - Migrations
- Folder-based modular structure (routes, controllers, migrations, utils)
- Consistent response formatting using `sendResponse` utility

## Why Express.js?

Express is used as the core server framework to:

- Simplify route handling (`GET`, `POST`, etc.)
- Support JSON body parsing (`express.json()`)
- Cleanly organize middleware and routing logic

## Why Knex.js?

Knex.js is used to replace raw SQL queries and manage database schema with:

- Query builder syntax (less prone to injection errors)
- Built-in support for migrations, rollback, and seeds
- Works well with MySQL, PostgreSQL, SQLite, etc.

## Setup

1. Install dependencies:

```bash
npm install express knex mysql2
```
2. Configure your database credentials inside the database config file (e.g., db.js or db/pool.js).

3. Start the server:
   
```bash
nodemon server.js
```
## Routes

| Method | Endpoint     | Description       |
| ------ | ------------ | ----------------- |
| GET    | `/users`     | Get all users     |
| GET    | `/users/:id` | Get user by ID    |
| POST   | `/users`     | Create a new user |
| PUT    | `/users/:id` | Update user by ID |
| DELETE | `/users/:id` | Delete user by ID |

## Notes
 - Knex handles connection pooling automatically.
 - All responses are normalized via utils/sendResponse.js.
 - Migrations ensure table structure consistency across environments.
