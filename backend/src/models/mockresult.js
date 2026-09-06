const mongoose = require("mongoose");

const mockResultSchema = new mongoose.Schema(
    {
        mockTestId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "MockTest",
            required: true,
        },

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

        totalQuestions: {
            type: Number,
            required: true,
        },

        correctAnswers: {
            type: Number,
            required: true,
        },

        score: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },

        level: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },

        levelName: {
            type: String,
            required: true,
        },

        completedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "MockResult",
    mockResultSchema
);