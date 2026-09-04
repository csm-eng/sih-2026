const skillService = require("./skill.service");

const createSkill = async (req, res, next) => {
    try {
        console.log("Received skill:", req.body);

        const skill = await skillService.createSkill(req.body);

        res.status(201).json({
            success: true,
            message: "Skill created successfully",
            data: skill
        });
    } catch (error) {
        next(error);
    }
};

const getSkills = async (req, res, next) => {
    try {
        const skills = await skillService.getAllSkills();

        res.status(200).json({
            success: true,
            message: "Skills fetched successfully",
            data: skills
        });
    } catch (error) {
        next(error);
    }
};

const getSkillById = async (req, res, next) => {
    try {
        const skill = await skillService.getSkillById(req.params.id);

        res.status(200).json({
            success: true,
            message: "Skill fetched successfully",
            data: skill
        });
    } catch (error) {
        next(error);
    }
};

const updateSkill = async (req, res, next) => {
    try {
        const skill = await skillService.updateSkill(
            req.params.id,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Skill updated successfully",
            data: skill
        });
    } catch (error) {
        next(error);
    }
};

const deleteSkill = async (req, res, next) => {
    try {
        await skillService.deleteSkill(req.params.id);

        res.status(200).json({
            success: true,
            message: "Skill deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createSkill,
    getSkills,
    getSkillById,
    updateSkill,
    deleteSkill
};