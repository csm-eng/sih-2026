const mongoose = require("mongoose");

const skillDemandSchema = new mongoose.Schema(
    {
        skillId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Skill",
            required: true
        },

        requiredLevel: {
            type: Number,
            min: 1,
            max: 5,
            default: 1
        },

        demandScore: {
            type: Number,
            min: 0,
            max: 100,
            default: 0
        },

        demandCount: {
            type: Number,
            min: 0,
            default: 0
        },

        source: {
            type: String,
            enum: [
                "job_posting",
                "internship",
                "company_requirement",
                "industry_survey",
                "system"
            ],
            default: "job_posting"
        },

        lastUpdatedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

skillDemandSchema.index({
    skillId: 1
});

module.exports = mongoose.model("SkillDemand", skillDemandSchema);