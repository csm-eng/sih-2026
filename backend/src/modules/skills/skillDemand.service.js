const mongoose = require("mongoose");

const SkillDemand = require("../../models/SkillDemand");
const Skill = require("../../models/Skill");

const validateId = (id, fieldName) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error(`Invalid ${fieldName}`);
        error.statusCode = 400;
        throw error;
    }
};

const createSkillDemand = async (data) => {
    validateId(data.skillId, "skill ID");

    const skill = await Skill.findById(data.skillId);

    if (!skill) {
        const error = new Error("Skill not found");
        error.statusCode = 404;
        throw error;
    }

    return await SkillDemand.create(data);
};

const getAllSkillDemands = async () => {
    return await SkillDemand.find()
        .populate("skillId", "name category description")
        .sort({ demandScore: -1, createdAt: -1 });
};

const getSkillDemandById = async (id) => {
    validateId(id, "skill demand ID");

    const demand = await SkillDemand.findById(id)
        .populate("skillId", "name category description");

    if (!demand) {
        const error = new Error("Skill demand not found");
        error.statusCode = 404;
        throw error;
    }

    return demand;
};

const getSkillDemandsBySkill = async (skillId) => {
    validateId(skillId, "skill ID");

    const skill = await Skill.findById(skillId);

    if (!skill) {
        const error = new Error("Skill not found");
        error.statusCode = 404;
        throw error;
    }

    return await SkillDemand.find({ skillId })
        .populate("skillId", "name category description")
        .sort({ demandScore: -1, createdAt: -1 });
};

const updateSkillDemand = async (id, data) => {
    validateId(id, "skill demand ID");

    const demand = await SkillDemand.findByIdAndUpdate(
        id,
        data,
        {
            new: true,
            runValidators: true
        }
    ).populate("skillId", "name category description");

    if (!demand) {
        const error = new Error("Skill demand not found");
        error.statusCode = 404;
        throw error;
    }

    return demand;
};

const deleteSkillDemand = async (id) => {
    validateId(id, "skill demand ID");

    const demand = await SkillDemand.findByIdAndDelete(id);

    if (!demand) {
        const error = new Error("Skill demand not found");
        error.statusCode = 404;
        throw error;
    }

    return demand;
};

module.exports = {
    createSkillDemand,
    getAllSkillDemands,
    getSkillDemandById,
    getSkillDemandsBySkill,
    updateSkillDemand,
    deleteSkillDemand
};