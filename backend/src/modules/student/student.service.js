const mongoose = require("mongoose");
const Student = require("../../models/student");

const normalizeFields = (data) => {
    const copy = { ...data };

    if (copy.skills && Array.isArray(copy.skills)) {
        copy.skills = copy.skills.map((s) =>
            typeof s === "string"
                ? s
                : s && s.name
                    ? s.name
                    : String(s)
        );
    }

    if (copy.projects && Array.isArray(copy.projects)) {
        copy.projects = copy.projects.map((p) =>
            typeof p === "string"
                ? p
                : p && p.title
                    ? p.title
                    : String(p)
        );
    }

    return copy;
};

const validateId = (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error("Invalid student ID");
        error.statusCode = 400;
        throw error;
    }
};

// CREATE STUDENT
const createStudent = async (studentData) => {
    const normalized = normalizeFields(studentData);

    const student = new Student(normalized);

    return await student.save();
};

// GET ALL STUDENTS
const getAllStudents = async (user) => {
    if (user.role === "admin") {
        return await Student.find();
    }

    if (user.role === "institute") {
        return await Student.find({
            instituteId: user.instituteId
        });
    }

    const error = new Error("Access denied");
    error.statusCode = 403;
    throw error;
};

// GET ONE STUDENT
const getStudentById = async (id, user) => {
    validateId(id);

    const student = await Student.findById(id);

    if (!student) {
        const error = new Error("Student not found");
        error.statusCode = 404;
        throw error;
    }

    // Admin can access any student
    if (user.role === "admin") {
        return student;
    }

    // Student can access only their own record
    if (user.role === "student") {
        if (
            !user.studentId ||
            student._id.toString() !== user.studentId.toString()
        ) {
            const error = new Error(
                "You are not authorized to access this student"
            );
            error.statusCode = 403;
            throw error;
        }

        return student;
    }

    // Institute can access only its own students
    if (user.role === "institute") {
        if (
            !student.instituteId ||
            !user.instituteId ||
            student.instituteId.toString() !==
            user.instituteId.toString()
        ) {
            const error = new Error(
                "You are not authorized to access this student"
            );
            error.statusCode = 403;
            throw error;
        }

        return student;
    }

    const error = new Error("Access denied");
    error.statusCode = 403;
    throw error;
};

// UPDATE STUDENT
const updateStudent = async (id, studentData, user) => {
    validateId(id);

    const student = await Student.findById(id);

    if (!student) {
        const error = new Error("Student not found");
        error.statusCode = 404;
        throw error;
    }

    // Admin can update any student
    if (user.role === "admin") {
        const normalized = normalizeFields(studentData);

        delete normalized._id;
        delete normalized.instituteId;

        return await Student.findByIdAndUpdate(
            id,
            normalized,
            {
                new: true,
                runValidators: true
            }
        );
    }

    // Student can update only their own profile
    if (user.role === "student") {
        if (
            !user.studentId ||
            student._id.toString() !== user.studentId.toString()
        ) {
            const error = new Error(
                "You are not authorized to update this student"
            );
            error.statusCode = 403;
            throw error;
        }

        const normalized = normalizeFields(studentData);

        delete normalized._id;
        delete normalized.instituteId;
        delete normalized.status;

        return await Student.findByIdAndUpdate(
            id,
            normalized,
            {
                new: true,
                runValidators: true
            }
        );
    }

    // Institute can update only its own students
    if (user.role === "institute") {
        if (
            !student.instituteId ||
            !user.instituteId ||
            student.instituteId.toString() !==
            user.instituteId.toString()
        ) {
            const error = new Error(
                "You are not authorized to update this student"
            );
            error.statusCode = 403;
            throw error;
        }

        const normalized = normalizeFields(studentData);

        delete normalized._id;
        delete normalized.instituteId;

        return await Student.findByIdAndUpdate(
            id,
            normalized,
            {
                new: true,
                runValidators: true
            }
        );
    }

    const error = new Error("Access denied");
    error.statusCode = 403;
    throw error;
};

// DELETE STUDENT
const deleteStudent = async (id, user) => {
    validateId(id);

    // Only admin should reach this operation
    if (user.role !== "admin") {
        const error = new Error(
            "You are not authorized to delete students"
        );
        error.statusCode = 403;
        throw error;
    }

    const student = await Student.findByIdAndDelete(id);

    if (!student) {
        const error = new Error("Student not found");
        error.statusCode = 404;
        throw error;
    }

    return student;
};

module.exports = {
    createStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent
};