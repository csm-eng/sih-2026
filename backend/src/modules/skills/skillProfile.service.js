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

const createSkillProfile = async (data) => {
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

    return await SkillProfile.create(data);
};

const getAllSkillProfiles = async () => {
    return await SkillProfile.find()
        .populate("studentId", "name email department year")
        .populate("skillId", "name category description")
        .sort({ createdAt: -1 });
};

const getSkillProfileById = async (id) => {
    validateId(id, "skill profile ID");

    const profile = await SkillProfile.findById(id)
        .populate("studentId", "name email department year")
        .populate("skillId", "name category description");

    if (!profile) {
        const error = new Error("Skill profile not found");
        error.statusCode = 404;
        throw error;
    }

    return profile;
};

const getStudentSkillProfiles = async (studentId) => {
    validateId(studentId, "student ID");

    const student = await Student.findById(studentId);

    if (!student) {
        const error = new Error("Student not found");
        error.statusCode = 404;
        throw error;
    }

    return await SkillProfile.find({ studentId })
        .populate("skillId", "name category description")
        .sort({ createdAt: -1 });
};

const updateSkillProfile = async (id, data) => {
    validateId(id, "skill profile ID");

    const profile = await SkillProfile.findByIdAndUpdate(
        id,
        data,
        {
            new: true,
            runValidators: true
        }
    )
        .populate("studentId", "name email department year")
        .populate("skillId", "name category description");

    if (!profile) {
        const error = new Error("Skill profile not found");
        error.statusCode = 404;
        throw error;
    }

    return profile;
};

const deleteSkillProfile = async (id) => {
    validateId(id, "skill profile ID");

    const profile = await SkillProfile.findByIdAndDelete(id);

    if (!profile) {
        const error = new Error("Skill profile not found");
        error.statusCode = 404;
        throw error;
    }

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