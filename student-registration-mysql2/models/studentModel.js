const db = require("../db/config");
const logger = require("../utils/logger");

const getAllStudents = async () => {
  const [rows] = await db.query("SELECT * FROM students");
  logger.info(`Fetched ${rows.length} students from database`);
  return rows;
};

const getStudentById = async (id) => {
  const [rows] = await db.query("SELECT * FROM students WHERE id = ?", [id]);
  logger.info(`Fetched student by ID ${id}`);
  return rows[0]; // Controller will handle if undefined
};

const createStudent = async ({ name, email, course }) => {
  const [result] = await db.query(
    "INSERT INTO students (name, email, course) VALUES (?, ?, ?)",
    [name, email, course]
  );
  logger.info(`Inserted student into database with ID ${result.insertId}`);
  return { id: result.insertId, name, email, course };
};

const updateStudent = async (id, { name, email, course }) => {
  await db.query(
    "UPDATE students SET name = ?, email = ?, course = ? WHERE id = ?",
    [name, email, course, id]
  );
  logger.info(`Updated student with ID ${id}`);
  return { id, name, email, course };
};

const deleteStudent = async (id) => {
  await db.query("DELETE FROM students WHERE id = ?", [id]);
  logger.info(`Deleted student with ID ${id}`);
  return { success: true, id }; // Optional but clean
};

const getStudentByEmail = async (email) => {
  const [rows] = await db.query("SELECT * FROM students WHERE email = ?", [
    email,
  ]);
  return rows[0];
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentByEmail,
};
