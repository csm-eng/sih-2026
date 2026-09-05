const express = require("express");

const {
    calculateMatch,
    getStudentMatches,
    getOpportunityMatches
} = require("./shortlist.controller");

const router = express.Router();

router.get(
    "/match/:studentId/:opportunityId",
    calculateMatch
);

router.get(
    "/student/:studentId",
    getStudentMatches
);

router.get(
    "/opportunity/:opportunityId",
    getOpportunityMatches
);

module.exports = router;
