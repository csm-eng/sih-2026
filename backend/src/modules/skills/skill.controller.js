const skillService = require("./skill.service");


// CREATE SKILL
const createSkill = async (req, res) => {
    try {
        console.log("Received skill:", req.body);

        const skill = await skillService.createSkill(req.body);

        res.status(201).json({
            message: "Skill created successfully",
            data: skill
        });

    } catch (error) {
        console.error("Create skill error:", error);

        if (error.code === 11000) {
            return res.status(400).json({
                message: "Skill already exists"
            });
        }

        res.status(error.statusCode || 500).json({
            message: error.message
        });
    }
};


// GET ALL SKILLS
const getSkills = async (req, res) => {
    try {
        const skills = await skillService.getAllSkills();

        res.status(200).json({
            message: "Skills fetched successfully",
            data: skills
        });

    } catch (error) {
        console.error("Get skills error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};


// GET ONE SKILL
const getSkillById = async (req, res) => {
    try {
        const skill = await skillService.getSkillById(
            req.params.id
        );

        res.status(200).json({
            message: "Skill fetched successfully",
            data: skill
        });

    } catch (error) {
        console.error("Get skill error:", error);

        res.status(error.statusCode || 500).json({
            message: error.message
        });
    }
};


// UPDATE SKILL
const updateSkill = async (req, res) => {
    try {
        const skill = await skillService.updateSkill(
            req.params.id,
            req.body
        );

        res.status(200).json({
            message: "Skill updated successfully",
            data: skill
        });

    } catch (error) {
        console.error("Update skill error:", error);

        res.status(error.statusCode || 500).json({
            message: error.message
        });
    }
};


// DELETE SKILL
const deleteSkill = async (req, res) => {
    try {
        await skillService.deleteSkill(req.params.id);

        res.status(200).json({
            message: "Skill deleted successfully"
        });

    } catch (error) {
        console.error("Delete skill error:", error);

        res.status(error.statusCode || 500).json({
            message: error.message
        });
    }
};


module.exports = {
    createSkill,
    getSkills,
    getSkillById,
    updateSkill,
    deleteSkill
};