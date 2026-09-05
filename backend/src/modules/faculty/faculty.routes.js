const express = require("express");

const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");

const {
    createFaculty,
    getFaculties,
    getFacultyById,
    updateFaculty,
    deleteFaculty
} = require("./faculty.controller");

const router = express.Router();

// All faculty endpoints require JWT authentication
router.use(authMiddleware);

// Get all faculty
// Institute → only its own institute
// Admin → all institutes
router.get(
    "/",
    roleMiddleware("institute", "admin"),
    getFaculties
);

// Create faculty
// Institute → own institute
// Admin → any institute
router.post(
    "/",
    roleMiddleware("institute", "admin"),
    createFaculty
);

// Get faculty by ID
router.get(
    "/:id",
    roleMiddleware("institute", "admin"),
    getFacultyById
);

// Update faculty
router.put(
    "/:id",
    roleMiddleware("institute", "admin"),
    updateFaculty
);

// Delete faculty
router.delete(
    "/:id",
    roleMiddleware("institute", "admin"),
    deleteFaculty
);

module.exports = router;