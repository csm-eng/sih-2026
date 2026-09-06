const mongoose = require("mongoose");
const Student = require("../../models/student");

const normalizeFields = (data) => {
    const copy = { ...data };

    // Skills remain simple strings
    if (copy.skills && Array.isArray(copy.skills)) {
        copy.skills = copy.skills.map((skill) =>
            typeof skill === "string"
                ? skill.trim()
                : skill && skill.name
                    ? String(skill.name).trim()
                    : String(skill).trim()
        );
    }

    // Projects now support both:
    // ["Project 1", "Project 2"]
    // and
    // [{ title, description, technologies, projectUrl }]
    if (copy.projects && Array.isArray(copy.projects)) {
        copy.projects = copy.projects.map((project) => {
            if (typeof project === "string") {
                return {
                    title: project.trim(),
                    description: "",
                    technologies: [],
                    projectUrl: ""
                };
            }

            return {
                title: project?.title ? String(project.title).trim() : "",
                description: project?.description
                    ? String(project.description).trim()
                    : "",
                technologies: Array.isArray(project?.technologies)
                    ? project.technologies.map((tech) => String(tech).trim())
                    : [],
                projectUrl: project?.projectUrl
                    ? String(project.projectUrl).trim()
                    : ""
            };
        });
    }

    // Normalize interests
    if (copy.interests && Array.isArray(copy.interests)) {
        copy.interests = copy.interests.map((interest) =>
            String(interest).trim()
        );
    }

    // Normalize preferred roles
    if (copy.preferredRoles && Array.isArray(copy.preferredRoles)) {
        copy.preferredRoles = copy.preferredRoles.map((role) =>
            String(role).trim()
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

// =====================================================
// CREATE STUDENT
// =====================================================
const createStudent = async (studentData) => {
    const normalized = normalizeFields(studentData);

    const student = new Student(normalized);

    return await student.save();
};

// =====================================================
// GET ALL STUDENTS
// =====================================================
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

// =====================================================
// GET ONE STUDENT
// =====================================================
const getStudentById = async (id, user) => {
    validateId(id);

    const student = await Student.findById(id);

    if (!student) {
        const error = new Error("Student not found");
        error.statusCode = 404;
        throw error;
    }

    // Admin
    if (user.role === "admin") {
        return student;
    }

    // Student → own profile only
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

    // Institute → own students
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

    // Company → candidate profile
    if (user.role === "company") {
        return student;
    }

    const error = new Error("Access denied");
    error.statusCode = 403;
    throw error;
};

// =====================================================
// UPDATE STUDENT PROFILE
// =====================================================
const updateStudent = async (id, studentData, user) => {
    validateId(id);

    const student = await Student.findById(id);

    if (!student) {
        const error = new Error("Student not found");
        error.statusCode = 404;
        throw error;
    }

    const normalized = normalizeFields(studentData);

    // Never allow clients to modify MongoDB ID
    delete normalized._id;

    // =================================================
    // ADMIN
    // =================================================
    if (user.role === "admin") {
        // Institute relationship should be managed separately
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

    // =================================================
    // STUDENT
    // =================================================
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

        // Students cannot change these system-managed fields
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

    // =================================================
    // INSTITUTE
    // =================================================
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

// =====================================================
// DELETE STUDENT
// =====================================================
const deleteStudent = async (id, user) => {
    validateId(id);

    // Only admin can delete complete student accounts
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