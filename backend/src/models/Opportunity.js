const mongoose = require("mongoose");

const opportunitySchema = new mongoose.Schema(
    {
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
            required: true
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        type: {
            type: String,
            enum: ["internship", "job", "project"],
            required: true
        },

        description: {
            type: String,
            default: "",
            trim: true
        },

        location: {
            type: String,
            default: "",
            trim: true
        },

        mode: {
            type: String,
            enum: ["onsite", "remote", "hybrid"],
            default: "onsite"
        },

        requiredSkills: [
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
                }
            }
        ],

        eligibility: {
            department: {
                type: [String],
                default: []
            },
            minimumYear: {
                type: Number,
                min: 1,
                max: 4
            },
            minimumCGPA: {
                type: Number,
                min: 0,
                max: 10
            }
        },

        applicationDeadline: {
            type: Date
        },

        status: {
            type: String,
            enum: ["open", "closed", "draft"],
            default: "open"
        }
    },
    { timestamps: true }
);

opportunitySchema.index({ companyId: 1 });
opportunitySchema.index({ "requiredSkills.skillId": 1 });

module.exports = mongoose.model("Opportunity", opportunitySchema);