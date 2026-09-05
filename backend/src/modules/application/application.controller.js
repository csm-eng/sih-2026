const applicationService = require("./application.service");

// Create application
const createApplication = async (req, res, next) => {
    try {
        const application = await applicationService.createApplication(
            req.body,
            req.user.studentId
        );

        res.status(201).json({
            success: true,
            message: "Application submitted successfully",
            data: application
        });
    } catch (error) {
        next(error);
    }
};

// Get all applications
const getApplications = async (req, res, next) => {
    try {
        const applications =
            await applicationService.getAllApplications();

        res.status(200).json({
            success: true,
            message: "Applications fetched successfully",
            data: applications
        });
    } catch (error) {
        next(error);
    }
};

// Get application by ID
const getApplicationById = async (req, res, next) => {
    try {
        const application =
            await applicationService.getApplicationById(
                req.params.id,
                req.user
            );

        res.status(200).json({
            success: true,
            message: "Application fetched successfully",
            data: application
        });
    } catch (error) {
        next(error);
    }
};

// Get student's applications
const getStudentApplications = async (req, res, next) => {
    try {
        const applications =
            await applicationService.getStudentApplications(
                req.params.studentId,
                req.user.studentId
            );

        res.status(200).json({
            success: true,
            message: "Student applications fetched successfully",
            data: applications
        });
    } catch (error) {
        next(error);
    }
};

// Get applications for company's opportunity
const getOpportunityApplications = async (req, res, next) => {
    try {
        const applications =
            await applicationService.getOpportunityApplications(
                req.params.opportunityId,
                req.user.companyId
            );

        res.status(200).json({
            success: true,
            message: "Opportunity applications fetched successfully",
            data: applications
        });
    } catch (error) {
        next(error);
    }
};

// Update application status
const updateApplicationStatus = async (req, res, next) => {
    try {
        const application =
            await applicationService.updateApplicationStatus(
                req.params.id,
                req.body.status,
                req.user.companyId
            );

        res.status(200).json({
            success: true,
            message: "Application status updated successfully",
            data: application
        });
    } catch (error) {
        next(error);
    }
};

// Delete application
const deleteApplication = async (req, res, next) => {
    try {
        await applicationService.deleteApplication(
            req.params.id,
            req.user
        );

        res.status(200).json({
            success: true,
            message: "Application deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createApplication,
    getApplications,
    getApplicationById,
    getStudentApplications,
    getOpportunityApplications,
    updateApplicationStatus,
    deleteApplication
};