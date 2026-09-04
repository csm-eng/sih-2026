const mongoose = require("mongoose");

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
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "RoadmapProgress",
    roadmapProgressSchema
);