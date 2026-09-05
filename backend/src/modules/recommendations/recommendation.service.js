const mongoose = require("mongoose");

const Recommendation = require("../../models/Recommendation");
const Student = require("../../models/student");
const Skill = require("../../models/Skill");
const SkillGap = require("../../models/SkillGap");

const validateId = (id, fieldName) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error(`Invalid ${fieldName}`);
        error.statusCode = 400;
        throw error;
    }
};

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

// Create recommendation manually
const createRecommendation = async (data, user) => {
    validateId(data.studentId, "student ID");
    validateId(data.skillId, "skill ID");

    const student = await Student.findById(data.studentId);

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
                "You are not authorized to create this recommendation"
            );
            error.statusCode = 403;
            throw error;
        }
    }

    if (user.role === "institute") {
        await verifyStudentBelongsToInstitute(
            user.instituteId,
            data.studentId
        );
    }

    if (!["student", "institute", "admin"].includes(user.role)) {
        const error = new Error("Access denied");
        error.statusCode = 403;
        throw error;
    }

    const skill = await Skill.findById(data.skillId);

    if (!skill) {
        const error = new Error("Skill not found");
        error.statusCode = 404;
        throw error;
    }

    return await Recommendation.create(data);
};

// Get recommendations
const getAllRecommendations = async (user) => {
    if (user.role === "admin") {
        return await Recommendation.find()
            .populate("studentId", "name email department year")
            .populate("skillId", "name category description")
            .sort({ priority: -1, createdAt: -1 });
    }

    if (user.role === "institute") {
        const students = await Student.find({
            instituteId: user.instituteId
        }).select("_id");

        const studentIds = students.map(
            (student) => student._id
        );

        return await Recommendation.find({
            studentId: { $in: studentIds }
        })
            .populate("studentId", "name email department year")
            .populate("skillId", "name category description")
            .sort({ priority: -1, createdAt: -1 });
    }

    if (user.role === "student") {
        return await Recommendation.find({
            studentId: user.studentId
        })
            .populate("skillId", "name category description")
            .sort({ priority: -1, createdAt: -1 });
    }

    const error = new Error("Access denied");
    error.statusCode = 403;
    throw error;
};

// Get one recommendation
const getRecommendationById = async (id, user) => {
    validateId(id, "recommendation ID");

    const recommendation = await Recommendation.findById(id)
        .populate("studentId", "name email department year")
        .populate("skillId", "name category description");

    if (!recommendation) {
        const error = new Error("Recommendation not found");
        error.statusCode = 404;
        throw error;
    }

    if (user.role === "admin") {
        return recommendation;
    }

    if (user.role === "student") {
        if (
            !user.studentId ||
            recommendation.studentId._id.toString() !==
            user.studentId.toString()
        ) {
            const error = new Error(
                "You are not authorized to access this recommendation"
            );
            error.statusCode = 403;
            throw error;
        }

        return recommendation;
    }

    if (user.role === "institute") {
        await verifyStudentBelongsToInstitute(
            user.instituteId,
            recommendation.studentId._id
        );

        return recommendation;
    }

    const error = new Error("Access denied");
    error.statusCode = 403;
    throw error;
};

// Get recommendations for a student
const getStudentRecommendations = async (studentId, user) => {
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
                "You are not authorized to access these recommendations"
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

    return await Recommendation.find({ studentId })
        .populate("skillId", "name category description")
        .sort({ priority: -1, createdAt: -1 });
};

// Generate recommendation from skill gap
const generateRecommendation = async (studentId, skillId, user) => {
    validateId(studentId, "student ID");
    validateId(skillId, "skill ID");

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
                "You are not authorized to generate this recommendation"
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

    if (!["student", "institute", "admin"].includes(user.role)) {
        const error = new Error("Access denied");
        error.statusCode = 403;
        throw error;
    }

    const skillGap = await SkillGap.findOne({
        studentId,
        skillId
    }).populate("skillId", "name category description");

    if (!skillGap) {
        const error = new Error(
            "Skill gap not found. Calculate the skill gap first."
        );
        error.statusCode = 404;
        throw error;
    }

    if (skillGap.gap === 0) {
        return {
            message:
                "No recommendation required. Student has reached the required skill level.",
            skillGap
        };
    }

    // Check whether a recommendation already exists
    const existingRecommendation = await Recommendation.findOne({
        studentId,
        skillId
    })
        .populate("studentId", "name email department year")
        .populate("skillId", "name category description");

    if (existingRecommendation) {
        return existingRecommendation;
    }

    let type;
    let title;
    let description;

    if (skillGap.gap >= 2) {
        type = "course";

        title = `Improve ${skillGap.skillId.name} through structured learning`;

        description = `Complete a structured course to improve ${skillGap.skillId.name} from level ${skillGap.currentLevel} to level ${skillGap.requiredLevel}.`;
    } else {
        type = "project";

        title = `Build a project using ${skillGap.skillId.name}`;

        description = `Build a practical project to strengthen your ${skillGap.skillId.name} skills.`;
    }

    const recommendation = await Recommendation.create({
        studentId,
        skillId,
        type,
        title,
        description,
        reason: `${skillGap.skillId.name} has a skill gap of ${skillGap.gap} level(s).`,
        priority: skillGap.priority,
        completed: false
    });

    return await Recommendation.findById(recommendation._id)
        .populate("studentId", "name email department year")
        .populate("skillId", "name category description");
};

// Update recommendation
const updateRecommendation = async (id, data, user) => {
    validateId(id, "recommendation ID");

    const recommendation = await Recommendation.findById(id);

    if (!recommendation) {
        const error = new Error("Recommendation not found");
        error.statusCode = 404;
        throw error;
    }

    if (user.role === "student") {
        if (
            !user.studentId ||
            recommendation.studentId.toString() !==
            user.studentId.toString()
        ) {
            const error = new Error(
                "You are not authorized to update this recommendation"
            );
            error.statusCode = 403;
            throw error;
        }
    }

    if (user.role === "institute") {
        await verifyStudentBelongsToInstitute(
            user.instituteId,
            recommendation.studentId
        );
    }

    if (!["student", "institute", "admin"].includes(user.role)) {
        const error = new Error("Access denied");
        error.statusCode = 403;
        throw error;
    }

    // Prevent changing ownership
    delete data._id;
    delete data.studentId;
    delete data.skillId;

    return await Recommendation.findByIdAndUpdate(
        id,
        data,
        {
            new: true,
            runValidators: true
        }
    )
        .populate("studentId", "name email department year")
        .populate("skillId", "name category description");
};

// Delete recommendation
const deleteRecommendation = async (id, user) => {
    validateId(id, "recommendation ID");

    if (user.role !== "admin") {
        const error = new Error(
            "Only admin can delete recommendations"
        );
        error.statusCode = 403;
        throw error;
    }

    const recommendation = await Recommendation.findById(id);

    if (!recommendation) {
        const error = new Error("Recommendation not found");
        error.statusCode = 404;
        throw error;
    }

    await Recommendation.findByIdAndDelete(id);

    return recommendation;
};

module.exports = {
    createRecommendation,
    getAllRecommendations,
    getRecommendationById,
    getStudentRecommendations,
    generateRecommendation,
    updateRecommendation,
    deleteRecommendation
};