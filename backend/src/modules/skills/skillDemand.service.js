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

// Create skill demand
const createSkillDemand = async (data, user) => {
    if (user.role !== "admin") {
        const error = new Error(
            "Only admin can create skill demand records"
        );
        error.statusCode = 403;
        throw error;
    }

    validateId(data.skillId, "skill ID");

    const skill = await Skill.findById(data.skillId);

    if (!skill) {
        const error = new Error("Skill not found");
        error.statusCode = 404;
        throw error;
    }

    return await SkillDemand.create(data);
};

// Get all skill demands
const getAllSkillDemands = async () => {
    return await SkillDemand.find()
        .populate("skillId", "name category description")
        .sort({ demandScore: -1, createdAt: -1 });
};

// Get skill demand by ID
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

// Get demands for a particular skill
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

// Update skill demand
const updateSkillDemand = async (id, data, user) => {
    if (user.role !== "admin") {
        const error = new Error(
            "Only admin can update skill demand records"
        );
        error.statusCode = 403;
        throw error;
    }

    validateId(id, "skill demand ID");

    // Prevent changing the document ID
    delete data._id;

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

// Delete skill demand
const deleteSkillDemand = async (id, user) => {
    if (user.role !== "admin") {
        const error = new Error(
            "Only admin can delete skill demand records"
        );
        error.statusCode = 403;
        throw error;
    }

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