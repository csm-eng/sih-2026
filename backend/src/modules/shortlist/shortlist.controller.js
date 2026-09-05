const shortlistService = require("./shortlist.service");

const calculateMatch = async (req, res, next) => {
    try {
        const result = await shortlistService.calculateMatch(
            req.params.studentId,
            req.params.opportunityId
        );

        res.status(200).json({
            success: true,
            message: "Opportunity match calculated successfully",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

const getStudentMatches = async (req, res, next) => {
    try {
        const matches = await shortlistService.getStudentMatches(
            req.params.studentId
        );

        res.status(200).json({
            success: true,
            message: "Student opportunity matches fetched successfully",
            data: matches
        });
    } catch (error) {
        next(error);
    }
};

const getOpportunityMatches = async (req, res, next) => {
    try {
        const matches = await shortlistService.getOpportunityMatches(
            req.params.opportunityId
        );

        res.status(200).json({
            success: true,
            message: "Opportunity student matches fetched successfully",
            data: matches
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    calculateMatch,
    getStudentMatches,
    getOpportunityMatches
};