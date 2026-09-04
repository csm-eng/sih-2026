const validateStudent = (req, res, next) => {
    const {
        name,
        email,
        department,
        year
    } = req.body;

    if (!name || !email || !department || year === undefined) {
        return res.status(400).json({
            message: "name, email, department and year are required"
        });
    }

    if (typeof year !== "number" || year < 1 || year > 4) {
        return res.status(400).json({
            message: "Year must be a number between 1 and 4"
        });
    }

    next();
};

module.exports = {
    validateStudent
};