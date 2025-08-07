const db = require("../db/knex");
const logger = require("../utils/logger");

const getAllStudents = async () => {
  const students = await db("students").select("*");
  logger.info("Fetched all students");
  return students;
};

const getStudentById = async (id) => {
  const student = await db("students").where({ id }).first();
  logger.info(`Fetched student by ID: ${id}`);
  return student;
};

const createStudent = async ({ name, email, course }) => {
  const [id] = await db("students").insert({ name, email, course });
  logger.info(`Created new student with ID ${id}`);
  return { id, name, email, course };
};

const updateStudent = async (id, { name, email, course }) => {
  const rowsAffected = await db("students")
    .where({ id })
    .update({ name, email, course });

  logger.info(`Updated student with ID ${id}`);
  return rowsAffected > 0 ? { id, name, email, course } : null;
};

const deleteStudent = async (id) => {
  const rowsAffected = await db("students").where({ id }).del();
  logger.info(`Deleted student with ID ${id}`);
  return rowsAffected > 0;
};

const getStudentByEmail = async (email) => {
  const student = await db("students").where({ email }).first();
  logger.info("Fetched student by email.");
  return student;
};

getStudentByEmail;
module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentByEmail,
};
