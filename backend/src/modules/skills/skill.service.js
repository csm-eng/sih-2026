const mongoose = require("mongoose");
const Skill = require("../../models/Skill");


// CREATE SKILL
const createSkill = async (skillData) => {
    const skill = new Skill(skillData);

    return await skill.save();
};


// GET ALL SKILLS
const getAllSkills = async () => {
    return await Skill.find();
};


// GET ONE SKILL
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


// UPDATE SKILL
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


// DELETE SKILL
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