const request = require("supertest");
const app = require("../app");
const knex = require("../db/knex");

describe("Student API Integration Tests", () => {
  beforeAll(async () => {
    await knex.migrate.latest(); // This creates tables from migrations
  });

  beforeEach(async () => {
    await knex("students").del(); // Start fresh
  });

  afterAll(async () => {
    await knex.destroy(); // Clean DB connection
  });

  test("GET /students should return empty array if no data", async () => {
    const res = await request(app).get("/students");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(0);
  });

  test("GET /students should return seeded student", async () => {
    await knex("students").insert({
      name: "Seeded Student",
      email: "seeded@student.com",
      course: "AI",
    });

    const res = await request(app).get("/students");

    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].name).toBe("Seeded Student");
  });

  test("POST /students should create a new student", async () => {
    const newStudent = {
      name: "Test User",
      email: "testuser@example.com",
      course: "AI &ML",
    };

    const res = await request(app).post("/students").send(newStudent);

    expect(res.statusCode).toBe(201);
    expect(res.body.data.name).toBe("Test User");

    const all = await knex("students").select("*");
    expect(all.length).toBe(1); // only 1 created
  });

  test("PUT /students/:id should update an existing student", async () => {
    const [id] = await knex("students").insert({
      name: "Old Name",
      email: "old@example.com",
      course: "DS",
    });

    const updatedData = {
      name: "Updated Name",
      email: "updated@example.com",
      course: "DSA",
    };

    const res = await request(app).put(`/students/${id}`).send(updatedData);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.name).toBe("Updated Name");

    const updated = await knex("students").where({ id }).first();
    expect(updated.email).toBe("updated@example.com");
  });

  test("DELETE /students/:id should delete a student", async () => {
    const [id] = await knex("students").insert({
      name: "To Delete",
      email: "delete@example.com",
      course: "DSA",
    });

    const res = await request(app).delete(`/students/${id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);

    const remaining = await knex("students").where({ id }).first();
    expect(remaining).toBeUndefined();
  });
});
