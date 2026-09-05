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

// Calculate match between a student and an opportunity
const calculateMatch = async (
    studentId,
    opportunityId,
    user
) => {
    validateId(studentId, "student ID");
    validateId(opportunityId, "opportunity ID");

    // Only students can calculate their own match
    if (user.role !== "student") {
        const error = new Error(
            "Only students can calculate opportunity matches"
        );
        error.statusCode = 403;
        throw error;
    }

    if (
        !user.studentId ||
        studentId.toString() !== user.studentId.toString()
    ) {
        const error = new Error(
            "You are not authorized to calculate this match"
        );
        error.statusCode = 403;
        throw error;
    }

    const student = await Student.findById(studentId);

    if (!student) {
        const error = new Error("Student not found");
        error.statusCode = 404;
        throw error;
    }

    const opportunity = await Opportunity.findById(
        opportunityId
    );

    if (!opportunity) {
        const error = new Error("Opportunity not found");
        error.statusCode = 404;
        throw error;
    }

    const profiles = await SkillProfile.find({
        studentId
    });

    const profileMap = {};

    profiles.forEach((profile) => {
        profileMap[profile.skillId.toString()] = profile;
    });

    let totalScore = 0;

    const matchedSkills = [];
    const missingSkills = [];

    const totalRequired =
        opportunity.requiredSkills.length;

    for (const requiredSkill of opportunity.requiredSkills) {
        const skillId =
            requiredSkill.skillId.toString();

        const requiredLevel =
            requiredSkill.requiredLevel;

        const profile = profileMap[skillId];

        const studentLevel =
            profile ? profile.level : 0;

        let skillScore = 0;

        if (requiredLevel > 0) {
            skillScore = Math.min(
                (studentLevel / requiredLevel) * 100,
                100
            );
        }

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

    const shortlist =
        await Shortlist.findOneAndUpdate(
            {
                studentId,
                opportunityId
            },
            {
                studentId,
                opportunityId,
                matchScore,
                matchedSkills,
                missingSkills,
                status: "matched"
            },
            {
                new: true,
                upsert: true,
                runValidators: true,
                setDefaultsOnInsert: true
            }
        )
            .populate(
                "studentId",
                "name email department year"
            )
            .populate(
                "opportunityId",
                "title type companyId location mode"
            )
            .populate(
                "matchedSkills.skillId",
                "name category"
            )
            .populate(
                "missingSkills.skillId",
                "name category"
            );

    return shortlist;
};

// Get matches for a student
const getStudentMatches = async (
    studentId,
    user
) => {
    validateId(studentId, "student ID");

    if (user.role !== "student") {
        const error = new Error(
            "Only students can access their opportunity matches"
        );
        error.statusCode = 403;
        throw error;
    }

    if (
        !user.studentId ||
        studentId.toString() !== user.studentId.toString()
    ) {
        const error = new Error(
            "You are not authorized to access these matches"
        );
        error.statusCode = 403;
        throw error;
    }

    const student = await Student.findById(studentId);

    if (!student) {
        const error = new Error("Student not found");
        error.statusCode = 404;
        throw error;
    }

    return await Shortlist.find({
        studentId
    })
        .populate(
            "opportunityId",
            "title type companyId location mode"
        )
        .populate(
            "matchedSkills.skillId",
            "name category"
        )
        .populate(
            "missingSkills.skillId",
            "name category"
        )
        .sort({
            matchScore: -1
        });
};

// Get candidates for company's opportunity
const getOpportunityMatches = async (
    opportunityId,
    user
) => {
    validateId(opportunityId, "opportunity ID");

    if (user.role !== "company") {
        const error = new Error(
            "Only companies can access opportunity candidates"
        );
        error.statusCode = 403;
        throw error;
    }

    if (!user.companyId) {
        const error = new Error(
            "Company account is not linked to a company"
        );
        error.statusCode = 403;
        throw error;
    }

    const opportunity = await Opportunity.findById(
        opportunityId
    );

    if (!opportunity) {
        const error = new Error("Opportunity not found");
        error.statusCode = 404;
        throw error;
    }

    // Company can see candidates only for its own opportunity
    if (
        opportunity.companyId.toString() !==
        user.companyId.toString()
    ) {
        const error = new Error(
            "You are not authorized to access these candidates"
        );
        error.statusCode = 403;
        throw error;
    }

    return await Shortlist.find({
        opportunityId
    })
        .populate(
            "studentId",
            "name email department year"
        )
        .populate(
            "matchedSkills.skillId",
            "name category"
        )
        .populate(
            "missingSkills.skillId",
            "name category"
        )
        .sort({
            matchScore: -1
        });
};

module.exports = {
    calculateMatch,
    getStudentMatches,
    getOpportunityMatches
};