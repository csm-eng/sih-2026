const authService = require("./auth.service");


const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const data = await authService.login(
            email,
            password
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            data
        });
    } catch (error) {
        next(error);
    }
};


const register = async (req, res, next) => {
    try {
        const {
            name,
            email,
            password,
            role
        } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message:
                    "Name, email and password are required"
            });
        }

        const data = await authService.register(
            name,
            email,
            password,
            role
        );

        res.status(201).json({
            success: true,
            message: "Registration successful",
            data
        });
    } catch (error) {
        next(error);
    }
};


const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const data =
            await authService.forgotPassword(email);

        res.status(200).json({
            success: true,
            message: data.message,
            resetLink: data.resetLink || null
        });
    } catch (error) {
        next(error);
    }
};


const resetPassword = async (req, res, next) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({
                success: false,
                message:
                    "Reset token and new password are required"
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message:
                    "Password must be at least 6 characters"
            });
        }

        const data =
            await authService.resetPassword(
                token,
                newPassword
            );

        res.status(200).json({
            success: true,
            message: data.message
        });
    } catch (error) {
        next(error);
    }
};


module.exports = {
    login,
    register,
    forgotPassword,
    resetPassword
};