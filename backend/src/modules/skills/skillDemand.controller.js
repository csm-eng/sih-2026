const skillDemandService = require("./skillDemand.service");

const createSkillDemand = async (req, res, next) => {
    try {
        const demand = await skillDemandService.createSkillDemand(
            req.body,
            req.user
        );

        res.status(201).json({
            success: true,
            message: "Skill demand created successfully",
            data: demand
        });
    } catch (error) {
        next(error);
    }
};

const getSkillDemands = async (req, res, next) => {
    try {
        const demands = await skillDemandService.getAllSkillDemands();

        res.status(200).json({
            success: true,
            message: "Skill demands fetched successfully",
            data: demands
        });
    } catch (error) {
        next(error);
    }
};

const getSkillDemandById = async (req, res, next) => {
    try {
        const demand = await skillDemandService.getSkillDemandById(
            req.params.id
        );

        res.status(200).json({
            success: true,
            message: "Skill demand fetched successfully",
            data: demand
        });
    } catch (error) {
        next(error);
    }
};

const getSkillDemandsBySkill = async (req, res, next) => {
    try {
        const demands = await skillDemandService.getSkillDemandsBySkill(
            req.params.skillId
        );

        res.status(200).json({
            success: true,
            message: "Skill demands fetched successfully",
            data: demands
        });
    } catch (error) {
        next(error);
    }
};

const updateSkillDemand = async (req, res, next) => {
    try {
        const demand = await skillDemandService.updateSkillDemand(
            req.params.id,
            req.body,
            req.user
        );

        res.status(200).json({
            success: true,
            message: "Skill demand updated successfully",
            data: demand
        });
    } catch (error) {
        next(error);
    }
};

const deleteSkillDemand = async (req, res, next) => {
    try {
        await skillDemandService.deleteSkillDemand(
            req.params.id,
            req.user
        );

        res.status(200).json({
            success: true,
            message: "Skill demand deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createSkillDemand,
    getSkillDemands,
    getSkillDemandById,
    getSkillDemandsBySkill,
    updateSkillDemand,
    deleteSkillDemand
};