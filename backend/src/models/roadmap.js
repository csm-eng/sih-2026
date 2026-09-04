const mongoose = require("mongoose");

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
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Roadmap", roadmapSchema);