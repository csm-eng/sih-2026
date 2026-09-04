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


// TEST ROUTE
router.get("/test", (req, res) => {
    res.json({
        message: "Student routes are working"
    });
});


// CREATE
// POST /api/students
router.post(
    "/",
    validateStudent,
    createStudent
);


// GET ALL
// GET /api/students
router.get(
    "/",
    getStudents
);


// GET ONE
// GET /api/students/:id
router.get(
    "/:id",
    getStudentById
);


// UPDATE
// PUT /api/students/:id
router.put(
    "/:id",
    updateStudent
);


// DELETE
// DELETE /api/students/:id
router.delete(
    "/:id",
    deleteStudent
);


module.exports = router;