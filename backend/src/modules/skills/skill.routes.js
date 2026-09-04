const express = require("express");

const {
    createSkill,
    getSkills,
    getSkillById,
    updateSkill,
    deleteSkill
} = require("./skill.controller");

const router = express.Router();

router.get("/test", (req, res) => {
    res.json({ message: "Skill routes are working" });
});

router.post("/", createSkill);

router.get("/", getSkills);

router.get("/:id", getSkillById);

router.put("/:id", updateSkill);

router.delete("/:id", deleteSkill);

module.exports = router;