const express = require("express");

const {
    createSkillDemand,
    getSkillDemands,
    getSkillDemandById,
    getSkillDemandsBySkill,
    updateSkillDemand,
    deleteSkillDemand
} = require("./skillDemand.controller");

const router = express.Router();

router.post("/", createSkillDemand);

router.get("/", getSkillDemands);

// Specific route MUST come before /:id
router.get("/skill/:skillId", getSkillDemandsBySkill);

router.get("/:id", getSkillDemandById);

router.put("/:id", updateSkillDemand);

router.delete("/:id", deleteSkillDemand);

module.exports = router;