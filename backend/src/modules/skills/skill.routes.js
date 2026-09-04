const express = require("express");

const router = express.Router();

const {
    createSkill,
    getSkills,
    getSkillById,
    updateSkill,
    deleteSkill
} = require("./skill.controller");


// TEST
router.get("/test", (req, res) => {
    res.json({
        message: "Skill routes are working"
    });
});


// CREATE
// POST /api/skills
router.post("/", createSkill);


// GET ALL
// GET /api/skills
router.get("/", getSkills);


// GET ONE
// GET /api/skills/:id
router.get("/:id", getSkillById);


// UPDATE
// PUT /api/skills/:id
router.put("/:id", updateSkill);


// DELETE
// DELETE /api/skills/:id
router.delete("/:id", deleteSkill);


module.exports = router;