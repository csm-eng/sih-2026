const mongoose = require("mongoose");

const SkillGap = require("../../models/SkillGap");
const SkillProfile = require("../../models/SkillProfile");
const SkillDemand = require("../../models/SkillDemand");
const Student = require("../../models/student");
const Skill = require("../../models/Skill");
const aiServiceClient = require("../../services/aiServiceClient");

const validateId = (id, fieldName) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error(`Invalid ${fieldName}`);
        error.statusCode = 400;
        throw error;
    }
};

const calculatePriority = (gap, demandScore) => {
    if (gap >= 2 && demandScore >= 70) {
        return "high";
    }

    if (gap >= 1 || demandScore >= 40) {
        return "medium";
    }

    return "low";
};

const scoreToLevel = (score) => {
    if (score >= 90) return 5;
    if (score >= 70) return 4;
    if (score >= 50) return 3;
    if (score >= 30) return 2;
    return 1;
};

const verifyStudentBelongsToInstitute = async (
    instituteId,
    studentId
) => {
    validateId(instituteId, "institute ID");
    validateId(studentId, "student ID");

    const student = await Student.findOne({
        _id: studentId,
        instituteId
    });

    if (!student) {
        const error = new Error(
            "Student does not belong to your institute"
        );
        error.statusCode = 403;
        throw error;
    }

    return student;
};

/*
 * AI-powered skill gap calculation
 *
 * studentId = student whose skills are being analyzed
 * skillId   = target skill / role requirement
 *
 * The existing endpoint remains per-skill, while the AI service
 * receives the student's complete skill profile.
 */
