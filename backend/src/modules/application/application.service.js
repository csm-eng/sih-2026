const mongoose = require("mongoose");

const Application = require("../../models/Application");
const Student = require("../../models/student");
const Opportunity = require("../../models/Opportunity");
const Shortlist = require("../../models/Shortlist");

const validateId = (id, fieldName) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error(`Invalid ${fieldName}`);
        error.statusCode = 400;
        throw error;
    }
};
const verifyCompanyOpportunity = async (opportunityId, companyId) => {
    validateId(opportunityId, "opportunity ID");
    validateId(companyId, "company ID");

    const opportunity = await Opportunity.findById(opportunityId);

    if (!opportunity) {
        const error = new Error("Opportunity not found");
        error.statusCode = 404;
        throw error;
    }

    if (opportunity.companyId.toString() !== companyId.toString()) {
        const error = new Error(
            "You are not authorized to access this opportunity"
        );
        error.statusCode = 403;
        throw error;
    }

    return opportunity;
};
// Create application
const createApplication = async (data) => {
    validateId(data.studentId, "student ID");
    validateId(data.opportunityId, "opportunity ID");

    const student = await Student.findById(data.studentId);

    if (!student) {
        const error = new Error("Student not found");
        error.statusCode = 404;
        throw error;
    }

    const opportunity = await Opportunity.findById(data.opportunityId);

    if (!opportunity) {
        const error = new Error("Opportunity not found");
        error.statusCode = 404;
        throw error;
    }

    if (opportunity.status !== "open") {
        const error = new Error(
            "Opportunity is not open for applications"
        );
        error.statusCode = 400;
        throw error;
    }

    if (
        opportunity.applicationDeadline &&
        new Date(opportunity.applicationDeadline) < new Date()
    ) {
        const error = new Error("Application deadline has passed");
        error.statusCode = 400;
        throw error;
    }

    // Prevent duplicate application
    const existingApplication = await Application.findOne({
        studentId: data.studentId,
        opportunityId: data.opportunityId
    });

    if (existingApplication) {
        const error = new Error(
            "Student has already applied to this opportunity"
        );
        error.statusCode = 409;
        throw error;
    }

    // Get previously calculated match score
    const shortlist = await Shortlist.findOne({
        studentId: data.studentId,
        opportunityId: data.opportunityId
    });

    const matchScore = shortlist ? shortlist.matchScore : 0;

    // Create application with match score
    const application = await Application.create({
        ...data,
        matchScore
    });

    return await Application.findById(application._id)
        .populate(
            "studentId",
            "name email department year"
        )
        .populate(
            "opportunityId",
            "title type companyId location mode"
        );
};

// Get all applications
const getAllApplications = async () => {
    return await Application.find()
        .populate(
            "studentId",
            "name email department year"
        )
        .populate(
            "opportunityId",
            "title type companyId location mode"
        )
        .sort({ appliedAt: -1 });
};

// Get application by ID
const getApplicationById = async (id) => {
    validateId(id, "application ID");

    const application = await Application.findById(id)
        .populate(
            "studentId",
            "name email department year"
        )
        .populate(
            "opportunityId",
            "title type companyId location mode"
        );

    if (!application) {
        const error = new Error("Application not found");
        error.statusCode = 404;
        throw error;
    }

    return application;
};

// Get applications of a student
const getStudentApplications = async (studentId) => {
    validateId(studentId, "student ID");

    const student = await Student.findById(studentId);

    if (!student) {
        const error = new Error("Student not found");
        error.statusCode = 404;
        throw error;
    }

    return await Application.find({ studentId })
        .populate(
            "opportunityId",
            "title type companyId location mode"
        )
        .sort({ appliedAt: -1 });
};

// Get applications for an opportunity
const getOpportunityApplications = async (opportunityId, companyId) => {
    const opportunity = await verifyCompanyOpportunity(
        opportunityId,
        companyId
    );

    return await Application.find({ opportunityId: opportunity._id })
        .populate(
            "studentId",
            "name email department year"
        )
        .populate(
            "opportunityId",
            "title type companyId location mode requiredSkills"
        )
        .sort({ matchScore: -1, appliedAt: -1 });
};
// Update application status
const updateApplicationStatus = async (id, status, companyId) => {
    validateId(id, "application ID");
    validateId(companyId, "company ID");

    const allowedStatuses = [
        "applied",
        "under_review",
        "shortlisted",
        "rejected",
        "selected"
    ];

    if (!allowedStatuses.includes(status)) {
        const error = new Error("Invalid application status");
        error.statusCode = 400;
        throw error;
    }

    const application = await Application.findById(id);

    if (!application) {
        const error = new Error("Application not found");
        error.statusCode = 404;
        throw error;
    }

    const opportunity = await Opportunity.findById(
        application.opportunityId
    );

    if (!opportunity) {
        const error = new Error("Opportunity not found");
        error.statusCode = 404;
        throw error;
    }

    if (
        opportunity.companyId.toString() !==
        companyId.toString()
    ) {
        const error = new Error(
            "You are not authorized to update this application"
        );
        error.statusCode = 403;
        throw error;
    }

    application.status = status;
    application.reviewedAt = new Date();

    await application.save();

    return await Application.findById(application._id)
        .populate(
            "studentId",
            "name email department year"
        )
        .populate(
            "opportunityId",
            "title type companyId location mode"
        );
};

// Delete application
const deleteApplication = async (id) => {
    validateId(id, "application ID");

    const application = await Application.findByIdAndDelete(id);

    if (!application) {
        const error = new Error("Application not found");
        error.statusCode = 404;
        throw error;
    }

    return application;
};

module.exports = {
    createApplication,
    getAllApplications,
    getApplicationById,
    getStudentApplications,
    getOpportunityApplications,
    updateApplicationStatus,
    deleteApplication
};