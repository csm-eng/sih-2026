const express = require("express");

const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");

const {
    getSkillAnalytics,
    getIndustryAnalytics
} = require("./analytics.controller");

const router = express.Router();

// All analytics endpoints require JWT
router.use(authMiddleware);

// Institute → own institute analytics
router.get(
    "/skills",
    roleMiddleware("institute", "admin"),
    getSkillAnalytics
);

// Industry → industry skill demand & talent analytics
router.get(
    "/industry",
    roleMiddleware("company", "admin"),
    getIndustryAnalytics
);

module.exports = router;