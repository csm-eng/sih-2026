const mentorshipService = require("./mentorship.service");

const createMentorship = async (req, res, next) => {
    try {
        const mentorship = await mentorshipService.createMentorship(
            req.body,
            req.user
        );

        res.status(201).json({
            success: true,
            message: "Mentorship request created successfully",
            data: mentorship
        });
    } catch (error) {
        next(error);
    }
};

const getMentorships = async (req, res, next) => {
    try {
        const mentorships =
            await mentorshipService.getMentorships(req.user);

        res.status(200).json({
            success: true,
            count: mentorships.length,
            data: mentorships
        });
    } catch (error) {
        next(error);
    }
};

const getMentorshipById = async (req, res, next) => {
    try {
        const mentorship =
            await mentorshipService.getMentorshipById(
                req.params.id,
                req.user
            );

        res.status(200).json({
            success: true,
            data: mentorship
        });
    } catch (error) {
        next(error);
    }
};

const updateMentorship = async (req, res, next) => {
    try {
        const mentorship =
            await mentorshipService.updateMentorship(
                req.params.id,
                req.body,
                req.user
            );

        res.status(200).json({
            success: true,
            message: "Mentorship updated successfully",
            data: mentorship
        });
    } catch (error) {
        next(error);
    }
};

const deleteMentorship = async (req, res, next) => {
    try {
        await mentorshipService.deleteMentorship(
            req.params.id,
            req.user
        );

        res.status(200).json({
            success: true,
            message: "Mentorship deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createMentorship,
    getMentorships,
    getMentorshipById,
    updateMentorship,
    deleteMentorship
};