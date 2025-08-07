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

| Method | Endpoint        | Description          |
| ------ | --------------- | -------------------- |
| GET    | `/students`     | Get all students     |
| GET    | `/students/:id` | Get student by ID    |
| POST   | `/students`     | Create a new student |
| PUT    | `/students/:id` | Update student by ID |
| DELETE | `/students/:id` | Delete student by ID |


## 🧪 Integration Testing
 - Integration testing is powered by Jest and Supertest.
 - Test Location: All integration test files are placed under the /tests directory and follow .test.js naming convention.

### How It Works
 - Supertest simulates HTTP requests to your Express server.
 - Tests verify HTTP status codes, response payloads, and behavior.
 - Can be run in isolation with a dedicated test DB if desired.
   
### Run Tests
```bash
npm test
```
This runs all Jest test cases. Be sure to restart the server if adding new routes or handlers during test development.

## 📘 API Documentation (Swagger)
The project includes interactive API documentation using Swagger via:

- swagger-jsdoc
- swagger-ui-express

Access the Docs
Once the server is running, visit:
```bash
http://localhost:3000/api-docs
```

### Documentation Format
Swagger reads OpenAPI-compliant comments defined above each route in:

```bash
src/routes/studentRoutes.js
```

Example annotation:
```js
/**
 * @swagger
 * /students:
 *   get:
 *     summary: Retrieve all students
 *     responses:
 *       200:
 *         description: A list of students
 */
```
You can test endpoints directly from the Swagger UI interface and view example inputs/outputs.

## Notes
 - Knex handles connection pooling automatically.
 - All responses are normalized via utils/sendResponse.js.
 - Migrations ensure table structure consistency across environments.
 - Swagger documentation makes the API self-descriptive and easy to consume.
 - Integration tests help ensure your endpoints remain functional as you scale or refactor.
