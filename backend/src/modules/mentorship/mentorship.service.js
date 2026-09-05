const mongoose = require("mongoose");

const Mentorship = require("../../models/Mentorship");
const Student = require("../../models/student");
const Faculty = require("../../models/Faculty");

const validateId = (id, name = "ID") => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error(`Invalid ${name}`);
        error.statusCode = 400;
        throw error;
    }
};

const verifyStudentAccess = async (studentId, user) => {
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
            user.studentId.toString() !== studentId.toString()
        ) {
            const error = new Error("Access denied");
            error.statusCode = 403;
            throw error;
        }
    }

    if (user.role === "institute") {
        if (!user.instituteId) {
            const error = new Error(
                "Institute is not linked to this account"
            );
            error.statusCode = 403;
            throw error;
        }

        if (
            !student.instituteId ||
            student.instituteId.toString() !==
            user.instituteId.toString()
        ) {
            const error = new Error(
                "Student does not belong to your institute"
            );
            error.statusCode = 403;
            throw error;
        }
    }

    return student;
};

const verifyMentorAccess = async (mentorId, instituteId) => {
    validateId(mentorId, "mentor ID");

    const faculty = await Faculty.findById(mentorId);

    if (!faculty) {
        const error = new Error("Mentor not found");
        error.statusCode = 404;
        throw error;
    }

    if (
        faculty.instituteId.toString() !==
        instituteId.toString()
    ) {
        const error = new Error(
            "Mentor does not belong to this institute"
        );
        error.statusCode = 403;
        throw error;
    }

    if (!faculty.availability) {
        const error = new Error("Mentor is currently unavailable");
        error.statusCode = 400;
        throw error;
    }

    return faculty;
};

// ---------- CREATE ----------

const createMentorship = async (data, user) => {
    if (user.role !== "student" && user.role !== "admin") {
        const error = new Error("Access denied");
        error.statusCode = 403;
        throw error;
    }

    const student = await verifyStudentAccess(
        data.studentId,
        user
    );

    validateId(data.mentorId, "mentor ID");

    const faculty = await Faculty.findById(data.mentorId);

    if (!faculty) {
        const error = new Error("Mentor not found");
        error.statusCode = 404;
        throw error;
    }

    if (
        !student.instituteId ||
        faculty.instituteId.toString() !==
        student.instituteId.toString()
    ) {
        const error = new Error(
            "Mentor and student must belong to the same institute"
        );
        error.statusCode = 403;
        throw error;
    }

    if (!faculty.availability) {
        const error = new Error("Mentor is currently unavailable");
        error.statusCode = 400;
        throw error;
    }

    const existing = await Mentorship.findOne({
        studentId: data.studentId,
        mentorId: data.mentorId,
        status: { $in: ["pending", "accepted"] }
    });

    if (existing) {
        const error = new Error(
            "Active mentorship already exists with this mentor"
        );
        error.statusCode = 409;
        throw error;
    }

    const mentorship = await Mentorship.create({
        ...data,
        instituteId: student.instituteId,
        requestedBy: user._id
    });

    return mentorship;
};

// ---------- GET ALL ----------

const getMentorships = async (user) => {
    if (user.role === "admin") {
        return await Mentorship.find()
            .populate("studentId", "name email department year cgpa")
            .populate("mentorId")
            .populate("instituteId", "name")
            .populate("requestedBy", "name email role")
            .sort({ createdAt: -1 });
    }

    if (user.role === "institute") {
        if (!user.instituteId) {
            const error = new Error(
                "Institute is not linked to this account"
            );
            error.statusCode = 403;
            throw error;
        }

        return await Mentorship.find({
            instituteId: user.instituteId
        })
            .populate("studentId", "name email department year cgpa")
            .populate("mentorId")
            .populate("instituteId", "name")
            .populate("requestedBy", "name email role")
            .sort({ createdAt: -1 });
    }

    if (user.role === "student") {
        if (!user.studentId) {
            const error = new Error(
                "Student is not linked to this account"
            );
            error.statusCode = 403;
            throw error;
        }

        return await Mentorship.find({
            studentId: user.studentId
        })
            .populate("studentId", "name email department year cgpa")
            .populate("mentorId")
            .populate("instituteId", "name")
            .sort({ createdAt: -1 });
    }

    const error = new Error("Access denied");
    error.statusCode = 403;
    throw error;
};

