const mongoose = require("mongoose");
const Faculty = require("../../models/Faculty");
const User = require("../../models/User");

const validateId = (id, name = "ID") => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error(`Invalid ${name}`);
        error.statusCode = 400;
        throw error;
    }
};

const verifyInstitute = (user) => {
    if (!user.instituteId) {
        const error = new Error("Institute is not linked to this account");
        error.statusCode = 403;
        throw error;
    }
};

const verifyFacultyAccess = async (facultyId, user) => {
    validateId(facultyId, "faculty ID");

    const faculty = await Faculty.findById(facultyId);

    if (!faculty) {
        const error = new Error("Faculty not found");
        error.statusCode = 404;
        throw error;
    }

    if (user.role === "admin") {
        return faculty;
    }

    if (user.role === "institute") {
        verifyInstitute(user);

        if (faculty.instituteId.toString() !== user.instituteId.toString()) {
            const error = new Error("Access denied");
            error.statusCode = 403;
            throw error;
        }

        return faculty;
    }

    const error = new Error("Access denied");
    error.statusCode = 403;
    throw error;
};

// ---------- FACULTY ----------

const createFaculty = async (data, user) => {
    if (user.role !== "admin" && user.role !== "institute") {
        const error = new Error("Access denied");
        error.statusCode = 403;
        throw error;
    }

    verifyInstitute(user);

    validateId(data.userId, "user ID");

    const facultyUser = await User.findById(data.userId);

    if (!facultyUser) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    if (facultyUser.role !== "institute") {
        const error = new Error(
            "Faculty user must have institute role"
        );
        error.statusCode = 400;
        throw error;
    }

    if (!facultyUser.instituteId) {
        const error = new Error(
            "Faculty user is not linked to an institute"
        );
        error.statusCode = 400;
        throw error;
    }

    if (
        user.role === "institute" &&
        facultyUser.instituteId.toString() !== user.instituteId.toString()
    ) {
        const error = new Error("Faculty user belongs to another institute");
        error.statusCode = 403;
        throw error;
    }

    const existingFaculty = await Faculty.findOne({
        userId: data.userId
    });

    if (existingFaculty) {
        const error = new Error("Faculty profile already exists");
        error.statusCode = 409;
        throw error;
    }

    const faculty = await Faculty.create({
        ...data,
        instituteId: facultyUser.instituteId
    });

    return faculty;
};

const getFaculties = async (user) => {
    if (user.role === "admin") {
        return await Faculty.find()
            .populate("userId", "name email role")
            .populate("instituteId", "name");
    }

    if (user.role === "institute") {
        verifyInstitute(user);

        return await Faculty.find({
            instituteId: user.instituteId
        })
            .populate("userId", "name email role")
            .populate("instituteId", "name");
    }

    const error = new Error("Access denied");
    error.statusCode = 403;
    throw error;
};

const getFacultyById = async (facultyId, user) => {
    const faculty = await verifyFacultyAccess(facultyId, user);

    return await Faculty.findById(faculty._id)
        .populate("userId", "name email role")
        .populate("instituteId", "name");
};

const updateFaculty = async (facultyId, data, user) => {
    const faculty = await verifyFacultyAccess(facultyId, user);

    // Prevent changing ownership relationships
    delete data.userId;
    delete data.instituteId;

    const updatedFaculty = await Faculty.findByIdAndUpdate(
        faculty._id,
        data,
        {
            new: true,
            runValidators: true
        }
    )
        .populate("userId", "name email role")
        .populate("instituteId", "name");

    return updatedFaculty;
};

const deleteFaculty = async (facultyId, user) => {
    const faculty = await verifyFacultyAccess(facultyId, user);

    await Faculty.findByIdAndDelete(faculty._id);

    return faculty;
};

module.exports = {
    createFaculty,
    getFaculties,
    getFacultyById,
    updateFaculty,
    deleteFaculty
};