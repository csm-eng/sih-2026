const studentService = require("./student.service");


// CREATE STUDENT
const createStudent = async (req, res) => {
    try {
        console.log("Received student:", req.body);

        const student = await studentService.createStudent(req.body);

        res.status(201).json({
            message: "Student created successfully",
            data: student
        });

    } catch (error) {
        console.error("Create student error:", error);

        if (error.code === 11000) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        res.status(error.statusCode || 500).json({
            message: error.message
        });
    }
};


// GET ALL STUDENTS
const getStudents = async (req, res) => {
    try {
        const students = await studentService.getAllStudents();

        res.status(200).json({
            message: "Students fetched successfully",
            data: students
        });

    } catch (error) {
        console.error("Get students error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};


// GET ONE STUDENT
const getStudentById = async (req, res) => {
    try {
        const student = await studentService.getStudentById(
            req.params.id
        );

        res.status(200).json({
            message: "Student fetched successfully",
            data: student
        });

    } catch (error) {
        console.error("Get student error:", error);

        res.status(error.statusCode || 500).json({
            message: error.message
        });
    }
};


// UPDATE STUDENT
const updateStudent = async (req, res) => {
    try {
        const student = await studentService.updateStudent(
            req.params.id,
            req.body
        );

        res.status(200).json({
            message: "Student updated successfully",
            data: student
        });

    } catch (error) {
        console.error("Update student error:", error);

        res.status(error.statusCode || 500).json({
            message: error.message
        });
    }
};


// DELETE STUDENT
const deleteStudent = async (req, res) => {
    try {
        await studentService.deleteStudent(req.params.id);

        res.status(200).json({
            message: "Student deleted successfully"
        });

    } catch (error) {
        console.error("Delete student error:", error);

        res.status(error.statusCode || 500).json({
            message: error.message
        });
    }
};


module.exports = {
    createStudent,
    getStudents,
    getStudentById,
    updateStudent,
    deleteStudent
};