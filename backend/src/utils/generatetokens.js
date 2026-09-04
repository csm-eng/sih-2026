const jwt = require("jsonwebtoken");

const generateToken = (user) => {
    return jwt.sign(
        {
            _id: user._id,
            role: user.role,
            instituteId: user.instituteId || null
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );
};

module.exports = generateToken;