require("../config/env");

const jwt = require("jsonwebtoken");

const generateToken = (user) => {
    return jwt.sign(
        {
            _id: user._id,
            role: user.role,
            instituteId: user.instituteId || null,
            companyId: user.companyId || null,
            studentId: user.studentId || null
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );
};

module.exports = generateToken;