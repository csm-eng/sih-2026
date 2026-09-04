const User = require("../../models/User");
const { comparePassword } = require("../../utils/passwords");
const generateToken = require("../../utils/generatetokens");

const login = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    const passwordMatch = await comparePassword(password, user.password);

    if (!passwordMatch) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    const token = generateToken(user);

    return {
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            instituteId: user.instituteId
        }
    };
};

module.exports = {
    login
};