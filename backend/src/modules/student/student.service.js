const mongoose = require("mongoose");
const Student = require("../../models/student");


const normalizeFields = (data) => {
    const copy = { ...data };
    if (copy.skills && Array.isArray(copy.skills)) {
        copy.skills = copy.skills.map(s => typeof s === "string" ? s : (s && s.name ? s.name : String(s)));
    }
    if (copy.projects && Array.isArray(copy.projects)) {
        copy.projects = copy.projects.map(p => typeof p === "string" ? p : (p && p.title ? p.title : String(p)));
    }
    return copy;
};

// CREATE STUDENT
const createStudent = async (studentData) => {
    const normalized = normalizeFields(studentData);
    const student = new Student(normalized);

    return await student.save();
};


// GET ALL STUDENTS
const getAllStudents = async () => {
    return await Student.find();
};


// GET ONE STUDENT
const getStudentById = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error("Invalid student ID");
        error.statusCode = 400;
        throw error;
    }

    const student = await Student.findById(id);

    if (!student) {
        const error = new Error("Student not found");
        error.statusCode = 404;
        throw error;
    }

    return student;
};


// UPDATE STUDENT
const updateStudent = async (id, studentData) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error("Invalid student ID");
        error.statusCode = 400;
        throw error;
    }

    const normalized = normalizeFields(studentData);

    const student = await Student.findByIdAndUpdate(
        id,
        normalized,
        {
            new: true,
            runValidators: true
        }
    );

    if (!student) {
        const error = new Error("Student not found");
        error.statusCode = 404;
        throw error;
    }

    return student;
};


// DELETE STUDENT
const deleteStudent = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error("Invalid student ID");
        error.statusCode = 400;
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