const mongoose = require("mongoose");

const skillProfileSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true
    },

    skillId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
      required: true
    },

    // Proficiency is NOT assigned when AI detects a skill.
    level: {
      type: Number,
      min: 1,
      max: 5,
      default: null
    },

    // Assessment score is assigned only after an assessment.
    score: {
      type: Number,
      min: 0,
      max: 100,
      default: null
    },

    experienceMonths: {
      type: Number,
      min: 0,
      default: 0
    },

    proficiencyStatus: {
      type: String,
      enum: ["not_assessed", "assessed"],
      default: "not_assessed"
    },

    status: {
      type: String,
      enum: [
        "not_assessed",
        "beginner",
        "developing",
        "intermediate",
        "advanced",
        "expert"
      ],
      default: "not_assessed"
    },

    source: {
      type: String,
      enum: [
        "self_assessment",
        "mock_test",
        "project",
        "certification",
        "interview",
        "institute_assessment",
        "ai_extraction",
        "system"
      ],
      default: "self_assessment"
    },

    lastAssessedAt: {
      type: Date,
      default: null
    },

    // false = AI suggestion
    // true = student/institute confirmed skill
    verified: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// One skill profile per student per skill
skillProfileSchema.index(
  { studentId: 1, skillId: 1 },
  { unique: true }
);

module.exports = mongoose.model("SkillProfile", skillProfileSchema);