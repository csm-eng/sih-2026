const express = require("express");

const {
    createSkillEvidence,
    getSkillEvidence,
    getSkillEvidenceById,
    getStudentSkillEvidence,
    updateSkillEvidence,
    deleteSkillEvidence
} = require("./skillEvidence.controller");

const router = express.Router();

router.post("/", createSkillEvidence);

router.get("/", getSkillEvidence);

// Specific route MUST come before /:id
router.get("/student/:studentId", getStudentSkillEvidence);

router.get("/:id", getSkillEvidenceById);

router.put("/:id", updateSkillEvidence);

router.delete("/:id", deleteSkillEvidence);

module.exports = router;