const mongoose = require("mongoose");

const roadmapStepSchema = new mongoose.Schema(
    {
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

        order: {
            type: Number,
            required: true,
            min: 1
        },

        skills: {
            type: [String],
            default: []
        }
    },
    { _id: true }
);

const roadmapSchema = new mongoose.Schema(
    {
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

        skills: {
            type: [String],
            default: []
        },

        steps: {
            type: [roadmapStepSchema],
            default: []
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Roadmap", roadmapSchema);