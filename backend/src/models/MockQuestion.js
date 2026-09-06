const mongoose = require("mongoose");

const mockQuestionSchema = new mongoose.Schema(
    {
        skillId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Skill",
            required: true,
        },

        question: {
            type: String,
            required: true,
            trim: true,
        },

        options: {
            type: [String],
            required: true,
            validate: {
                validator: (value) =>
                    value.length >= 2,
                message:
                    "At least two options are required",
            },
        },

        correctAnswer: {
            type: Number,
            required: true,
            min: 0,
        },

        difficulty: {
            type: String,
            enum: [
                "basic",
                "intermediate",
                "advanced",
            ],
            default: "basic",
        },

        explanation: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "MockQuestion",
    mockQuestionSchema
);