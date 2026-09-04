const mongoose = require("mongoose");

const SkillEvidence = require("../../models/SkillEvidence");
const Student = require("../../models/student");
const Skill = require("../../models/Skill");

const validateId = (id, fieldName) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error(`Invalid ${fieldName}`);
        error.statusCode = 400;
        throw error;
    }
};

const createSkillEvidence = async (data) => {
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

    return await SkillEvidence.create(data);
};

const getAllSkillEvidence = async () => {
    return await SkillEvidence.find()
        .populate("studentId", "name email department year")
        .populate("skillId", "name category description")
        .populate("verifiedBy", "name email role")
        .sort({ createdAt: -1 });
};

const getSkillEvidenceById = async (id) => {
    validateId(id, "skill evidence ID");

    const evidence = await SkillEvidence.findById(id)
        .populate("studentId", "name email department year")
        .populate("skillId", "name category description")
        .populate("verifiedBy", "name email role");

    if (!evidence) {
        const error = new Error("Skill evidence not found");
        error.statusCode = 404;
        throw error;
    }

    return evidence;
};

const getStudentSkillEvidence = async (studentId) => {
    validateId(studentId, "student ID");

    const student = await Student.findById(studentId);

    if (!student) {
        const error = new Error("Student not found");
        error.statusCode = 404;
        throw error;
    }

    return await SkillEvidence.find({ studentId })
        .populate("skillId", "name category description")
        .populate("verifiedBy", "name email role")
        .sort({ createdAt: -1 });
};

const updateSkillEvidence = async (id, data) => {
    validateId(id, "skill evidence ID");

    const evidence = await SkillEvidence.findByIdAndUpdate(
        id,
        data,
        {
            new: true,
            runValidators: true
        }
    )
        .populate("studentId", "name email department year")
        .populate("skillId", "name category description")
        .populate("verifiedBy", "name email role");

    if (!evidence) {
        const error = new Error("Skill evidence not found");
        error.statusCode = 404;
        throw error;
    }

    return evidence;
};

const deleteSkillEvidence = async (id) => {
    validateId(id, "skill evidence ID");

    const evidence = await SkillEvidence.findByIdAndDelete(id);

    if (!evidence) {
        const error = new Error("Skill evidence not found");
        error.statusCode = 404;
        throw error;
    }

    return evidence;
};

module.exports = {
    createSkillEvidence,
    getAllSkillEvidence,
    getSkillEvidenceById,
    getStudentSkillEvidence,
    updateSkillEvidence,
    deleteSkillEvidence
};