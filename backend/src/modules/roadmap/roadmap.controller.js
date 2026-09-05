const roadmapService = require("./roadmap.service");

// ---------- ROADMAP TEMPLATES ----------

const createRoadmap = async (req, res, next) => {
    try {
        // Debug: check what Express receives from Postman


        const roadmap = await roadmapService.createRoadmap(req.body);

        // Debug: check what MongoDB/Mongoose created


        res.status(201).json({
            success: true,
            message: "Roadmap created successfully",
            data: roadmap
        });
    } catch (error) {
        next(error);
    }
};

const getRoadmaps = async (req, res, next) => {
    try {
        const roadmaps = await roadmapService.getRoadmaps();

        res.status(200).json({
            success: true,
            count: roadmaps.length,
            data: roadmaps
        });
    } catch (error) {
        next(error);
    }
};

const getRoadmapById = async (req, res, next) => {
    try {
        const roadmap = await roadmapService.getRoadmapById(req.params.id);

        res.status(200).json({
            success: true,
            data: roadmap
        });
    } catch (error) {
        next(error);
    }
};

const updateRoadmap = async (req, res, next) => {
    try {
        const roadmap = await roadmapService.updateRoadmap(
            req.params.id,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Roadmap updated successfully",
            data: roadmap
        });
    } catch (error) {
        next(error);
    }
};

const deleteRoadmap = async (req, res, next) => {
    try {
        await roadmapService.deleteRoadmap(req.params.id);

        res.status(200).json({
            success: true,
            message: "Roadmap deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

// ---------- ROADMAP PROGRESS ----------

const createProgress = async (req, res, next) => {
    try {
        const progress = await roadmapService.createProgress(
            req.body,
            req.user
        );

        res.status(201).json({
            success: true,
            message: "Roadmap progress saved successfully",
            data: progress
        });
    } catch (error) {
        next(error);
    }
};

const getStudentProgress = async (req, res, next) => {
    try {
        const progress = await roadmapService.getStudentProgress(
            req.params.studentId,
            req.user
        );

        res.status(200).json({
            success: true,
            count: progress.length,
            data: progress
        });
    } catch (error) {
        next(error);
    }
};

const getProgressById = async (req, res, next) => {
    try {
        const progress = await roadmapService.getProgressById(
            req.params.id,
            req.user
        );

        res.status(200).json({
            success: true,
            data: progress
        });
    } catch (error) {
        next(error);
    }
};

const updateProgress = async (req, res, next) => {
    try {
        const progress = await roadmapService.updateProgress(
            req.params.id,
            req.body,
            req.user
        );

        res.status(200).json({
            success: true,
            message: "Roadmap progress updated successfully",
            data: progress
        });
    } catch (error) {
        next(error);
    }
};

const deleteProgress = async (req, res, next) => {
    try {
        await roadmapService.deleteProgress(req.params.id);

        res.status(200).json({
            success: true,
            message: "Roadmap progress deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createRoadmap,
    getRoadmaps,
    getRoadmapById,
    updateRoadmap,
    deleteRoadmap,
    createProgress,
    getStudentProgress,
    getProgressById,
    updateProgress,
    deleteProgress
};