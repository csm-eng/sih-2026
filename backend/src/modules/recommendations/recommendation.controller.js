const recommendationService = require("./recommendation.service");

const createRecommendation = async (req, res, next) => {
    try {
        const recommendation =
            await recommendationService.createRecommendation(
                req.body,
                req.user
            );

        res.status(201).json({
            success: true,
            message: "Recommendation created successfully",
            data: recommendation
        });
    } catch (error) {
        next(error);
    }
};

const getRecommendations = async (req, res, next) => {
    try {
        const recommendations =
            await recommendationService.getAllRecommendations(
                req.user
            );

        res.status(200).json({
            success: true,
            message: "Recommendations fetched successfully",
            data: recommendations
        });
    } catch (error) {
        next(error);
    }
};

const getRecommendationById = async (req, res, next) => {
    try {
        const recommendation =
            await recommendationService.getRecommendationById(
                req.params.id,
                req.user
            );

        res.status(200).json({
            success: true,
            message: "Recommendation fetched successfully",
            data: recommendation
        });
    } catch (error) {
        next(error);
    }
};

const getStudentRecommendations = async (req, res, next) => {
    try {
        const recommendations =
            await recommendationService.getStudentRecommendations(
                req.params.studentId,
                req.user
            );

        res.status(200).json({
            success: true,
            message: "Student recommendations fetched successfully",
            data: recommendations
        });
    } catch (error) {
        next(error);
    }
};

const generateRecommendation = async (req, res, next) => {
    try {
        const recommendation =
            await recommendationService.generateRecommendation(
                req.params.studentId,
                req.params.skillId,
                req.user
            );

        res.status(200).json({
            success: true,
            message: "Recommendation generated successfully",
            data: recommendation
        });
    } catch (error) {
        next(error);
    }
};

const updateRecommendation = async (req, res, next) => {
    try {
        const recommendation =
            await recommendationService.updateRecommendation(
                req.params.id,
                req.body,
                req.user
            );

        res.status(200).json({
            success: true,
            message: "Recommendation updated successfully",
            data: recommendation
        });
    } catch (error) {
        next(error);
    }
};

const deleteRecommendation = async (req, res, next) => {
    try {
        await recommendationService.deleteRecommendation(
            req.params.id,
            req.user
        );

        res.status(200).json({
            success: true,
            message: "Recommendation deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createRecommendation,
    getRecommendations,
    getRecommendationById,
    getStudentRecommendations,
    generateRecommendation,
    updateRecommendation,
    deleteRecommendation
};