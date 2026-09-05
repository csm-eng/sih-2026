const mongoose = require("mongoose");

const shortlistSchema = new mongoose.Schema(
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

        matchScore: {
            type: Number,
            min: 0,
            max: 100,
            required: true
        },

        matchedSkills: [
            {
                skillId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Skill"
                },
                studentLevel: Number,
                requiredLevel: Number
            }
        ],

        missingSkills: [
            {
                skillId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Skill"
                },
                studentLevel: Number,
                requiredLevel: Number
            }
        ],

        status: {
            type: String,
            enum: ["matched", "shortlisted", "rejected"],
            default: "matched"
        }
    },
    { timestamps: true }
);

shortlistSchema.index(
    { studentId: 1, opportunityId: 1 },
    { unique: true }
);

module.exports = mongoose.model("Shortlist", shortlistSchema);