const mongoose = require("mongoose");
const Skill = require("../../models/Skill");

const createSkill = async (skillData) => {
    const skill = new Skill(skillData);
    return await skill.save();
};

const getAllSkills = async () => {
    return await Skill.find().sort({ createdAt: -1 });
};

const getSkillById = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error("Invalid skill ID");
        error.statusCode = 400;
        throw error;
    }

    const skill = await Skill.findById(id);

    if (!skill) {
        const error = new Error("Skill not found");
        error.statusCode = 404;
        throw error;
    }

    return skill;
};

const updateSkill = async (id, skillData) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error("Invalid skill ID");
        error.statusCode = 400;
        throw error;
    }

    const skill = await Skill.findByIdAndUpdate(
        id,
        skillData,
        {
            new: true,
            runValidators: true
        }
    );

    if (!skill) {
        const error = new Error("Skill not found");
        error.statusCode = 404;
        throw error;
    }

    return skill;
};

const deleteSkill = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error("Invalid skill ID");
        error.statusCode = 400;
        throw error;
    }

    const skill = await Skill.findByIdAndDelete(id);

    if (!skill) {
        const error = new Error("Skill not found");
        error.statusCode = 404;
        throw error;
    }

    return skill;
};

module.exports = {
    createSkill,
    getAllSkills,
    getSkillById,
    updateSkill,
    deleteSkill
};