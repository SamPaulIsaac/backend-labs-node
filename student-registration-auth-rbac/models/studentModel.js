const db = require("../db/knex");
const logger = require("../utils/logger");

// Fetch all student profiles
const getAllStudents = async () => {
  const students = await db("students").select("*");
  logger.info("Fetched all students");
  return students;
};

// Fetch student profile by student ID (primary key)
const getStudentById = async (id) => {
  const student = await db("students").where({ id }).first();
  logger.info(`Fetched student by ID: ${id}`);
  return student;
};

// Fetch student profile by associated user_id
const getStudentByUserId = async (user_id) => {
  const student = await db("students").where({ user_id }).first();
  logger.info(`Fetched student by user_id: ${user_id}`);
  return student;
};

// Create student profile linked to a user
const createStudent = async ({ user_id, course }) => {
  const [id] = await db("students").insert({ user_id, course });
  logger.info(`Created new student profile with ID ${id} for user ${user_id}`);
  return { id, user_id, course };
};

// Update student profile by student ID
const updateStudent = async (id, { course }) => {
  const rowsAffected = await db("students").where({ id }).update({ course });
  logger.info(`Updated student profile with ID ${id}`);
  return rowsAffected > 0 ? { id, course } : null;
};

// Delete student profile by ID
const deleteStudent = async (id) => {
  const rowsAffected = await db("students").where({ id }).del();
  logger.info(`Deleted student profile with ID ${id}`);
  return rowsAffected > 0;
};

module.exports = {
  getAllStudents,
  getStudentById,
  getStudentByUserId,
  createStudent,
  updateStudent,
  deleteStudent,
};
