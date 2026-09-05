const express = require("express");

const {
    createSkillEvidence,
    getSkillEvidence,
    getSkillEvidenceById,
    getStudentSkillEvidence,
    updateSkillEvidence,
    deleteSkillEvidence
} = require("./skillEvidence.controller");

const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");

const router = express.Router();

// Create evidence
router.post(
    "/",
    authMiddleware,
    roleMiddleware("student", "institute", "admin"),
    createSkillEvidence
);

// Get evidence
router.get(
    "/",
    authMiddleware,
    roleMiddleware("student", "institute", "admin"),
    getSkillEvidence
);

// Get evidence for a particular student
router.get(
    "/student/:studentId",
    authMiddleware,
    roleMiddleware("student", "institute", "admin"),
    getStudentSkillEvidence
);

// Get one evidence record
router.get(
    "/:id",
    authMiddleware,
    roleMiddleware("student", "institute", "admin"),
    getSkillEvidenceById
);

// Update evidence
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("student", "institute", "admin"),
    updateSkillEvidence
);

// Delete evidence
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("student", "institute", "admin"),
    deleteSkillEvidence
);

module.exports = router;