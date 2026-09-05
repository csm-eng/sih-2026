const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        department: {
            type: String,
            required: true,
            trim: true
        },

        year: {
            type: Number,
            required: true,
            min: 1,
            max: 4
        },
        cgpa: {
            type: Number,
            min: 0,
            max: 10,
            default: 0
        },
        interests: {
            type: [String],
            default: []
        },

        skills: {
            type: [String],
            default: []
        },

        projects: {
            type: [String],
            default: []
        },

        instituteId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Institute",
            default: null
        },

        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Student", studentSchema);