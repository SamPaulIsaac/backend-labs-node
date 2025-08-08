// controllers/studentController.js
const studentModel = require("../models/studentModel");
const sendResponse = require("../utils/sendResponse");
const EntityNotFoundError = require("../utils/EntityNotFoundError");
const ValidationError = require("../utils/ValidationError");

// Middleware or inline role checks can be added to routes instead for cleaner code

exports.getAll = async (req, res, next) => {
  try {
    // Only admin and advisor allowed
    if (!["admin", "advisor"].includes(req.user.role)) {
      return sendResponse(res, 403, "Access denied");
    }

    const students = await studentModel.getAllStudents();
    sendResponse(res, 200, "Students fetched successfully", students);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const studentId = Number(req.params.id);

    // Student role can only view own profile
    if (req.user.role === "student" && req.user.id !== studentId) {
      return sendResponse(res, 403, "You can only view your own profile");
    }

    // Admin and advisor can view any student
    const student = await studentModel.getStudentByUserId(studentId);
    if (!student) {
      throw new EntityNotFoundError(`Student not found for ID: ${studentId}`);
    }
    sendResponse(res, 200, "Student fetched", student);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    // Only admin and advisor can create student profiles
    if (!["admin", "advisor"].includes(req.user.role)) {
      return sendResponse(res, 403, "Access denied");
    }

    const { user_id, course } = req.body;

    if (!user_id || !course?.trim()) {
      throw new ValidationError("User ID and course are required");
    }

    // Check if profile already exists for user
    const existing = await studentModel.getStudentByUserId(user_id);
    if (existing) {
      throw new ValidationError("Student profile already exists for this user");
    }

    const newStudent = await studentModel.createStudent({
      user_id,
      course: course.trim(),
    });

    sendResponse(res, 201, "Student profile created", newStudent);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const studentId = Number(req.params.id);

    // Student can only update their own profile
    if (req.user.role === "student" && req.user.id !== studentId) {
      return sendResponse(res, 403, "You can only update your own profile");
    }

    // Admin and advisor can update any student profile
    if (!["admin", "advisor", "student"].includes(req.user.role)) {
      return sendResponse(res, 403, "Access denied");
    }

    const { course } = req.body;

    if (!course?.trim()) {
      throw new ValidationError("Course is required");
    }

    const existingStudent = await studentModel.getStudentByUserId(studentId);
    if (!existingStudent) {
      throw new EntityNotFoundError(`Student not found for ID: ${studentId}`);
    }

    const updatedStudent = await studentModel.updateStudent(
      existingStudent.id,
      {
        course: course.trim(),
      }
    );

    sendResponse(res, 200, "Student profile updated", updatedStudent);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    // Only admin can delete student profiles
    if (req.user.role !== "admin") {
      return sendResponse(res, 403, "Access denied");
    }

    const studentId = Number(req.params.id);

    const existing = await studentModel.getStudentByUserId(studentId);
    if (!existing) {
      throw new EntityNotFoundError(`Student not found for ID: ${studentId}`);
    }

    await studentModel.deleteStudent(existing.id);
    sendResponse(res, 200, "Student profile deleted");
  } catch (err) {
    next(err);
  }
};
