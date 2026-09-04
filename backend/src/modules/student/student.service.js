const mongoose = require("mongoose");
const Student = require("../../models/Student");


// CREATE STUDENT
const createStudent = async (studentData) => {
    const student = new Student(studentData);

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

    const student = await Student.findByIdAndUpdate(
        id,
        studentData,
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