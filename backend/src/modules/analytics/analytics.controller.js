const analyticsService = require("./analytics.service");

const getSkillAnalytics = async (req, res, next) => {
    try {
        const analytics = await analyticsService.getSkillAnalytics(
            req.user
        );

        res.status(200).json({
            success: true,
            data: analytics
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getSkillAnalytics
};