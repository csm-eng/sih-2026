const express = require("express");

const {
    calculateSkillGap,
    getSkillGaps,
    getSkillGapById,
    getStudentSkillGaps,
    deleteSkillGap
} = require("./skillGap.controller");

const router = express.Router();

// Calculate skill gap for a student and skill
router.get(
    "/calculate/:studentId/:skillId",
    calculateSkillGap
);

// Get all skill gaps
router.get("/", getSkillGaps);

// Get skill gaps of a particular student
router.get(
    "/student/:studentId",
    getStudentSkillGaps
);

// Get a single skill gap
router.get("/:id", getSkillGapById);

// Delete a skill gap
router.delete("/:id", deleteSkillGap);

module.exports = router;