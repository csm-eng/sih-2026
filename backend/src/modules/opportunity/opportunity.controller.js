const {
    createOpportunity,
    getAllOpportunities,
    getOpenOpportunities,
    getOpportunityById,
    getCompanyOpportunities,
    updateOpportunity,
    deleteOpportunity
} = require("./opportunity.service");

// Create opportunity
const createOpportunityController = async (req, res, next) => {
    try {
        const opportunity = await createOpportunity({
            ...req.body,
            companyId: req.user.companyId
        });

        res.status(201).json({
            success: true,
            message: "Opportunity created successfully",
            data: opportunity
        });
    } catch (error) {
        next(error);
    }
};
// Get all opportunities
const getOpportunities = async (req, res, next) => {
    try {
        const opportunities = await getAllOpportunities();

        res.status(200).json({
            success: true,
            count: opportunities.length,
            data: opportunities
        });
    } catch (error) {
        next(error);
    }
};

// Get open opportunities for students
const getOpenOpportunitiesController = async (req, res, next) => {
    try {
        const opportunities = await getOpenOpportunities(
            req.user.studentId
        );

        res.status(200).json({
            success: true,
            count: opportunities.length,
            data: opportunities
        });
    } catch (error) {
        next(error);
    }
};

// Get opportunity by ID
const getOpportunity = async (req, res, next) => {
    try {
        const opportunity = await getOpportunityById(req.params.id);

        res.status(200).json({
            success: true,
            data: opportunity
        });
    } catch (error) {
        next(error);
    }
};

// Get opportunities of a company
const getCompanyOpportunityList = async (req, res, next) => {
    try {
        const opportunities = await getCompanyOpportunities(
            req.params.companyId,
            req.user.companyId
        );

        res.status(200).json({
            success: true,
            count: opportunities.length,
            data: opportunities
        });
    } catch (error) {
        next(error);
    }
};

// Update opportunity
const updateOpportunityController = async (req, res, next) => {
    try {
        const opportunity = await updateOpportunity(
            req.params.id,
            req.body,
            req.user.companyId
        );

        res.status(200).json({
            success: true,
            message: "Opportunity updated successfully",
            data: opportunity
        });
    } catch (error) {
        next(error);
    }
};

// Delete opportunity
const deleteOpportunityController = async (req, res, next) => {
    try {
        await deleteOpportunity(
            req.params.id,
            req.user.companyId
        );

        res.status(200).json({
            success: true,
            message: "Opportunity deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createOpportunityController,
    getOpportunities,
    getOpenOpportunitiesController,
    getOpportunity,
    getCompanyOpportunityList,
    updateOpportunityController,
    deleteOpportunityController
};