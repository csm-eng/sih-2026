const express = require("express");

const {
    createSkillDemand,
    getSkillDemands,
    getSkillDemandById,
    getSkillDemandsBySkill,
    updateSkillDemand,
    deleteSkillDemand
} = require("./skillDemand.controller");

const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");

const router = express.Router();

// Admin creates skill demand records
router.post(
    "/",
    authMiddleware,
    roleMiddleware("admin"),
    createSkillDemand
);

// All authenticated roles can view skill demand
router.get(
    "/",
    authMiddleware,
    roleMiddleware("student", "institute", "company", "admin"),
    getSkillDemands
);

// Get demand for a particular skill
router.get(
    "/skill/:skillId",
    authMiddleware,
    roleMiddleware("student", "institute", "company", "admin"),
    getSkillDemandsBySkill
);

// Get one skill demand
router.get(
    "/:id",
    authMiddleware,
    roleMiddleware("student", "institute", "company", "admin"),
    getSkillDemandById
);

// Only admin can update
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    updateSkillDemand
);

// Only admin can delete
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    deleteSkillDemand
);

module.exports = router;