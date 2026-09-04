const mongoose = require("mongoose");
const { MONGO_URI } = require("./env");

const connectDB = async () => {
    try {
        if (!MONGO_URI) {
            throw new Error("MONGO_URI is not defined in .env");
        }

        await mongoose.connect(MONGO_URI);

        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        throw error;
    }
};

module.exports = connectDB;