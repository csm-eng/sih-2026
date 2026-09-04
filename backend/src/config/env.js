const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/career-platform";

module.exports = {
    PORT,
    MONGO_URI
};