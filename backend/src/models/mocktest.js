const mongoose = require("mongoose");

const mockTestSchema = new mongoose.Schema(
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

        questions: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "MockQuestion",
            },
        ],

        status: {
            type: String,
            enum: [
                "started",
                "completed",
            ],
            default: "started",
        },

        startedAt: {
            type: Date,
            default: Date.now,
        },

        completedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "MockTest",
    mockTestSchema
);