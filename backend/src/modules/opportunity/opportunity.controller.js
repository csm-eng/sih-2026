const opportunityService = require("./opportunity.service");

const createOpportunity = async (req, res, next) => {
    try {
        const opportunity =
            await opportunityService.createOpportunity(req.body);

        res.status(201).json({
            success: true,
            message: "Opportunity created successfully",
            data: opportunity
        });
    } catch (error) {
        next(error);
    }
};

const getOpportunities = async (req, res, next) => {
    try {
        const opportunities =
            await opportunityService.getAllOpportunities();

        res.status(200).json({
            success: true,
            message: "Opportunities fetched successfully",
            data: opportunities
        });
    } catch (error) {
        next(error);
    }
};

const getOpportunityById = async (req, res, next) => {
    try {
        const opportunity =
            await opportunityService.getOpportunityById(
                req.params.id
            );

        res.status(200).json({
            success: true,
            message: "Opportunity fetched successfully",
            data: opportunity
        });
    } catch (error) {
        next(error);
    }
};

const getCompanyOpportunities = async (req, res, next) => {
    try {
        const opportunities =
            await opportunityService.getCompanyOpportunities(
                req.params.companyId
            );

        res.status(200).json({
            success: true,
            message: "Company opportunities fetched successfully",
            data: opportunities
        });
    } catch (error) {
        next(error);
    }
};

const updateOpportunity = async (req, res, next) => {
    try {
        const opportunity =
            await opportunityService.updateOpportunity(
                req.params.id,
                req.body
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

const deleteOpportunity = async (req, res, next) => {
    try {
        await opportunityService.deleteOpportunity(
            req.params.id
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
    createOpportunity,
    getOpportunities,
    getOpportunityById,
    getCompanyOpportunities,
    updateOpportunity,
    deleteOpportunity
};