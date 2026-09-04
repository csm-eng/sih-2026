const instituteService = require("./institute.service");

// Get institute dashboard
const getDashboard = async (req, res, next) => {
    try {
        const data = await instituteService.getDashboard(req.user);

        res.status(200).json({
            success: true,
            message: "Institute dashboard fetched successfully",
            data,
        });
    } catch (error) {
        next(error);
    }
};

// Get all students belonging to institute
const getStudents = async (req, res, next) => {
    try {
        const data = await instituteService.getStudents(req.user);

        res.status(200).json({
            success: true,
            message: "Students fetched successfully",
            data,
        });
    } catch (error) {
        next(error);
    }
};

// Get individual student
const getStudentDetails = async (req, res, next) => {
    try {
        const { studentId } = req.params;

        const data = await instituteService.getStudentDetails(
            req.user,
            studentId
        );

        res.status(200).json({
            success: true,
            message: "Student details fetched successfully",
            data,
        });
    } catch (error) {
        next(error);
    }
};

// Get student's roadmap
const getStudentRoadmap = async (req, res, next) => {
    try {
        const { studentId } = req.params;

        const data = await instituteService.getStudentRoadmap(
            req.user,
            studentId
        );

        res.status(200).json({
            success: true,
            message: "Student roadmap fetched successfully",
            data,
        });
    } catch (error) {
        next(error);
    }
};

// Get student's overall performance
const getStudentPerformance = async (req, res, next) => {
    try {
        const { studentId } = req.params;

        const data = await instituteService.getStudentPerformance(
            req.user,
            studentId
        );

        res.status(200).json({
            success: true,
            message: "Student performance fetched successfully",
            data,
        });
    } catch (error) {
        next(error);
    }
};

// Get student's mock test results
const getStudentMockResults = async (req, res, next) => {
    try {
        const { studentId } = req.params;

        const data = await instituteService.getStudentMockResults(
            req.user,
            studentId
        );

        res.status(200).json({
            success: true,
            message: "Mock test results fetched successfully",
            data,
        });
    } catch (error) {
        next(error);
    }
};

// Get student's weak areas
const getStudentWeakAreas = async (req, res, next) => {
    try {
        const { studentId } = req.params;

        const data = await instituteService.getStudentWeakAreas(
            req.user,
            studentId
        );

        res.status(200).json({
            success: true,
            message: "Weak areas fetched successfully",
            data,
        });
    } catch (error) {
        next(error);
    }
};

// Create intervention
const createIntervention = async (req, res, next) => {
    try {
        const { studentId } = req.params;

        const data = await instituteService.createIntervention(
            req.user,
            studentId,
            req.body
        );

        res.status(201).json({
            success: true,
            message: "Intervention created successfully",
            data,
        });
    } catch (error) {
        next(error);
    }
};

// Get interventions
const getStudentInterventions = async (req, res, next) => {
    try {
        const { studentId } = req.params;

        const data = await instituteService.getStudentInterventions(
            req.user,
            studentId
        );

        res.status(200).json({
            success: true,
            message: "Interventions fetched successfully",
            data,
        });
    } catch (error) {
        next(error);
    }
};

// Update intervention
const updateIntervention = async (req, res, next) => {
    try {
        const { interventionId } = req.params;

        const data = await instituteService.updateIntervention(
            req.user,
            interventionId,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Intervention updated successfully",
            data,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getDashboard,
    getStudents,
    getStudentDetails,
    getStudentRoadmap,
    getStudentPerformance,
    getStudentMockResults,
    getStudentWeakAreas,
    createIntervention,
    getStudentInterventions,
    updateIntervention,
};