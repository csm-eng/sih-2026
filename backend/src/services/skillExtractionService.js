const mongoose = require("mongoose");
const Skill = require("../models/Skill");
const SkillProfile = require("../models/SkillProfile");
const aiServiceClient = require("./aiServiceClient");

// score (0-100) -> level (1-5), matching SkillProfile's schema
const scoreToLevel = (score) => {
    if (score >= 90) return 5;
    if (score >= 70) return 4;
    if (score >= 50) return 3;
    if (score >= 30) return 2;
    return 1;
};

// score (0-100) -> status enum, matching SkillProfile's schema
const scoreToStatus = (score) => {
    if (score >= 90) return "expert";
    if (score >= 70) return "advanced";
    if (score >= 50) return "intermediate";
    if (score >= 30) return "developing";
    return "beginner";
};

/**
 * Extract skills from raw resume/certificate text, normalize each one
 * against the taxonomy, and upsert a SkillProfile per skill for the
 * student. Skills the AI service finds that don't exist yet in the
 * Skill collection are created on the fly (category comes from the AI
 * service's taxonomy).
 *
 * Returns the list of upserted SkillProfile documents.
 */
const extractAndSaveSkills = async (studentId, resumeText) => {
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
        const error = new Error("Invalid student ID");
        error.statusCode = 400;
        throw error;
    }

    const { skills_found: skillsFound } = await aiServiceClient.extractSkills(
        resumeText
    );

    const savedProfiles = [];

    for (const found of skillsFound) {
        // Extraction already returns a taxonomy-canonical skill name, but
        // normalize again in case of any drift - cheap and keeps this
        // robust if the extraction source changes later (e.g. LLM-based).
        const { canonical_skill: canonicalName } =
            await aiServiceClient.normalizeSkill(found.skill);

        const skillName = canonicalName || found.skill;

        let skillDoc = await Skill.findOne({ name: skillName });
        if (!skillDoc) {
            skillDoc = await Skill.create({
                name: skillName,
                category: found.category || "Other"
            });
        }

        const score = found.proficiency;

        const profile = await SkillProfile.findOneAndUpdate(
            { studentId, skillId: skillDoc._id },
            {
                studentId,
                skillId: skillDoc._id,
                score,
                level: scoreToLevel(score),
                status: scoreToStatus(score),
                source: "system",
                lastAssessedAt: new Date()
            },
            { upsert: true, new: true, runValidators: true }
        );

        savedProfiles.push(profile);
    }

    return savedProfiles;
};

module.exports = {
    extractAndSaveSkills,
    scoreToLevel,
    scoreToStatus
};
