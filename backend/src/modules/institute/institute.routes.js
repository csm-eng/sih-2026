const express = require("express");

const {
    getDashboard,
    getStudents,
    getStudentDetails,
    getStudentRoadmap,
    getStudentPerformance,
    getStudentMockResults,
    getStudentWeakAreas,
    createIntervention,
    getStudentInterventions,
    updateIntervention,
} = require("./institute.controller");

const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");
const router = express.Router();

// All institute routes require authentication
router.use(authMiddleware);
router.use(roleMiddleware("institute"));

// Institute dashboard
router.get("/dashboard", getDashboard);

// Students
router.get("/students", getStudents);
router.get("/students/:studentId", getStudentDetails);

// Student roadmap
router.get("/students/:studentId/roadmap", getStudentRoadmap);

// Student performance
router.get("/students/:studentId/performance", getStudentPerformance);

// Mock test results
router.get("/students/:studentId/mock-results", getStudentMockResults);

// Weak areas
router.get("/students/:studentId/weak-areas", getStudentWeakAreas);

// Interventions
router.post("/students/:studentId/interventions", createIntervention);
router.get("/students/:studentId/interventions", getStudentInterventions);

router.patch(
    "/interventions/:interventionId",
    updateIntervention
);

module.exports = router;