const mongoose = require("mongoose");

const roadmapStepProgressSchema = new mongoose.Schema(
    {
        stepId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },

        progress: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },

        completed: {
            type: Boolean,
            default: false
        }
    },
    {
        _id: false
    }
);

const roadmapProgressSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true
        },

        roadmapId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Roadmap",
            required: true
        },

        progress: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },

        completed: {
            type: Boolean,
            default: false
        },

        steps: {
            type: [roadmapStepProgressSchema],
            default: []
        }
    },
    {
        timestamps: true
    }
);

roadmapProgressSchema.index(
    { studentId: 1, roadmapId: 1 },
    { unique: true }
);

module.exports = mongoose.model(
    "RoadmapProgress",
    roadmapProgressSchema
);