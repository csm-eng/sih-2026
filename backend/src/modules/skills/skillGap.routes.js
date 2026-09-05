const express = require("express");

const {
    calculateSkillGap,
    getSkillGaps,
    getSkillGapById,
    getStudentSkillGaps,
    deleteSkillGap
} = require("./skillGap.controller");

const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");

const router = express.Router();

// Calculate a skill gap
router.post(
    "/calculate/:studentId/:skillId",
    authMiddleware,
    roleMiddleware("student", "institute", "admin"),
    calculateSkillGap
);

// Get skill gaps
router.get(
    "/",
    authMiddleware,
    roleMiddleware("student", "institute", "admin"),
    getSkillGaps
);

// Get skill gaps for a particular student
router.get(
    "/student/:studentId",
    authMiddleware,
    roleMiddleware("student", "institute", "admin"),
    getStudentSkillGaps
);

// Get one skill gap
router.get(
    "/:id",
    authMiddleware,
    roleMiddleware("student", "institute", "admin"),
    getSkillGapById
);

// Delete skill gap
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    deleteSkillGap
);

module.exports = router;