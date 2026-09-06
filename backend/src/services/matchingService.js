const mongoose = require("mongoose");
const SkillProfile = require("../models/SkillProfile");
const Skill = require("../models/Skill");
const aiServiceClient = require("./aiServiceClient");

/**
 * Build a { skillName: score(0-100) } map for a student from their
 * SkillProfile records - the shape the AI service's matching endpoints
 * expect.
 */
const getStudentSkillMap = async (studentId) => {
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
        const error = new Error("Invalid student ID");
        error.statusCode = 400;
        throw error;
    }

    const profiles = await SkillProfile.find({ studentId }).populate(
        "skillId"
    );

    const skillMap = {};
    for (const profile of profiles) {
        if (profile.skillId && profile.skillId.name) {
            skillMap[profile.skillId.name] = profile.score;
        }
    }
    return skillMap;
};

/**
 * Compute skill gap between a student and a target skill set (a role,
 * an internship's required skills, etc). targetSkills is a plain
 * { skillName: requiredScore } map supplied by the caller for now -
 * TODO: once a RoleProfile/Opportunity model exists with required
 * skills, fetch it here instead of taking it as a parameter.
 */
const getStudentSkillGapVsTarget = async (studentId, targetSkills) => {
    const studentSkills = await getStudentSkillMap(studentId);
    return aiServiceClient.computeSkillGap(studentSkills, targetSkills);
};

/**
 * Rank a list of opportunities against a student's skill profile.
 * opportunities: [{ id, title, required_skills: { skillName: score } }]
 * TODO: once the Opportunity model is built, replace the `opportunities`
 * param with an `Opportunity.find(...)` fetch mapped into this shape.
 */
const rankOpportunitiesForStudent = async (studentId, opportunities) => {
    const studentSkills = await getStudentSkillMap(studentId);
    return aiServiceClient.rankOpportunities(studentSkills, opportunities);
};

module.exports = {
    getStudentSkillMap,
    getStudentSkillGapVsTarget,
    rankOpportunitiesForStudent
};
