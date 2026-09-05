const express = require("express");

const {
    createRecommendation,
    getRecommendations,
    getRecommendationById,
    getStudentRecommendations,
    generateRecommendation,
    updateRecommendation,
    deleteRecommendation
} = require("./recommendation.controller");

const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");

const router = express.Router();

// Generate recommendation from skill gap
router.get(
    "/generate/:studentId/:skillId",
    authMiddleware,
    roleMiddleware("student", "institute", "admin"),
    generateRecommendation
);

// Manually create recommendation
router.post(
    "/",
    authMiddleware,
    roleMiddleware("admin"),
    createRecommendation
);

// Get recommendations
router.get(
    "/",
    authMiddleware,
    roleMiddleware("student", "institute", "admin"),
    getRecommendations
);

// Get recommendations for a particular student
router.get(
    "/student/:studentId",
    authMiddleware,
    roleMiddleware("student", "institute", "admin"),
    getStudentRecommendations
);

// Get one recommendation
router.get(
    "/:id",
    authMiddleware,
    roleMiddleware("student", "institute", "admin"),
    getRecommendationById
);

// Update recommendation
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("student", "institute", "admin"),
    updateRecommendation
);

// Delete recommendation
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    deleteRecommendation
);

module.exports = router;