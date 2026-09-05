const mongoose = require("mongoose");

const SkillEvidence = require("../../models/SkillEvidence");
const Student = require("../../models/student");
const Skill = require("../../models/Skill");

const validateId = (id, fieldName) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error(`Invalid ${fieldName}`);
        error.statusCode = 400;
        throw error;
    }
};

const verifyStudentBelongsToInstitute = async (instituteId, studentId) => {
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

// Create skill evidence
const createSkillEvidence = async (data, user) => {
    validateId(data.studentId, "student ID");
    validateId(data.skillId, "skill ID");

    const student = await Student.findById(data.studentId);

    if (!student) {
        const error = new Error("Student not found");
        error.statusCode = 404;
        throw error;
    }

    // Student can create evidence only for themselves
    if (user.role === "student") {
        if (
            !user.studentId ||
            student._id.toString() !== user.studentId.toString()
        ) {
            const error = new Error(
                "You are not authorized to create evidence for this student"
            );
            error.statusCode = 403;
            throw error;
        }
    }

    // Institute can create evidence only for its students
    if (user.role === "institute") {
        await verifyStudentBelongsToInstitute(
            user.instituteId,
            data.studentId
        );
    }

    if (!["student", "institute", "admin"].includes(user.role)) {
        const error = new Error("Access denied");
        error.statusCode = 403;
        throw error;
    }

    const skill = await Skill.findById(data.skillId);

    if (!skill) {
        const error = new Error("Skill not found");
        error.statusCode = 404;
        throw error;
    }

    // Students cannot self-verify evidence
    if (user.role === "student") {
        data.verified = false;
        delete data.verifiedBy;
        delete data.verifiedAt;
    }

    return await SkillEvidence.create(data);
};

// Get all skill evidence
const getAllSkillEvidence = async (user) => {
    if (user.role === "admin") {
        return await SkillEvidence.find()
            .populate("studentId", "name email department year")
            .populate("skillId", "name category description")
            .populate("verifiedBy", "name email role")
            .sort({ createdAt: -1 });
    }

    if (user.role === "institute") {
        const students = await Student.find({
            instituteId: user.instituteId
        }).select("_id");

        const studentIds = students.map(
            (student) => student._id
        );

        return await SkillEvidence.find({
            studentId: { $in: studentIds }
        })
            .populate("studentId", "name email department year")
            .populate("skillId", "name category description")
            .populate("verifiedBy", "name email role")
            .sort({ createdAt: -1 });
    }

    if (user.role === "student") {
        return await SkillEvidence.find({
            studentId: user.studentId
        })
            .populate("skillId", "name category description")
            .populate("verifiedBy", "name email role")
            .sort({ createdAt: -1 });
    }

    const error = new Error("Access denied");
    error.statusCode = 403;
    throw error;
};

// Get evidence by ID
const getSkillEvidenceById = async (id, user) => {
    validateId(id, "skill evidence ID");

    const evidence = await SkillEvidence.findById(id)
        .populate("studentId", "name email department year")
        .populate("skillId", "name category description")
        .populate("verifiedBy", "name email role");

    if (!evidence) {
        const error = new Error("Skill evidence not found");
        error.statusCode = 404;
        throw error;
    }

    if (user.role === "admin") {
        return evidence;
    }

    if (user.role === "student") {
        if (
            !user.studentId ||
            evidence.studentId._id.toString() !==
            user.studentId.toString()
        ) {
            const error = new Error(
                "You are not authorized to access this evidence"
            );
            error.statusCode = 403;
            throw error;
        }

        return evidence;
    }

    if (user.role === "institute") {
        await verifyStudentBelongsToInstitute(
            user.instituteId,
            evidence.studentId._id
        );

        return evidence;
    }

    const error = new Error("Access denied");
    error.statusCode = 403;
    throw error;
};

// Get evidence for a student
const getStudentSkillEvidence = async (studentId, user) => {
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
                "You are not authorized to access this student's evidence"
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

    if (!["admin", "student", "institute"].includes(user.role)) {
        const error = new Error("Access denied");
        error.statusCode = 403;
        throw error;
    }

    return await SkillEvidence.find({ studentId })
        .populate("skillId", "name category description")
        .populate("verifiedBy", "name email role")
        .sort({ createdAt: -1 });
};

// Update skill evidence
const updateSkillEvidence = async (id, data, user) => {
    validateId(id, "skill evidence ID");

    const evidence = await SkillEvidence.findById(id);

    if (!evidence) {
        const error = new Error("Skill evidence not found");
        error.statusCode = 404;
        throw error;
    }

    if (user.role === "student") {
        if (
            !user.studentId ||
            evidence.studentId.toString() !==
            user.studentId.toString()
        ) {
            const error = new Error(
                "You are not authorized to update this evidence"
            );
            error.statusCode = 403;
            throw error;
        }

        // Students cannot modify verification fields
        delete data.verified;
        delete data.verifiedBy;
        delete data.verifiedAt;
        delete data.studentId;
    }

    if (user.role === "institute") {
        await verifyStudentBelongsToInstitute(
            user.instituteId,
            evidence.studentId
        );

        // Institute can verify evidence but cannot transfer ownership
        delete data.studentId;

        if (data.verified === true) {
            data.verifiedBy = user._id;
            data.verifiedAt = new Date();
        }
    }

    if (user.role === "admin") {
        delete data.studentId;

        if (data.verified === true) {
            data.verifiedBy = user._id;
            data.verifiedAt = new Date();
        }
    }

    if (!["student", "institute", "admin"].includes(user.role)) {
        const error = new Error("Access denied");
        error.statusCode = 403;
        throw error;
    }

    delete data._id;

    return await SkillEvidence.findByIdAndUpdate(
        id,
        data,
        {
            new: true,
            runValidators: true
        }
    )
        .populate("studentId", "name email department year")
        .populate("skillId", "name category description")
        .populate("verifiedBy", "name email role");
};

// Delete skill evidence
const deleteSkillEvidence = async (id, user) => {
    validateId(id, "skill evidence ID");

    const evidence = await SkillEvidence.findById(id);

    if (!evidence) {
        const error = new Error("Skill evidence not found");
        error.statusCode = 404;
        throw error;
    }

    // Student can delete their own evidence
    if (user.role === "student") {
        if (
            !user.studentId ||
            evidence.studentId.toString() !==
            user.studentId.toString()
        ) {
            const error = new Error(
                "You are not authorized to delete this evidence"
            );
            error.statusCode = 403;
            throw error;
        }
    } else if (user.role === "institute") {
        await verifyStudentBelongsToInstitute(
            user.instituteId,
            evidence.studentId
        );
    } else if (user.role !== "admin") {
        const error = new Error("Access denied");
        error.statusCode = 403;
        throw error;
    }

    await SkillEvidence.findByIdAndDelete(id);

    return evidence;
};

module.exports = {
    createSkillEvidence,
    getAllSkillEvidence,
    getSkillEvidenceById,
    getStudentSkillEvidence,
    updateSkillEvidence,
    deleteSkillEvidence
};