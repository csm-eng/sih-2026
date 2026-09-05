const express = require("express");

const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");

const {
    createRoadmap,
    getRoadmaps,
    getRoadmapById,
    updateRoadmap,
    deleteRoadmap,
    createProgress,
    getStudentProgress,
    getProgressById,
    updateProgress,
    deleteProgress
} = require("./roadmap.controller");

const router = express.Router();

// All roadmap APIs require authentication
router.use(authMiddleware);

// ---------- ROADMAP TEMPLATES ----------

// Student / Institute / Admin can view roadmaps
router.get(
    "/",
    roleMiddleware("student", "institute", "admin"),
    getRoadmaps
);

router.get(
    "/:id",
    roleMiddleware("student", "institute", "admin"),
    getRoadmapById
);

// Only Admin can manage roadmap templates
router.post(
    "/",
    roleMiddleware("admin"),
    createRoadmap
);

router.put(
    "/:id",
    roleMiddleware("admin"),
    updateRoadmap
);

router.delete(
    "/:id",
    roleMiddleware("admin"),
    deleteRoadmap
);

// ---------- ROADMAP PROGRESS ----------

// Student / Institute / Admin
router.post(
    "/progress",
    roleMiddleware("student", "institute", "admin"),
    createProgress
);

router.get(
    "/progress/student/:studentId",
    roleMiddleware("student", "institute", "admin"),
    getStudentProgress
);

router.get(
    "/progress/:id",
    roleMiddleware("student", "institute", "admin"),
    getProgressById
);

router.put(
    "/progress/:id",
    roleMiddleware("student", "institute", "admin"),
    updateProgress
);

// Only Admin can delete progress
router.delete(
    "/progress/:id",
    roleMiddleware("admin"),
    deleteProgress
);

module.exports = router;