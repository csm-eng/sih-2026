const mongoose = require("mongoose");

const skillEvidenceSchema = new mongoose.Schema(
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

        type: {
            type: String,
            enum: [
                "project",
                "certification",
                "mock_test",
                "assessment",
                "internship",
                "course",
                "github",
                "portfolio",
                "interview",
                "other",
            ],
            required: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
        },

        url: {
            type: String,
            trim: true,
        },

        score: {
            type: Number,
            min: 0,
            max: 100,
        },

        verified: {
            type: Boolean,
            default: false,
        },

        verifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        verifiedAt: {
            type: Date,
        },

        dateObtained: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

skillEvidenceSchema.index({
    studentId: 1,
    skillId: 1,
});

module.exports = mongoose.model(
    "SkillEvidence",
    skillEvidenceSchema
);