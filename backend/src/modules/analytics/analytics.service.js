const mongoose = require("mongoose");

const Student = require("../../models/student");
const Skill = require("../../models/Skill");
const SkillDemand = require("../../models/SkillDemand");
const SkillGap = require("../../models/SkillGap");
const SkillProfile = require("../../models/SkillProfile");

const validateInstitute = (user) => {
    if (!user || user.role !== "institute") {
        const error = new Error("Institute access required");
        error.statusCode = 403;
        throw error;
    }

    if (!user.instituteId) {
        const error = new Error(
            "Institute account is not linked to an institute"
        );
        error.statusCode = 403;
        throw error;
    }

    if (!mongoose.Types.ObjectId.isValid(user.instituteId)) {
        const error = new Error("Invalid institute ID");
        error.statusCode = 400;
        throw error;
    }
};

const getSkillAnalytics = async (user) => {
    validateInstitute(user);

    const instituteId = user.instituteId;

    // Get students belonging to this institute
    const students = await Student.find({
        instituteId
    })
        .select("_id")
        .lean();

    const studentIds = students.map(
        (student) => student._id
    );

    if (!studentIds.length) {
        return {
            totalStudents: 0,
            totalSkillProfiles: 0,
            highPriorityGaps: 0,
            topSkillGaps: [],
            topDemandedSkills: [],
            skillReadiness: []
        };
    }

    // Student skill profiles
    const profiles = await SkillProfile.find({
        studentId: { $in: studentIds }
    })
        .populate("skillId", "name category")
        .lean();

    // Skill gaps
    const gaps = await SkillGap.find({
        studentId: { $in: studentIds }
    })
        .populate("skillId", "name category")
        .lean();

    // Industry demand
    const demands = await SkillDemand.find()
        .populate("skillId", "name category")
        .sort({ demandScore: -1 })
        .lean();

    // Count high priority gaps
    const highPriorityGaps = gaps.filter(
        (gap) => gap.priority === "high"
    ).length;

    // Aggregate gaps by skill
    const gapMap = {};

    gaps.forEach((gap) => {
        if (!gap.skillId) return;

        const skillId = gap.skillId._id.toString();

        if (!gapMap[skillId]) {
            gapMap[skillId] = {
                skillId: gap.skillId._id,
                skillName: gap.skillId.name,
                category: gap.skillId.category,
                studentsAffected: 0,
                totalGap: 0,
                highPriority: 0
            };
        }

        gapMap[skillId].studentsAffected += 1;
        gapMap[skillId].totalGap += gap.gap || 0;

        if (gap.priority === "high") {
            gapMap[skillId].highPriority += 1;
        }
    });

    const topSkillGaps = Object.values(gapMap)
        .map((item) => ({
            ...item,
            averageGap:
                item.studentsAffected > 0
                    ? Number(
                        (
                            item.totalGap /
                            item.studentsAffected
                        ).toFixed(2)
                    )
                    : 0
        }))
        .sort((a, b) => {
            if (b.highPriority !== a.highPriority) {
                return b.highPriority - a.highPriority;
            }

            return b.averageGap - a.averageGap;
        });

    // Top industry-demanded skills
    const topDemandedSkills = demands
        .filter((demand) => demand.skillId)
        .slice(0, 10)
        .map((demand) => ({
            skillId: demand.skillId._id,
            skillName: demand.skillId.name,
            category: demand.skillId.category,
            requiredLevel: demand.requiredLevel,
            demandScore: demand.demandScore,
            demandCount: demand.demandCount,
            source: demand.source
        }));

    // Calculate institute readiness per skill
    const readinessMap = {};

    profiles.forEach((profile) => {
        if (!profile.skillId) return;

        const skillId = profile.skillId._id.toString();

        if (!readinessMap[skillId]) {
            readinessMap[skillId] = {
                skillId: profile.skillId._id,
                skillName: profile.skillId.name,
                category: profile.skillId.category,
                studentCount: 0,
                totalLevel: 0,
                totalScore: 0,
                verifiedCount: 0
            };
        }

        readinessMap[skillId].studentCount += 1;
        readinessMap[skillId].totalLevel += profile.level || 0;
        readinessMap[skillId].totalScore += profile.score || 0;

        if (profile.verified) {
            readinessMap[skillId].verifiedCount += 1;
        }
    });

    const skillReadiness = Object.values(readinessMap)
        .map((item) => ({
            skillId: item.skillId,
            skillName: item.skillName,
            category: item.category,
            studentCount: item.studentCount,

            averageLevel:
                item.studentCount > 0
                    ? Number(
                        (
                            item.totalLevel /
                            item.studentCount
                        ).toFixed(2)
                    )
                    : 0,

            averageScore:
                item.studentCount > 0
                    ? Number(
                        (
                            item.totalScore /
                            item.studentCount
                        ).toFixed(2)
                    )
                    : 0,

            verifiedPercentage:
                item.studentCount > 0
                    ? Number(
                        (
                            (item.verifiedCount /
                                item.studentCount) *
                            100
                        ).toFixed(2)
                    )
                    : 0
        }))
        .sort((a, b) => b.averageLevel - a.averageLevel);

    return {
        totalStudents: students.length,
        totalSkillProfiles: profiles.length,
        highPriorityGaps,
        topSkillGaps,
        topDemandedSkills,
        skillReadiness
    };
};

module.exports = {
    getSkillAnalytics
};