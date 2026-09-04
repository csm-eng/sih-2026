const mongoose = require("mongoose");

const skillProfileSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },

        skillId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Skill",
            required: true,
        },

        level: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
            default: 1,
        },

        score: {
            type: Number,
            min: 0,
            max: 100,
            default: 0,
        },

        experienceMonths: {
            type: Number,
            min: 0,
            default: 0,
        },

        status: {
            type: String,
            enum: [
                "beginner",
                "developing",
                "intermediate",
                "advanced",
                "expert",
            ],
            default: "beginner",
        },

        source: {
            type: String,
            enum: [
                "self_assessment",
                "mock_test",
                "project",
                "certification",
                "interview",
                "institute_assessment",
                "system",
            ],
            default: "self_assessment",
        },

        lastAssessedAt: {
            type: Date,
        },

        verified: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

skillProfileSchema.index(
    {
        studentId: 1,
        skillId: 1,
    },
    {
        unique: true,
    }
);

module.exports = mongoose.model(
    "SkillProfile",
    skillProfileSchema
);