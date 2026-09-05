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

/*
|--------------------------------------------------------------------------
| All Institute Routes
|--------------------------------------------------------------------------
| Every route requires:
| 1. Valid JWT
| 2. Institute role
|--------------------------------------------------------------------------
*/

router.use(authMiddleware);
router.use(roleMiddleware("institute"));

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

router.get(
    "/dashboard",
    getDashboard
);

/*
|--------------------------------------------------------------------------
| Students
|--------------------------------------------------------------------------
*/

router.get(
    "/students",
    getStudents
);

router.get(
    "/students/:studentId",
    getStudentDetails
);

/*
|--------------------------------------------------------------------------
| Student Roadmap
|--------------------------------------------------------------------------
*/

router.get(
    "/students/:studentId/roadmap",
    getStudentRoadmap
);

/*
|--------------------------------------------------------------------------
| Student Performance
|--------------------------------------------------------------------------
*/

router.get(
    "/students/:studentId/performance",
    getStudentPerformance
);

/*
|--------------------------------------------------------------------------
| Student Mock Test Results
|--------------------------------------------------------------------------
*/

router.get(
    "/students/:studentId/mock-results",
    getStudentMockResults
);

/*
|--------------------------------------------------------------------------
| Student Weak Areas
|--------------------------------------------------------------------------
*/

router.get(
    "/students/:studentId/weak-areas",
    getStudentWeakAreas
);

/*
|--------------------------------------------------------------------------
| Student Interventions
|--------------------------------------------------------------------------
*/

router.post(
    "/students/:studentId/interventions",
    createIntervention
);

router.get(
    "/students/:studentId/interventions",
    getStudentInterventions
);

/*
|--------------------------------------------------------------------------
| Update Intervention
|--------------------------------------------------------------------------
*/

router.patch(
    "/interventions/:interventionId",
    updateIntervention
);

module.exports = router;