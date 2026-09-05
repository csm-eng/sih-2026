const express = require("express");

const {
    createSkill,
    getSkills,
    getSkillById,
    updateSkill,
    deleteSkill
} = require("./skill.controller");

const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");

const router = express.Router();



// Admin only
router.post(
    "/",
    authMiddleware,
    roleMiddleware("admin"),
    createSkill
);

// Authenticated users can read skills
router.get(
    "/",
    authMiddleware,
    roleMiddleware("student", "institute", "company", "admin"),
    getSkills
);

router.get(
    "/:id",
    authMiddleware,
    roleMiddleware("student", "institute", "company", "admin"),
    getSkillById
);

// Admin only
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    updateSkill
);

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    deleteSkill
);

module.exports = router;