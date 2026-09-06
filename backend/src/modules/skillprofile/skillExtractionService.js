const Skill = require("../../models/Skill");
const SkillProfile = require("../../models/SkillProfile");
const { extractSkills } = require("../../services/aiServiceClient");

/**
 * Extract skills from student evidence using AI.
 *
 * IMPORTANT:
 * AI only detects possible skills.
 * It does NOT decide proficiency, level, or score.
 */
const extractAndSaveSkills = async (studentId, text) => {
  if (!studentId) {
    throw new Error("Student ID is required");
  }

  if (!text || !text.trim()) {
    throw new Error("Text is required for skill extraction");
  }

  const aiResult = await extractSkills(text);

  const extractedSkills = aiResult?.skills || [];

  const savedProfiles = [];

  for (const item of extractedSkills) {
    // Support different response formats from the AI service
    const skillName =
      item.skill ||
      item.name ||
      item.skillName;

    if (!skillName) {
      continue;
    }

    // Find existing skill case-insensitively
    let skill = await Skill.findOne({
      name: {
        $regex: `^${skillName.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
        $options: "i"
      }
    });

    // If skill does not exist, create it
    if (!skill) {
      skill = await Skill.create({
        name: skillName.trim(),
        category: item.category || "General",
        description: item.description || ""
      });
    }

    /*
     * IMPORTANT:
     * Do NOT use AI-provided score or level.
     *
     * The AI suggestion only means:
     * "This skill may exist in the student's evidence."
     */
    const profile = await SkillProfile.findOneAndUpdate(
      {
        studentId,
        skillId: skill._id
      },
      {
        $set: {
          verified: false,
          proficiencyStatus: "not_assessed",
          level: null,
          score: null,
          status: "not_assessed",
          source: "ai_extraction",
          lastAssessedAt: null
        }
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
      }
    );

    savedProfiles.push(profile);
  }

  return savedProfiles;
};

module.exports = {
  extractAndSaveSkills
};