const calculateSkillGap = async (studentId, skillId, user) => {
    validateId(studentId, "student ID");
    validateId(skillId, "skill ID");

    const student = await Student.findById(studentId);

    if (!student) {
        const error = new Error("Student not found");
        error.statusCode = 404;
        throw error;
    }

    // Student can calculate only their own gap
    if (user.role === "student") {
        if (
            !user.studentId ||
            student._id.toString() !== user.studentId.toString()
        ) {
            const error = new Error(
                "You are not authorized to calculate this skill gap"
            );
            error.statusCode = 403;
            throw error;
        }
    }

    // Institute can calculate gaps only for its own students
    if (user.role === "institute") {
        await verifyStudentBelongsToInstitute(
            user.instituteId,
            studentId
        );
    }

    if (!["student", "institute", "admin"].includes(user.role)) {
        const error = new Error("Access denied");
        error.statusCode = 403;
        throw error;
    }

    const targetSkill = await Skill.findById(skillId);

    if (!targetSkill) {
        const error = new Error("Skill not found");
        error.statusCode = 404;
        throw error;
    }

    /*
     * Get all skills currently possessed by the student.
     * SkillProfile stores the score as 0-100.
     */
    const profiles = await SkillProfile.find({
        studentId
    }).populate("skillId", "name");

    const studentSkills = {};

    for (const profile of profiles) {
        if (profile.skillId?.name) {
            studentSkills[profile.skillId.name] = profile.score || 0;
        }
    }

    /*
     * Get the required level for the target skill.
     * SkillDemand.requiredLevel is stored on the existing
     * 1-5 scale, so convert it to the AI service's 0-100 scale.
     */
    const demand = await SkillDemand.findOne({
        skillId
    }).sort({
        demandScore: -1
    });

    if (!demand) {
        const error = new Error("Skill demand not found");
        error.statusCode = 404;
        throw error;
    }

    const requiredScore = Math.min(
        Math.max(demand.requiredLevel * 20, 0),
        100
    );

    const targetSkills = {
        [targetSkill.name]: requiredScore
    };

    /*
     * Call the FastAPI AI skill-gap engine.
     */
    const aiResult = await aiServiceClient.computeSkillGap(
        studentSkills,
        targetSkills
    );

    /*
     * Find the target skill's gap in the AI response.
     */
    const targetGap = aiResult.gaps.find(
        (item) =>
            item.skill.toLowerCase() ===
            targetSkill.name.toLowerCase()
    );

    /*
     * If the gap is below the AI threshold, treat it as zero.
     */
    const currentScore =
        targetGap?.current ??
        studentSkills[targetSkill.name] ??
        0;

    const requiredScoreFromAI =
        targetGap?.required ??
        requiredScore;

    const gapScore = Math.max(
        requiredScoreFromAI - currentScore,
        0
    );

    /*
     * Convert AI 0-100 scores to the existing MongoDB 1-5 levels.
     */
    const currentLevel = scoreToLevel(currentScore);
    const requiredLevel = scoreToLevel(requiredScoreFromAI);

    const levelGap = Math.max(
        requiredLevel - currentLevel,
        0
    );

    const priority = calculatePriority(
        levelGap,
        demand.demandScore
    );

    /*
     * Save/update the existing SkillGap document.
     */
    const skillGap = await SkillGap.findOneAndUpdate(
        {
            studentId,
            skillId
        },
        {
            studentId,
            skillId,
            currentLevel,
            requiredLevel,
            gap: levelGap,
            demandScore: demand.demandScore,
            priority
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
            "skillId",
            "name category description"
        );

    /*
     * Return both the stored database record and the
     * AI's 0-100 analysis.
     */
    return {
        skillGap,
        aiAnalysis: {
            matchScore: aiResult.match_score,
            currentScore,
            requiredScore: requiredScoreFromAI,
            gapScore
        }
    };
};

// Get all skill gaps
const getAllSkillGaps = async (user) => {
    if (user.role === "admin") {
        return await SkillGap.find()
            .populate(
                "studentId",
                "name email department year"
            )
            .populate(
                "skillId",
                "name category description"
            )
            .sort({
                gap: -1,
                demandScore: -1
            });
    }

    if (user.role === "institute") {
        const students = await Student.find({
            instituteId: user.instituteId
        }).select("_id");

        const studentIds = students.map(
            (student) => student._id
        );

        return await SkillGap.find({
            studentId: {
                $in: studentIds
            }
        })
            .populate(
                "studentId",
                "name email department year"
            )
            .populate(
                "skillId",
                "name category description"
            )
            .sort({
                gap: -1,
                demandScore: -1
            });
    }

    if (user.role === "student") {
        return await SkillGap.find({
            studentId: user.studentId
        })
            .populate(
                "skillId",
                "name category description"
            )
            .sort({
                gap: -1,
                demandScore: -1
            });
    }

    const error = new Error("Access denied");
    error.statusCode = 403;
    throw error;
};

// Get one skill gap
const getSkillGapById = async (id, user) => {
    validateId(id, "skill gap ID");

    const skillGap = await SkillGap.findById(id)
        .populate(
            "studentId",
            "name email department year"
        )
        .populate(
            "skillId",
            "name category description"
        );

    if (!skillGap) {
        const error = new Error("Skill gap not found");
        error.statusCode = 404;
        throw error;
    }

    if (user.role === "admin") {
        return skillGap;
    }

    if (user.role === "student") {
        if (
            !user.studentId ||
            skillGap.studentId._id.toString() !==
            user.studentId.toString()
        ) {
            const error = new Error(
                "You are not authorized to access this skill gap"
            );
            error.statusCode = 403;
            throw error;
        }

        return skillGap;
    }

    if (user.role === "institute") {
        await verifyStudentBelongsToInstitute(
            user.instituteId,
            skillGap.studentId._id
        );

        return skillGap;
    }

    const error = new Error("Access denied");
    error.statusCode = 403;
    throw error;
};

// Get skill gaps for a student
const getStudentSkillGaps = async (
    studentId,
    user
) => {
    validateId(studentId, "student ID");

    const student = await Student.findById(studentId);

    if (!student) {
        const error = new Error("Student not found");
        error.statusCode = 404;
        throw error;
    }

    if (user.role === "student") {
        if (
            !user.studentId ||
            student._id.toString() !==
            user.studentId.toString()
        ) {
            const error = new Error(
                "You are not authorized to access these skill gaps"
            );
            error.statusCode = 403;
            throw error;
        }
    }

    if (user.role === "institute") {
        await verifyStudentBelongsToInstitute(
            user.instituteId,
            studentId
        );
    }

    if (
        !["admin", "student", "institute"].includes(
            user.role
        )
    ) {
        const error = new Error("Access denied");
        error.statusCode = 403;
        throw error;
    }

    return await SkillGap.find({
        studentId
    })
        .populate(
            "skillId",
            "name category description"
        )
        .sort({
            gap: -1,
            demandScore: -1
        });
};

// Delete skill gap
const deleteSkillGap = async (id, user) => {
    validateId(id, "skill gap ID");

    if (user.role !== "admin") {
        const error = new Error(
            "Only admin can delete skill gaps"
        );
        error.statusCode = 403;
        throw error;
    }

    const skillGap = await SkillGap.findByIdAndDelete(id);

    if (!skillGap) {
        const error = new Error("Skill gap not found");
        error.statusCode = 404;
        throw error;
    }

    return skillGap;
};

module.exports = {
    calculateSkillGap,
    getAllSkillGaps,
    getSkillGapById,
    getStudentSkillGaps,
    deleteSkillGap
};