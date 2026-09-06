const express = require("express");

const {
    createSkillProfile,
    getSkillProfiles,
    getSkillProfileById,
    getStudentSkillProfiles,
    getVerifiedStudentSkillProfiles,
    getAISkillSuggestions,
    confirmAISkill,
    updateSkillProfile,
    deleteSkillProfile,
    extractSkillsFromResume,
    analyzeStudentProfile
} = require("./skillProfile.controller");

const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");

const router = express.Router();

// =====================================================
// Create skill profile
// =====================================================
router.post(
    "/",
    authMiddleware,
    roleMiddleware("student", "institute", "admin"),
    createSkillProfile
);

// =====================================================
// Get all skill profiles
// =====================================================
router.get(
    "/",
    authMiddleware,
    roleMiddleware("student", "institute", "admin"),
    getSkillProfiles
);

// =====================================================
// Get all skill profiles of a particular student
// =====================================================
router.get(
    "/student/:studentId",
    authMiddleware,
    roleMiddleware("student", "institute", "admin", "company"),
    getStudentSkillProfiles
);

// =====================================================
// Get only verified/confirmed skills of a student
// =====================================================
router.get(
    "/student/:studentId/verified",
    authMiddleware,
    roleMiddleware("student", "institute", "admin", "company"),
    getVerifiedStudentSkillProfiles
);

// =====================================================
// Get AI-detected but unverified skill suggestions
// =====================================================
router.get(
    "/student/:studentId/suggestions",
    authMiddleware,
    roleMiddleware("student", "institute", "admin", "company"),
    getAISkillSuggestions
);
// =====================================================
// Analyze complete student profile using AI
// =====================================================

router.post(
    "/analyze/:studentId",
    authMiddleware,
    roleMiddleware("student", "institute", "admin"),
    analyzeStudentProfile
);
// =====================================================
// Confirm an AI-detected skill
// =====================================================
router.post(
    "/:id/confirm",
    authMiddleware,
    roleMiddleware("student", "institute", "admin"),
    confirmAISkill
);

// =====================================================
// Extract skills from resume text using AI/ML service
// =====================================================
router.post(
    "/extract/:studentId",
    authMiddleware,
    roleMiddleware("student", "institute", "admin"),
    extractSkillsFromResume
);

// =====================================================
// Get one skill profile
// =====================================================
router.get(
    "/:id",
    authMiddleware,
    roleMiddleware("student", "institute", "admin"),
    getSkillProfileById
);

// =====================================================
// Update skill profile
// =====================================================
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("student", "institute", "admin"),
    updateSkillProfile
);

// =====================================================
// Delete/remove a skill profile
// Student → can remove their own skill
// Institute → can remove skills of their students
// Admin → can remove any skill
// =====================================================
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("student", "institute", "admin"),
    deleteSkillProfile
);

module.exports = router;