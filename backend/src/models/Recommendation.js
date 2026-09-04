const mongoose = require("mongoose");

const recommendationSchema = new mongoose.Schema(
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

        type: {
            type: String,
            enum: [
                "course",
                "project",
                "certification",
                "internship",
                "roadmap",
                "practice"
            ],
            required: true
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            default: "",
            trim: true
        },

        reason: {
            type: String,
            default: "",
            trim: true
        },

        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium"
        },

        url: {
            type: String,
            default: "",
            trim: true
        },

        completed: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

recommendationSchema.index({ studentId: 1, skillId: 1 });

module.exports = mongoose.model(
    "Recommendation",
    recommendationSchema
);