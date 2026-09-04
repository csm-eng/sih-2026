const skillEvidenceService = require("./skillEvidence.service");

const createSkillEvidence = async (req, res, next) => {
    try {
        const evidence = await skillEvidenceService.createSkillEvidence(
            req.body
        );

        res.status(201).json({
            success: true,
            message: "Skill evidence created successfully",
            data: evidence
        });
    } catch (error) {
        next(error);
    }
};

const getSkillEvidence = async (req, res, next) => {
    try {
        const evidence = await skillEvidenceService.getAllSkillEvidence();

        res.status(200).json({
            success: true,
            message: "Skill evidence fetched successfully",
            data: evidence
        });
    } catch (error) {
        next(error);
    }
};

const getSkillEvidenceById = async (req, res, next) => {
    try {
        const evidence =
            await skillEvidenceService.getSkillEvidenceById(
                req.params.id
            );

        res.status(200).json({
            success: true,
            message: "Skill evidence fetched successfully",
            data: evidence
        });
    } catch (error) {
        next(error);
    }
};

const getStudentSkillEvidence = async (req, res, next) => {
    try {
        const evidence =
            await skillEvidenceService.getStudentSkillEvidence(
                req.params.studentId
            );

        res.status(200).json({
            success: true,
            message: "Student skill evidence fetched successfully",
            data: evidence
        });
    } catch (error) {
        next(error);
    }
};

const updateSkillEvidence = async (req, res, next) => {
    try {
        const evidence =
            await skillEvidenceService.updateSkillEvidence(
                req.params.id,
                req.body
            );

        res.status(200).json({
            success: true,
            message: "Skill evidence updated successfully",
            data: evidence
        });
    } catch (error) {
        next(error);
    }
};

const deleteSkillEvidence = async (req, res, next) => {
    try {
        await skillEvidenceService.deleteSkillEvidence(req.params.id);

        res.status(200).json({
            success: true,
            message: "Skill evidence deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createSkillEvidence,
    getSkillEvidence,
    getSkillEvidenceById,
    getStudentSkillEvidence,
    updateSkillEvidence,
    deleteSkillEvidence
};