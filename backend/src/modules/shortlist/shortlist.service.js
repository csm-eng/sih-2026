const mongoose = require("mongoose");

const Shortlist = require("../../models/Shortlist");
const Student = require("../../models/student");
const Opportunity = require("../../models/Opportunity");
const SkillProfile = require("../../models/SkillProfile");

const validateId = (id, fieldName) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error(`Invalid ${fieldName}`);
        error.statusCode = 400;
        throw error;
    }
};

const calculateMatch = async (studentId, opportunityId) => {
    validateId(studentId, "student ID");
    validateId(opportunityId, "opportunity ID");

    const student = await Student.findById(studentId);

    if (!student) {
        const error = new Error("Student not found");
        error.statusCode = 404;
        throw error;
    }

    const opportunity = await Opportunity.findById(opportunityId);

    if (!opportunity) {
        const error = new Error("Opportunity not found");
        error.statusCode = 404;
        throw error;
    }

    const studentProfiles = await SkillProfile.find({ studentId });

    const profileMap = new Map();

    studentProfiles.forEach(profile => {
        profileMap.set(profile.skillId.toString(), profile);
    });

    let totalScore = 0;
    let totalRequired = opportunity.requiredSkills.length;

    const matchedSkills = [];
    const missingSkills = [];

    for (const requiredSkill of opportunity.requiredSkills) {

        const skillId = requiredSkill.skillId.toString();
        const requiredLevel = requiredSkill.requiredLevel;

        const profile = profileMap.get(skillId);

        const studentLevel = profile ? profile.level : 0;

        const skillScore = Math.min(
            (studentLevel / requiredLevel) * 100,
            100
        );

        totalScore += skillScore;

        if (studentLevel >= requiredLevel) {
            matchedSkills.push({
                skillId: requiredSkill.skillId,
                studentLevel,
                requiredLevel
            });
        } else {
            missingSkills.push({
                skillId: requiredSkill.skillId,
                studentLevel,
                requiredLevel
            });
        }
    }

    const matchScore =
        totalRequired > 0
            ? Math.round(totalScore / totalRequired)
            : 0;

    const status =
        matchScore >= 70
            ? "matched"
            : "rejected";

    const shortlist = await Shortlist.findOneAndUpdate(
        { studentId, opportunityId },
        {
            studentId,
            opportunityId,
            matchScore,
            matchedSkills,
            missingSkills,
            status
        },
        {
            new: true,
            upsert: true,
            runValidators: true,
            setDefaultsOnInsert: true
        }
    )
        .populate("studentId", "name email department year")
        .populate("opportunityId", "title type companyId requiredSkills")
        .populate("matchedSkills.skillId", "name category")
        .populate("missingSkills.skillId", "name category");

    return shortlist;
};

const getStudentMatches = async (studentId) => {
    validateId(studentId, "student ID");

    return await Shortlist.find({ studentId })
        .populate("opportunityId", "title type companyId location mode")
        .populate("matchedSkills.skillId", "name category")
        .populate("missingSkills.skillId", "name category")
        .sort({ matchScore: -1 });
};

const getOpportunityMatches = async (opportunityId) => {
    validateId(opportunityId, "opportunity ID");

    return await Shortlist.find({ opportunityId })
        .populate("studentId", "name email department year")
        .populate("matchedSkills.skillId", "name category")
        .populate("missingSkills.skillId", "name category")
        .sort({ matchScore: -1 });
};

module.exports = {
    calculateMatch,
    getStudentMatches,
    getOpportunityMatches
};