/**
 * Thin HTTP client for the Python FastAPI AI/ML service
 * (extraction, normalization, matching - see /ai-service in the repo).
 *
 * Uses Node's built-in fetch (Node 18+, which Express 5 already requires)
 * so no extra dependency like axios is needed.
 */

const { AI_SERVICE_URL } = require("../config/env");

const callAiService = async (path, body) => {
    let response;

    try {
        response = await fetch(`${AI_SERVICE_URL}${path}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
    } catch (err) {
        const error = new Error(
            `AI service unreachable at ${AI_SERVICE_URL}${path}: ${err.message}`
        );
        error.statusCode = 503;
        throw error;
    }

    if (!response.ok) {
        const text = await response.text();
        const error = new Error(
            `AI service error (${response.status}) at ${path}: ${text}`
        );
        error.statusCode = 502;
        throw error;
    }

    return response.json();
};

const extractSkills = (text) =>
    callAiService("/extract-skills", { text });

const normalizeSkill = (term) =>
    callAiService("/normalize-skill", { term });

const computeSkillGap = (studentSkills, targetSkills) =>
    callAiService("/skill-gap", {
        student_skills: studentSkills,
        target_skills: targetSkills
    });

const rankOpportunities = (studentSkills, opportunities) =>
    callAiService("/rank-opportunities", {
        student_skills: studentSkills,
        opportunities
    });

module.exports = {
    extractSkills,
    normalizeSkill,
    computeSkillGap,
    rankOpportunities
};
