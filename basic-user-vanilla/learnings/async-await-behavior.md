# Understanding `async`/`await` in Node.js

This document explains the usage and significance of `async`/`await` in the project context.

## ✳️ Why Use `async/await`?

Node.js is non-blocking and single-threaded, but many operations — especially file I/O, DB access, or network requests — are **asynchronous**.

Using `async/await`:

- Makes code **look synchronous** and **easy to read**
- Allows **structured error handling** with `try/catch`
- Keeps Node.js **event loop unblocked**

## ✅ Where It's Used in This Project

```js
async function createUser(req, res) {
  const body = await parseBody(req); // Awaiting request body parsing
  // ...
}
```

## 🔄 How Node.js Handles It

When await is encountered, the current function yields.
Node’s event loop picks up other I/O or HTTP requests in the meantime.
Once the awaited operation completes, the function resumes where it left off.

## 🧠 Important Concepts

await can only be used inside an async function.
If the awaited operation fails, it throws an exception — which should be handled using try/catch.
Despite appearing synchronous, await does not block the event loop.

## 🧵 Analogy

Think of await as putting a bookmark in a function and letting Node.js go read another "book" (handle another request) until the current one is ready to continue.

## ⛔ Common Mistake

Avoid mixing await and synchronous blocking code like:

```js
const data = fs.readFileSync(...); // ❌ Blocks the event loop

// Prefer this:
const data = await fs.promises.readFile(...); // ✅ Non-blocking
---
```
