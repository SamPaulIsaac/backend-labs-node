// controllers/studentController.js
const studentModel = require("../models/studentModel");
const sendResponse = require("../utils/sendResponse");
const EntityNotFoundError = require("../utils/EntityNotFoundError");
const ValidationError = require("../utils/ValidationError");

exports.getAll = async (req, res, next) => {
  try {
    const students = await studentModel.getAllStudents();
    sendResponse(res, 200, "Students fetched successfully", students);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const student = await studentModel.getStudentById(req.params.id);
    if (!student) {
      throw new EntityNotFoundError(
        `Student not found for ID: ${req.params.id}`
      );
    }
    sendResponse(res, 200, "Student fetched", student);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { name, email, course } = req.body;

    if (!name?.trim() || !email?.trim() || !course?.trim()) {
      throw new ValidationError("All fields are required");
    }

    const existing = await studentModel.getStudentByEmail(email.trim());
    if (existing) {
      throw new ValidationError("Student with this email already exists");
    }

    const newStudent = await studentModel.createStudent({
      name: name.trim(),
      email: email.trim(),
      course: course.trim(),
    });

    sendResponse(res, 201, "Student created", newStudent);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { name, email, course } = req.body;

    if (!name?.trim() || !email?.trim() || !course?.trim()) {
      throw new ValidationError("All fields are required");
    }

    const existingStudent = await studentModel.getStudentById(req.params.id);
    if (!existingStudent) {
      throw new EntityNotFoundError(
        `Student not found for ID: ${req.params.id}`
      );
    }

    // Check email uniqueness excluding current student
    const emailOwner = await studentModel.getStudentByEmail(email.trim());
    if (emailOwner && emailOwner.id !== Number(req.params.id)) {
      throw new ValidationError("Email is already in use by another student");
    }

    const updatedStudent = await studentModel.updateStudent(req.params.id, {
      name: name.trim(),
      email: email.trim(),
      course: course.trim(),
    });

    sendResponse(res, 200, "Student updated", updatedStudent);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const existing = await studentModel.getStudentById(req.params.id);
    if (!existing) {
      throw new EntityNotFoundError(
        `Student not found for ID: ${req.params.id}`
      );
    }

    await studentModel.deleteStudent(req.params.id);
    sendResponse(res, 200, "Student deleted");
  } catch (err) {
    next(err);
  }
};
