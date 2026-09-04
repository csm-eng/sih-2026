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

        const data = await authService.login(email, password);

        res.status(200).json({
            success: true,
            message: "Login successful",
            data
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    login
};