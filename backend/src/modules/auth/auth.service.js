const crypto = require("crypto");

const User = require("../../models/User");
const {
    hashPassword,
    comparePassword
} = require("../../utils/passwords");
const generateToken = require("../../utils/generatetokens");


const login = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    const passwordMatch = await comparePassword(
        password,
        user.password
    );

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
            instituteId: user.instituteId,
            companyId: user.companyId
        }
    };
};


const register = async (
    name,
    email,
    password,
    role = "student"
) => {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        const error = new Error(
            "User with this email already exists"
        );

        error.statusCode = 409;
        throw error;
    }

    const allowedRoles = [
        "student",
        "institute",
        "company"
    ];

    if (!allowedRoles.includes(role)) {
        const error = new Error("Invalid role");

        error.statusCode = 400;
        throw error;
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role
    });

    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    };
};


/*
 * Forgot Password
 *
 * Generates a unique temporary reset token.
 * The token is valid for 15 minutes.
 *
 * For the hackathon demo, we return the reset link
 * instead of sending an actual email.
 */
const forgotPassword = async (email) => {
    const user = await User.findOne({ email });

    /*
     * Do not reveal whether an email exists.
     */
    if (!user) {
        return {
            message:
                "If an account exists for this email, a password reset link has been generated."
        };
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;

    user.resetPasswordExpires =
        new Date(Date.now() + 15 * 60 * 1000);

    await user.save();

    const resetLink =
        `http://localhost:5173/reset-password/${resetToken}`;

    console.log("\n========================================");
    console.log("PASSWORD RESET LINK");
    console.log("========================================");
    console.log(resetLink);
    console.log("========================================\n");

    return {
        message:
            "If an account exists for this email, a password reset link has been generated.",
        resetLink
    };
};


const resetPassword = async (
    resetToken,
    newPassword
) => {
    const user = await User.findOne({
        resetPasswordToken: resetToken,
        resetPasswordExpires: {
            $gt: new Date()
        }
    });

    if (!user) {
        const error = new Error(
            "Invalid or expired password reset link"
        );

        error.statusCode = 400;
        throw error;
    }

    const hashedPassword =
        await hashPassword(newPassword);

    user.password = hashedPassword;

    /*
     * Invalidate the token immediately after use.
     */
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    return {
        message: "Password reset successful"
    };
};


module.exports = {
    login,
    register,
    forgotPassword,
    resetPassword
};