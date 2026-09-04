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

const router = express.Router();

router.get(
    "/generate/:studentId/:skillId",
    generateRecommendation
);

router.post("/", createRecommendation);

router.get("/", getRecommendations);

router.get(
    "/student/:studentId",
    getStudentRecommendations
);

router.get("/:id", getRecommendationById);

router.put("/:id", updateRecommendation);

router.delete("/:id", deleteRecommendation);

module.exports = router;
