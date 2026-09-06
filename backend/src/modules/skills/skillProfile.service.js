const mongoose = require("mongoose");

const SkillProfile = require("../../models/SkillProfile");
const Student = require("../../models/student");
const Skill = require("../../models/Skill");

const validateId = (id, fieldName) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error(`Invalid ${fieldName}`);
        error.statusCode = 400;
        throw error;
    }
};

const verifyStudentBelongsToInstitute = async (
    instituteId,
    studentId
) => {
    validateId(instituteId, "institute ID");
    validateId(studentId, "student ID");

    const student = await Student.findOne({
        _id: studentId,
        instituteId,
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

/* =====================================================
   AUTHORIZATION HELPER
===================================================== */

const authorizeStudentAccess = async (studentId, user) => {
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
            student._id.toString() !== user.studentId.toString()
        ) {
            const error = new Error(
                "You are not authorized to access this student's skills"
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
        !["admin", "student", "institute", "company"].includes(
            user.role
        )
    ) {
        const error = new Error("Access denied");
        error.statusCode = 403;
        throw error;
    }

    return student;
};

/* =====================================================
   CREATE
===================================================== */

const createSkillProfile = async (data, user) => {
    validateId(data.studentId, "student ID");
    validateId(data.skillId, "skill ID");

    await authorizeStudentAccess(
        data.studentId,
        user
    );

    const skill = await Skill.findById(data.skillId);

    if (!skill) {
        const error = new Error("Skill not found");
        error.statusCode = 404;
        throw error;
    }

    return await SkillProfile.create(data);
};

/* =====================================================
   GET ALL
===================================================== */

const getAllSkillProfiles = async (user) => {
    if (user.role === "admin") {
        return await SkillProfile.find()
            .populate(
                "studentId",
                "name email department year"
            )
            .populate(
                "skillId",
                "name category description"
            )
            .sort({ createdAt: -1 });
    }

    if (user.role === "institute") {
        const students = await Student.find({
            instituteId: user.instituteId,
        }).select("_id");

        const studentIds = students.map(
            (student) => student._id
        );

        return await SkillProfile.find({
            studentId: { $in: studentIds },
        })
            .populate(
                "studentId",
                "name email department year"
            )
            .populate(
                "skillId",
                "name category description"
            )
            .sort({ createdAt: -1 });
    }

    if (user.role === "student") {
        return await SkillProfile.find({
            studentId: user.studentId,
        })
            .populate(
                "studentId",
                "name email department year"
            )
            .populate(
                "skillId",
                "name category description"
            )
            .sort({ createdAt: -1 });
    }

    const error = new Error("Access denied");
    error.statusCode = 403;
    throw error;
};

/* =====================================================
   GET BY ID
===================================================== */

const getSkillProfileById = async (id, user) => {
    validateId(id, "skill profile ID");

    const profile = await SkillProfile.findById(id)
        .populate(
            "studentId",
            "name email department year"
        )
        .populate(
            "skillId",
            "name category description"
        );

    if (!profile) {
        const error = new Error("Skill profile not found");
        error.statusCode = 404;
        throw error;
    }

    if (user.role === "admin") {
        return profile;
    }

    if (user.role === "student") {
        if (
            !user.studentId ||
            profile.studentId._id.toString() !==
            user.studentId.toString()
        ) {
            const error = new Error(
                "You are not authorized to access this skill"
            );
            error.statusCode = 403;
            throw error;
        }

        return profile;
    }

    if (user.role === "institute") {
        await verifyStudentBelongsToInstitute(
            user.instituteId,
            profile.studentId._id
        );

        return profile;
    }

    const error = new Error("Access denied");
    error.statusCode = 403;
    throw error;
};

/* =====================================================
   GET STUDENT SKILLS
===================================================== */

const getStudentSkillProfiles = async (
    studentId,
    user
) => {
    await authorizeStudentAccess(studentId, user);

    return await SkillProfile.find({
        studentId,
    })
        .populate(
            "skillId",
            "name category description"
        )
        .sort({ createdAt: -1 });
};

/* =====================================================
   VERIFIED / CONFIRMED SKILLS
===================================================== */

const getVerifiedStudentSkillProfiles = async (
    studentId,
    user
) => {
    await authorizeStudentAccess(studentId, user);

    return await SkillProfile.find({
        studentId,
        verified: true,
    })
        .populate(
            "skillId",
            "name category description"
        )
        .sort({ createdAt: -1 });
};

/* =====================================================
   AI SUGGESTIONS
===================================================== */

const getAISkillSuggestions = async (
    studentId,
    user
) => {
    await authorizeStudentAccess(studentId, user);

    return await SkillProfile.find({
        studentId,
        verified: false,
        source: "ai_extraction",
    })
        .populate(
            "skillId",
            "name category description"
        )
        .sort({ createdAt: -1 });
};

/* =====================================================
   CONFIRM AI SKILL
===================================================== */

const confirmAISkill = async (
    id,
    user
) => {
    validateId(id, "skill profile ID");

    const profile = await SkillProfile.findById(id);

    if (!profile) {
        const error = new Error(
            "Skill profile not found"
        );
        error.statusCode = 404;
        throw error;
    }

    await authorizeStudentAccess(
        profile.studentId,
        user
    );

    if (
        profile.source !== "ai_extraction" ||
        profile.verified === true
    ) {
        const error = new Error(
            "This skill is not an AI skill suggestion"
        );
        error.statusCode = 400;
        throw error;
    }

    /*
     * IMPORTANT:
     *
     * Confirming a skill does NOT assign proficiency.
     *
     * The student only confirms:
     * "Yes, this is a skill I want in my profile."
     */

    profile.verified = true;

    profile.proficiencyStatus = "not_assessed";

    profile.level = null;

    profile.score = null;

    profile.status = "not_assessed";

    profile.source = "self_assessment";

    profile.lastAssessedAt = undefined;

    await profile.save();

    return await SkillProfile.findById(profile._id)
        .populate(
            "studentId",
            "name email department year"
        )
        .populate(
            "skillId",
            "name category description"
        );
};

/* =====================================================
   UPDATE
===================================================== */

const updateSkillProfile = async (
    id,
    data,
    user
) => {
    validateId(id, "skill profile ID");

    const profile = await SkillProfile.findById(id);

    if (!profile) {
        const error = new Error(
            "Skill profile not found"
        );
        error.statusCode = 404;
        throw error;
    }

    await authorizeStudentAccess(
        profile.studentId,
        user
    );

    /*
     * Do not allow the frontend to manipulate:
     * - studentId
     * - verified
     * - proficiencyStatus
     * - level
     * - score
     * - source
     *
     * Those should be controlled by dedicated flows.
     */

    const allowedFields = [
        "experienceMonths",
    ];

    const updateData = {};

    allowedFields.forEach((field) => {
        if (data[field] !== undefined) {
            updateData[field] = data[field];
        }
    });

    return await SkillProfile.findByIdAndUpdate(
        id,
        updateData,
        {
            new: true,
            runValidators: true,
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
};

/* =====================================================
   DELETE OWN SKILL
===================================================== */

const deleteSkillProfile = async (
    id,
    user
) => {
    validateId(id, "skill profile ID");

    const profile = await SkillProfile.findById(id);

    if (!profile) {
        const error = new Error(
            "Skill profile not found"
        );
        error.statusCode = 404;
        throw error;
    }

    /*
     * Student can delete only their own skill.
     */

    if (user.role === "student") {
        if (
            !user.studentId ||
            profile.studentId.toString() !==
            user.studentId.toString()
        ) {
            const error = new Error(
                "You are not authorized to remove this skill"
            );
            error.statusCode = 403;
            throw error;
        }
    }

    /*
     * Institute can remove skills only for its students.
     */

    if (user.role === "institute") {
        await verifyStudentBelongsToInstitute(
            user.instituteId,
            profile.studentId
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

    await SkillProfile.findByIdAndDelete(id);

    return profile;
};

module.exports = {
    createSkillProfile,
    getAllSkillProfiles,
    getSkillProfileById,
    getStudentSkillProfiles,
    getVerifiedStudentSkillProfiles,
    getAISkillSuggestions,
    confirmAISkill,
    updateSkillProfile,
    deleteSkillProfile,
};