// ---------- GET BY ID ----------

const getMentorshipById = async (id, user) => {
    validateId(id, "mentorship ID");

    const mentorship = await Mentorship.findById(id);

    if (!mentorship) {
        const error = new Error("Mentorship not found");
        error.statusCode = 404;
        throw error;
    }

    if (user.role === "student") {
        if (
            !user.studentId ||
            mentorship.studentId.toString() !==
            user.studentId.toString()
        ) {
            const error = new Error("Access denied");
            error.statusCode = 403;
            throw error;
        }
    }

    if (user.role === "institute") {
        if (
            !user.instituteId ||
            mentorship.instituteId.toString() !==
            user.instituteId.toString()
        ) {
            const error = new Error("Access denied");
            error.statusCode = 403;
            throw error;
        }
    }

    if (
        user.role !== "student" &&
        user.role !== "institute" &&
        user.role !== "admin"
    ) {
        const error = new Error("Access denied");
        error.statusCode = 403;
        throw error;
    }

    return await Mentorship.findById(id)
        .populate("studentId", "name email department year cgpa")
        .populate("mentorId")
        .populate("instituteId", "name")
        .populate("requestedBy", "name email role");
};

// ---------- UPDATE ----------

const updateMentorship = async (id, data, user) => {
    validateId(id, "mentorship ID");

    const mentorship = await Mentorship.findById(id);

    if (!mentorship) {
        const error = new Error("Mentorship not found");
        error.statusCode = 404;
        throw error;
    }

    if (user.role === "student") {
        if (
            !user.studentId ||
            mentorship.studentId.toString() !==
            user.studentId.toString()
        ) {
            const error = new Error("Access denied");
            error.statusCode = 403;
            throw error;
        }

        // Students cannot modify ownership or approval fields
        delete data.studentId;
        delete data.mentorId;
        delete data.instituteId;
        delete data.requestedBy;
        delete data.status;
    } else if (user.role === "institute") {
        if (
            !user.instituteId ||
            mentorship.instituteId.toString() !==
            user.instituteId.toString()
        ) {
            const error = new Error("Access denied");
            error.statusCode = 403;
            throw error;
        }

        delete data.studentId;
        delete data.mentorId;
        delete data.instituteId;
        delete data.requestedBy;
    } else if (user.role === "admin") {
        delete data.studentId;
        delete data.instituteId;
        delete data.requestedBy;
    } else {
        const error = new Error("Access denied");
        error.statusCode = 403;
        throw error;
    }

    const updated = await Mentorship.findByIdAndUpdate(
        id,
        data,
        {
            new: true,
            runValidators: true
        }
    )
        .populate("studentId", "name email department year cgpa")
        .populate("mentorId")
        .populate("instituteId", "name")
        .populate("requestedBy", "name email role");

    return updated;
};

// ---------- DELETE ----------

const deleteMentorship = async (id, user) => {
    validateId(id, "mentorship ID");

    const mentorship = await Mentorship.findById(id);

    if (!mentorship) {
        const error = new Error("Mentorship not found");
        error.statusCode = 404;
        throw error;
    }

    if (user.role === "institute") {
        if (
            !user.instituteId ||
            mentorship.instituteId.toString() !==
            user.instituteId.toString()
        ) {
            const error = new Error("Access denied");
            error.statusCode = 403;
            throw error;
        }
    } else if (user.role !== "admin") {
        const error = new Error("Access denied");
        error.statusCode = 403;
        throw error;
    }

    await Mentorship.findByIdAndDelete(id);

    return mentorship;
};

module.exports = {
    createMentorship,
    getMentorships,
    getMentorshipById,
    updateMentorship,
    deleteMentorship
};