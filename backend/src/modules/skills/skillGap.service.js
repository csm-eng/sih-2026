const mongoose = require("mongoose");

const SkillGap = require("../../models/SkillGap");
const SkillProfile = require("../../models/SkillProfile");
const SkillDemand = require("../../models/SkillDemand");
const Student = require("../../models/student");
const Skill = require("../../models/Skill");

const validateId = (id, fieldName) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error(`Invalid ${fieldName}`);
        error.statusCode = 400;
        throw error;
    }
};

const calculatePriority = (gap, demandScore) => {
    if (gap >= 2 && demandScore >= 70) {
        return "high";
    }

    if (gap >= 1 || demandScore >= 40) {
        return "medium";
    }

    return "low";
};

const calculateSkillGap = async (studentId, skillId) => {
    validateId(studentId, "student ID");
    validateId(skillId, "skill ID");

    const student = await Student.findById(studentId);

    if (!student) {
        const error = new Error("Student not found");
        error.statusCode = 404;
        throw error;
    }

    const skill = await Skill.findById(skillId);

    if (!skill) {
        const error = new Error("Skill not found");
        error.statusCode = 404;
        throw error;
    }

    const profile = await SkillProfile.findOne({
        studentId,
        skillId
    });

    if (!profile) {
        const error = new Error("Skill profile not found for this student");
        error.statusCode = 404;
        throw error;
    }

    const demand = await SkillDemand.findOne({
        skillId
    }).sort({ demandScore: -1 });

    if (!demand) {
        const error = new Error("Skill demand not found");
        error.statusCode = 404;
        throw error;
    }

    const currentLevel = profile.level;
    const requiredLevel = demand.requiredLevel;

    const gap = Math.max(requiredLevel - currentLevel, 0);

    const priority = calculatePriority(
        gap,
        demand.demandScore
    );

    const skillGap = await SkillGap.findOneAndUpdate(
        {
            studentId,
            skillId
        },
        {
            studentId,
            skillId,
            currentLevel,
            requiredLevel,
            gap,
            demandScore: demand.demandScore,
            priority
        },
        {
            new: true,
            upsert: true,
            runValidators: true,
            setDefaultsOnInsert: true
        }
    )
        .populate("studentId", "name email department year")
        .populate("skillId", "name category description");

    return skillGap;
};

const getAllSkillGaps = async () => {
    return await SkillGap.find()
        .populate("studentId", "name email department year")
        .populate("skillId", "name category description")
        .sort({ gap: -1, demandScore: -1 });
};

const getSkillGapById = async (id) => {
    validateId(id, "skill gap ID");

    const skillGap = await SkillGap.findById(id)
        .populate("studentId", "name email department year")
        .populate("skillId", "name category description");

    if (!skillGap) {
        const error = new Error("Skill gap not found");
        error.statusCode = 404;
        throw error;
    }

    return skillGap;
};

const getStudentSkillGaps = async (studentId) => {
    validateId(studentId, "student ID");

    const student = await Student.findById(studentId);

    if (!student) {
        const error = new Error("Student not found");
        error.statusCode = 404;
        throw error;
    }

    return await SkillGap.find({ studentId })
        .populate("skillId", "name category description")
        .sort({ gap: -1, demandScore: -1 });
};

const deleteSkillGap = async (id) => {
    validateId(id, "skill gap ID");

    const skillGap = await SkillGap.findByIdAndDelete(id);

    if (!skillGap) {
        const error = new Error("Skill gap not found");
        error.statusCode = 404;
        throw error;
    }

    return skillGap;
};

module.exports = {
    calculateSkillGap,
    getAllSkillGaps,
    getSkillGapById,
    getStudentSkillGaps,
    deleteSkillGap
};