const mockTestService = require("./mocktest.service");

const startMockTest = async (req, res, next) => {
    try {
        const {
            studentId,
            skillId,
        } = req.body;

        const result =
            await mockTestService.startMockTest(
                studentId,
                skillId,
                req.user
            );

        res.status(201).json({
            success: true,
            message:
                "Mock test started successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const submitMockTest = async (
    req,
    res,
    next
) => {
    try {
        const result =
            await mockTestService.submitMockTest(
                req.params.testId,
                req.body.answers,
                req.user
            );

        res.status(200).json({
            success: true,
            message:
                "Mock test submitted successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const getMockResult = async (
    req,
    res,
    next
) => {
    try {
        const result =
            await mockTestService.getMockResult(
                req.params.resultId,
                req.user
            );

        res.status(200).json({
            success: true,
            message:
                "Mock result fetched successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    startMockTest,
    submitMockTest,
    getMockResult,
};