const mongoose = require("mongoose");

const SkillProfile = require("../../models/SkillProfile");
const Student = require("../../models/student");
const Skill = require("../../models/Skill");

const validateId = (id, fieldName) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error(`Invalid ${fieldName}`);
        error.statusCode = 400;
        throw error;
    }
};

// Check whether a student belongs to the logged-in institute
const verifyStudentBelongsToInstitute = async (instituteId, studentId) => {
    validateId(instituteId, "institute ID");
    validateId(studentId, "student ID");

    const student = await Student.findOne({
        _id: studentId,
        instituteId
    });

    if (!student) {
        const error = new Error(
            "Student does not belong to your institute"
        );
        error.statusCode = 403;
        throw error;
    }

    return student;
};

// Create skill profile
const createSkillProfile = async (data, user) => {
    validateId(data.studentId, "student ID");
    validateId(data.skillId, "skill ID");

    const student = await Student.findById(data.studentId);

    if (!student) {
        const error = new Error("Student not found");
        error.statusCode = 404;
        throw error;
    }

    // Student can create only their own profile
    if (user.role === "student") {
        if (
            !user.studentId ||
            student._id.toString() !== user.studentId.toString()
        ) {
            const error = new Error(
                "You are not authorized to create this skill profile"
            );
            error.statusCode = 403;
            throw error;
        }
    }

    // Institute can create profiles only for its own students
    if (user.role === "institute") {
        await verifyStudentBelongsToInstitute(
            user.instituteId,
            data.studentId
        );
    }

    const skill = await Skill.findById(data.skillId);

    if (!skill) {
        const error = new Error("Skill not found");
        error.statusCode = 404;
        throw error;
    }

    return await SkillProfile.create(data);
};

// Get all skill profiles
const getAllSkillProfiles = async (user) => {
    if (user.role === "admin") {
        return await SkillProfile.find()
            .populate("studentId", "name email department year")
            .populate("skillId", "name category description")
            .sort({ createdAt: -1 });
    }

    if (user.role === "institute") {
        const students = await Student.find({
            instituteId: user.instituteId
        }).select("_id");

        const studentIds = students.map((student) => student._id);

        return await SkillProfile.find({
            studentId: { $in: studentIds }
        })
            .populate("studentId", "name email department year")
            .populate("skillId", "name category description")
            .sort({ createdAt: -1 });
    }

    if (user.role === "student") {
        return await SkillProfile.find({
            studentId: user.studentId
        })
            .populate("studentId", "name email department year")
            .populate("skillId", "name category description")
            .sort({ createdAt: -1 });
    }

    const error = new Error("Access denied");
    error.statusCode = 403;
    throw error;
};

// Get skill profile by ID
const getSkillProfileById = async (id, user) => {
    validateId(id, "skill profile ID");

    const profile = await SkillProfile.findById(id)
        .populate("studentId", "name email department year")
        .populate("skillId", "name category description");

    if (!profile) {
        const error = new Error("Skill profile not found");
        error.statusCode = 404;
        throw error;
    }

    const studentId = profile.studentId._id;

    if (user.role === "admin") {
        return profile;
    }

    if (user.role === "student") {
        if (
            !user.studentId ||
            studentId.toString() !== user.studentId.toString()
        ) {
            const error = new Error(
                "You are not authorized to access this skill profile"
            );
            error.statusCode = 403;
            throw error;
        }

        return profile;
    }

    if (user.role === "institute") {
        await verifyStudentBelongsToInstitute(
            user.instituteId,
            studentId
        );

        return profile;
    }

    const error = new Error("Access denied");
    error.statusCode = 403;
    throw error;
};

// Get skill profiles of a student
const getStudentSkillProfiles = async (studentId, user) => {
    validateId(studentId, "student ID");

    const student = await Student.findById(studentId);

    if (!student) {
        const error = new Error("Student not found");
        error.statusCode = 404;
        throw error;
    }

    if (user.role === "student") {
        if (
            !user.studentId ||
            student._id.toString() !== user.studentId.toString()
        ) {
            const error = new Error(
                "You are not authorized to access these skill profiles"
            );
            error.statusCode = 403;
            throw error;
        }
    }

    if (user.role === "institute") {
        await verifyStudentBelongsToInstitute(
            user.instituteId,
            studentId
        );
    }

    if (!["admin", "student", "institute"].includes(user.role)) {
        const error = new Error("Access denied");
        error.statusCode = 403;
        throw error;
    }

    return await SkillProfile.find({ studentId })
        .populate("skillId", "name category description")
        .sort({ createdAt: -1 });
};

// Update skill profile
const updateSkillProfile = async (id, data, user) => {
    validateId(id, "skill profile ID");

    const profile = await SkillProfile.findById(id);

    if (!profile) {
        const error = new Error("Skill profile not found");
        error.statusCode = 404;
        throw error;
    }

    if (user.role === "student") {
        if (
            !user.studentId ||
            profile.studentId.toString() !== user.studentId.toString()
        ) {
            const error = new Error(
                "You are not authorized to update this skill profile"
            );
            error.statusCode = 403;
            throw error;
        }
    }

    if (user.role === "institute") {
        await verifyStudentBelongsToInstitute(
            user.instituteId,
            profile.studentId
        );
    }

    if (!["admin", "student", "institute"].includes(user.role)) {
        const error = new Error("Access denied");
        error.statusCode = 403;
        throw error;
    }

    // Prevent changing ownership
    delete data._id;
    delete data.studentId;

    const updatedProfile = await SkillProfile.findByIdAndUpdate(
        id,
        data,
        {
            new: true,
            runValidators: true
        }
    )
        .populate("studentId", "name email department year")
        .populate("skillId", "name category description");

    return updatedProfile;
};

// Delete skill profile
const deleteSkillProfile = async (id, user) => {
    validateId(id, "skill profile ID");

    const profile = await SkillProfile.findById(id);

    if (!profile) {
        const error = new Error("Skill profile not found");
        error.statusCode = 404;
        throw error;
    }

    // Only admin should delete skill profiles
    if (user.role !== "admin") {
        const error = new Error(
            "Only admin can delete skill profiles"
        );
        error.statusCode = 403;
        throw error;
    }

    await SkillProfile.findByIdAndDelete(id);

    return profile;
};

module.exports = {
    createSkillProfile,
    getAllSkillProfiles,
    getSkillProfileById,
    getStudentSkillProfiles,
    updateSkillProfile,
    deleteSkillProfile
};