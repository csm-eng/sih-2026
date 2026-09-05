const mongoose = require("mongoose");

const mentorshipSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true
        },

        mentorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Faculty",
            required: true
        },

        instituteId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Institute",
            required: true
        },

        requestedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        message: {
            type: String,
            default: "",
            trim: true
        },

        goals: {
            type: [String],
            default: []
        },

        status: {
            type: String,
            enum: [
                "pending",
                "accepted",
                "rejected",
                "completed"
            ],
            default: "pending"
        },

        startDate: {
            type: Date,
            default: null
        },

        endDate: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Mentorship", mentorshipSchema);