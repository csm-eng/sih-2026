const express = require("express");

const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");

const {
    createMentorship,
    getMentorships,
    getMentorshipById,
    updateMentorship,
    deleteMentorship
} = require("./mentorship.controller");

const router = express.Router();

// All mentorship endpoints require JWT
router.use(authMiddleware);

// Get mentorships
// Student → own mentorships
// Institute → own institute
// Admin → all
router.get(
    "/",
    roleMiddleware("student", "institute", "admin"),
    getMentorships
);

// Create mentorship request
// Student → own request
// Admin → allowed
router.post(
    "/",
    roleMiddleware("student", "admin"),
    createMentorship
);

// Get mentorship by ID
router.get(
    "/:id",
    roleMiddleware("student", "institute", "admin"),
    getMentorshipById
);

// Update mentorship
// Student → limited fields on own mentorship
// Institute → own institute
// Admin → full management
router.put(
    "/:id",
    roleMiddleware("student", "institute", "admin"),
    updateMentorship
);

// Delete mentorship
// Institute → own institute
// Admin → any
router.delete(
    "/:id",
    roleMiddleware("institute", "admin"),
    deleteMentorship
);

module.exports = router;