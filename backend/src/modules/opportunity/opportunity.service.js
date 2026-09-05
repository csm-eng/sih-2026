const mongoose = require("mongoose");

const Opportunity = require("../../models/Opportunity");
const Company = require("../../models/company");
const Skill = require("../../models/Skill");
const Student = require("../../models/student");

const validateId = (id, fieldName) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error(`Invalid ${fieldName}`);
        error.statusCode = 400;
        throw error;
    }
};

const validateSkills = async (requiredSkills) => {
    if (!requiredSkills || !Array.isArray(requiredSkills)) {
        return;
    }

    for (const item of requiredSkills) {
        validateId(item.skillId, "skill ID");

        const skill = await Skill.findById(item.skillId);

        if (!skill) {
            const error = new Error(`Skill not found: ${item.skillId}`);
            error.statusCode = 404;
            throw error;
        }
    }
};

// Verify that an opportunity belongs to the logged-in company
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
            "You are not authorized to manage this opportunity"
        );
        error.statusCode = 403;
        throw error;
    }

    return opportunity;
};

// Create opportunity
const createOpportunity = async (data) => {
    validateId(data.companyId, "company ID");

    const company = await Company.findById(data.companyId);

    if (!company) {
        const error = new Error("Company not found");
        error.statusCode = 404;
        throw error;
    }

    await validateSkills(data.requiredSkills);

    return await Opportunity.create(data);
};

// Get all opportunities
const getAllOpportunities = async () => {
    return await Opportunity.find()
        .populate(
            "companyId",
            "name email industry website location"
        )
        .populate(
            "requiredSkills.skillId",
            "name category description"
        )
        .sort({ createdAt: -1 });
};

// Get opportunity by ID
const getOpportunityById = async (id) => {
    validateId(id, "opportunity ID");

    const opportunity = await Opportunity.findById(id)
        .populate(
            "companyId",
            "name email industry website location"
        )
        .populate(
            "requiredSkills.skillId",
            "name category description"
        );

    if (!opportunity) {
        const error = new Error("Opportunity not found");
        error.statusCode = 404;
        throw error;
    }

    return opportunity;
};

// Get opportunities belonging to a company
const getCompanyOpportunities = async (
    companyId,
    loggedInCompanyId
) => {
    validateId(companyId, "company ID");
    validateId(loggedInCompanyId, "company ID");

    if (companyId.toString() !== loggedInCompanyId.toString()) {
        const error = new Error(
            "You are not authorized to access these opportunities"
        );
        error.statusCode = 403;
        throw error;
    }

    const company = await Company.findById(companyId);

    if (!company) {
        const error = new Error("Company not found");
        error.statusCode = 404;
        throw error;
    }

    return await Opportunity.find({ companyId })
        .populate(
            "requiredSkills.skillId",
            "name category description"
        )
        .sort({ createdAt: -1 });
};

// Get eligible open opportunities for a student
const getOpenOpportunities = async (studentId) => {
    validateId(studentId, "student ID");

    const student = await Student.findById(studentId);

    if (!student) {
        const error = new Error("Student not found");
        error.statusCode = 404;
        throw error;
    }

    return await Opportunity.find({
        status: "open",
        "eligibility.department": student.department,
        "eligibility.minimumYear": { $lte: student.year },
        "eligibility.minimumCGPA": { $lte: student.cgpa }
    })
        .populate(
            "companyId",
            "name email industry website location"
        )
        .populate(
            "requiredSkills.skillId",
            "name category description"
        )
        .sort({
            applicationDeadline: 1,
            createdAt: -1
        });
};

// Update opportunity
const updateOpportunity = async (
    id,
    data,
    companyId
) => {
    validateId(id, "opportunity ID");
    validateId(companyId, "company ID");

    await verifyCompanyOpportunity(id, companyId);

    // Company ownership cannot be changed
    delete data.companyId;
    delete data._id;

    await validateSkills(data.requiredSkills);

    const opportunity = await Opportunity.findByIdAndUpdate(
        id,
        data,
        {
            new: true,
            runValidators: true
        }
    )
        .populate(
            "companyId",
            "name email industry website location"
        )
        .populate(
            "requiredSkills.skillId",
            "name category description"
        );

    return opportunity;
};

// Delete opportunity
const deleteOpportunity = async (id, companyId) => {
    validateId(id, "opportunity ID");
    validateId(companyId, "company ID");

    await verifyCompanyOpportunity(id, companyId);

    const opportunity = await Opportunity.findByIdAndDelete(id);

    if (!opportunity) {
        const error = new Error("Opportunity not found");
        error.statusCode = 404;
        throw error;
    }

    return opportunity;
};

module.exports = {
    createOpportunity,
    getAllOpportunities,
    getOpenOpportunities,
    getOpportunityById,
    getCompanyOpportunities,
    updateOpportunity,
    deleteOpportunity
};