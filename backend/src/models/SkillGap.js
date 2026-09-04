const mongoose = require("mongoose");

const skillGapSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true
        },

        skillId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Skill",
            required: true
        },

        currentLevel: {
            type: Number,
            min: 1,
            max: 5,
            required: true
        },

        requiredLevel: {
            type: Number,
            min: 1,
            max: 5,
            required: true
        },

        gap: {
            type: Number,
            min: 0,
            required: true
        },

        demandScore: {
            type: Number,
            min: 0,
            max: 100,
            default: 0
        },

        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium"
        }
    },
    { timestamps: true }
);

skillGapSchema.index(
    { studentId: 1, skillId: 1 },
    { unique: true }
);

module.exports = mongoose.model("SkillGap", skillGapSchema);