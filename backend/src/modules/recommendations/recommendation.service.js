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

const createRecommendation = async (data) => {
    validateId(data.studentId, "student ID");
    validateId(data.skillId, "skill ID");

    const student = await Student.findById(data.studentId);
    if (!student) {
        const error = new Error("Student not found");
        error.statusCode = 404;
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

const getAllRecommendations = async () => {
    return await Recommendation.find()
        .populate("studentId", "name email department year")
        .populate("skillId", "name category description")
        .sort({ priority: -1, createdAt: -1 });
};

const getRecommendationById = async (id) => {
    validateId(id, "recommendation ID");

    const recommendation = await Recommendation.findById(id)
        .populate("studentId", "name email department year")
        .populate("skillId", "name category description");

    if (!recommendation) {
        const error = new Error("Recommendation not found");
        error.statusCode = 404;
        throw error;
    }

    return recommendation;
};

const getStudentRecommendations = async (studentId) => {
    validateId(studentId, "student ID");

    const student = await Student.findById(studentId);

    if (!student) {
        const error = new Error("Student not found");
        error.statusCode = 404;
        throw error;
    }

    return await Recommendation.find({ studentId })
        .populate("skillId", "name category description")
        .sort({ priority: -1, createdAt: -1 });
};

const generateRecommendation = async (studentId, skillId) => {
    validateId(studentId, "student ID");
    validateId(skillId, "skill ID");

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
            message: "No recommendation required. Student has reached the required skill level.",
            skillGap
        };
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

const updateRecommendation = async (id, data) => {
    validateId(id, "recommendation ID");

    const recommendation = await Recommendation.findByIdAndUpdate(
        id,
        data,
        {
            new: true,
            runValidators: true
        }
    )
        .populate("studentId", "name email department year")
        .populate("skillId", "name category description");

    if (!recommendation) {
        const error = new Error("Recommendation not found");
        error.statusCode = 404;
        throw error;
    }

    return recommendation;
};

const deleteRecommendation = async (id) => {
    validateId(id, "recommendation ID");

    const recommendation =
        await Recommendation.findByIdAndDelete(id);

    if (!recommendation) {
        const error = new Error("Recommendation not found");
        error.statusCode = 404;
        throw error;
    }

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