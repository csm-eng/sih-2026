const express = require("express");

const {
    createSkillProfile,
    getSkillProfiles,
    getSkillProfileById,
    getStudentSkillProfiles,
    updateSkillProfile,
    deleteSkillProfile
} = require("./skillProfile.controller");

const router = express.Router();

router.post("/", createSkillProfile);

router.get("/", getSkillProfiles);

// IMPORTANT: specific route must come before /:id
router.get("/student/:studentId", getStudentSkillProfiles);

router.get("/:id", getSkillProfileById);

router.put("/:id", updateSkillProfile);

router.delete("/:id", deleteSkillProfile);

module.exports = router;