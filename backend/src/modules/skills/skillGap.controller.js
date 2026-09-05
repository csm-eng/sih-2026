const skillGapService = require("./skillGap.service");

const calculateSkillGap = async (req, res, next) => {
    try {
        const skillGap = await skillGapService.calculateSkillGap(
            req.params.studentId,
            req.params.skillId,
            req.user
        );

        res.status(200).json({
            success: true,
            message: "Skill gap calculated successfully",
            data: skillGap
        });
    } catch (error) {
        next(error);
    }
};

const getSkillGaps = async (req, res, next) => {
    try {
        const skillGaps = await skillGapService.getAllSkillGaps(
            req.user
        );

        res.status(200).json({
            success: true,
            message: "Skill gaps fetched successfully",
            data: skillGaps
        });
    } catch (error) {
        next(error);
    }
};

const getSkillGapById = async (req, res, next) => {
    try {
        const skillGap = await skillGapService.getSkillGapById(
            req.params.id,
            req.user
        );

        res.status(200).json({
            success: true,
            message: "Skill gap fetched successfully",
            data: skillGap
        });
    } catch (error) {
        next(error);
    }
};

const getStudentSkillGaps = async (req, res, next) => {
    try {
        const skillGaps = await skillGapService.getStudentSkillGaps(
            req.params.studentId,
            req.user
        );

        res.status(200).json({
            success: true,
            message: "Student skill gaps fetched successfully",
            data: skillGaps
        });
    } catch (error) {
        next(error);
    }
};

const deleteSkillGap = async (req, res, next) => {
    try {
        await skillGapService.deleteSkillGap(
            req.params.id,
            req.user
        );

        res.status(200).json({
            success: true,
            message: "Skill gap deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    calculateSkillGap,
    getSkillGaps,
    getSkillGapById,
    getStudentSkillGaps,
    deleteSkillGap
};