# MySQL DB Integration with Express.js

This project demonstrates a RESTful CRUD API built using **Node.js**, **Express.js**, and **MySQL** (via the `mysql2` driver). It serves as a foundational example of how to structure a backend using Express and connect it to a relational database.

## Features

- Express.js-based server
- MySQL database integration using `mysql2`
- CRUD operations on a `users` table
- Modular code structure (routes, controllers)
- Error handling and consistent JSON responses

## Why Express.js?

Using **Express** simplifies routing and middleware handling. Compared to native Node.js HTTP server, Express provides:

- Built-in routing with support for params and query strings
- Middleware support for parsing JSON bodies
- Cleaner code organization

## Setup

1. Install dependencies:

```bash
npm install express mysql2
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
 - Ensure your MySQL server is running and database is created.
 - Tables should be created manually (no migration tool used here).
