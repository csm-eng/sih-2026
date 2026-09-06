const validateStartMockTest = (
    req,
    res,
    next
) => {
    const {
        studentId,
        skillId,
    } = req.body;

    if (!studentId) {
        return res.status(400).json({
            success: false,
            message:
                "Student ID is required",
        });
    }

    if (!skillId) {
        return res.status(400).json({
            success: false,
            message:
                "Skill ID is required",
        });
    }

    next();
};

const validateSubmitMockTest = (
    req,
    res,
    next
) => {
    if (!Array.isArray(req.body.answers)) {
        return res.status(400).json({
            success: false,
            message:
                "Answers must be an array",
        });
    }

    next();
};

module.exports = {
    validateStartMockTest,
    validateSubmitMockTest,
};