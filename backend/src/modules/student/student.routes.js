const express = require("express");

const router = express.Router();

const {
    createStudent,
    getStudents,
    getStudentById,
    updateStudent,
    deleteStudent
} = require("./student.controller");

const {
    validateStudent
} = require("./student.validation");

const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");

// TEST ROUTE
router.get("/test", (req, res) => {
    res.json({
        message: "Student routes are working"
    });
});

// CREATE - Admin / Institute
router.post(
    "/",
    authMiddleware,
    roleMiddleware("admin", "institute"),
    validateStudent,
    createStudent
);

// GET ALL - Institute / Admin
router.get(
    "/",
    authMiddleware,
    roleMiddleware("institute", "admin"),
    getStudents
);

// GET ONE - ownership handled by service
router.get(
    "/:id",
    authMiddleware,
    roleMiddleware("student", "institute", "admin"),
    getStudentById
);

// UPDATE - ownership handled by service
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("student", "institute", "admin"),
    updateStudent
);

// DELETE - Admin only
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    deleteStudent
);

module.exports = router;