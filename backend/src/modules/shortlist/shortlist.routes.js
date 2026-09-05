const express = require("express");

const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");

const {
    calculateMatch,
    getStudentMatches,
    getOpportunityMatches
} = require("./shortlist.controller");

const router = express.Router();

// Student - calculate own match
router.get(
    "/match/:studentId/:opportunityId",
    authMiddleware,
    roleMiddleware("student"),
    calculateMatch
);

// Student - view own matches
router.get(
    "/student/:studentId",
    authMiddleware,
    roleMiddleware("student"),
    getStudentMatches
);

// Company - view candidates for its opportunity
router.get(
    "/opportunity/:opportunityId",
    authMiddleware,
    roleMiddleware("company"),
    getOpportunityMatches
);

module.exports = router;