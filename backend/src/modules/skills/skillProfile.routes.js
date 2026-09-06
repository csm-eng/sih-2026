const express = require("express");

const {
    createSkillProfile,
    getSkillProfiles,
    getSkillProfileById,
    getStudentSkillProfiles,
    updateSkillProfile,
    deleteSkillProfile,
    extractSkillsFromResume
} = require("./skillProfile.controller");

const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");

const router = express.Router();

// Create skill profile
router.post(
    "/",
    authMiddleware,
    roleMiddleware("student", "institute", "admin"),
    createSkillProfile
);

// Get skill profiles
router.get(
    "/",
    authMiddleware,
    roleMiddleware("student", "institute", "admin"),
    getSkillProfiles
);

// Get all skill profiles of a particular student
router.get(
    "/student/:studentId",
    authMiddleware,
    roleMiddleware("student", "institute", "admin"),
    getStudentSkillProfiles
);

// Extract and save skills from resume text using AI/ML service
router.post(
    "/extract/:studentId",
    authMiddleware,
    roleMiddleware("student", "institute", "admin"),
    extractSkillsFromResume
);

// Get one skill profile
router.get(
    "/:id",
    authMiddleware,
    roleMiddleware("student", "institute", "admin"),
    getSkillProfileById
);

// Update skill profile
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("student", "institute", "admin"),
    updateSkillProfile
);

// Delete skill profile
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    deleteSkillProfile
);

module.exports = router;