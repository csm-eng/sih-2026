const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        instituteId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Institute",
            required: true
        },

        department: {
            type: String,
            required: true,
            trim: true
        },

        designation: {
            type: String,
            default: "",
            trim: true
        },

        specialization: {
            type: [String],
            default: []
        },

        experienceYears: {
            type: Number,
            min: 0,
            default: 0
        },

        availability: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Faculty", facultySchema);