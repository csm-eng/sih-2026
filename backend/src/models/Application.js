const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true
        },

        opportunityId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Opportunity",
            required: true
        },

        resumeUrl: {
            type: String,
            default: "",
            trim: true
        },

        coverLetter: {
            type: String,
            default: "",
            trim: true
        },

        matchScore: {
            type: Number,
            min: 0,
            max: 100,
            default: 0
        },

        status: {
            type: String,
            enum: [
                "applied",
                "under_review",
                "shortlisted",
                "rejected",
                "selected"
            ],
            default: "applied"
        },

        appliedAt: {
            type: Date,
            default: Date.now
        },

        reviewedAt: {
            type: Date
        }
    },
    { timestamps: true }
);

applicationSchema.index(
    { studentId: 1, opportunityId: 1 },
    { unique: true }
);

module.exports = mongoose.model("Application", applicationSchema);