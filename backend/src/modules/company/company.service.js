const mongoose = require("mongoose");

const Company = require("../../models/company");
const Opportunity = require("../../models/Opportunity");
const Application = require("../../models/Application");

const validateId = (id, fieldName = "company ID") => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error(`Invalid ${fieldName}`);
        error.statusCode = 400;
        throw error;
    }
};

// Create company
const createCompany = async (data) => {
    return await Company.create(data);
};

// Get all companies
const getAllCompanies = async () => {
    return await Company.find().sort({ createdAt: -1 });
};

// Get company by ID
const getCompanyById = async (id) => {
    validateId(id);

    const company = await Company.findById(id);

    if (!company) {
        const error = new Error("Company not found");
        error.statusCode = 404;
        throw error;
    }

    return company;
};

// Update company
const updateCompany = async (id, data, loggedInCompanyId) => {
    validateId(id);
    validateId(loggedInCompanyId);

    // Company can update only its own company
    if (id.toString() !== loggedInCompanyId.toString()) {
        const error = new Error(
            "You are not authorized to update this company"
        );
        error.statusCode = 403;
        throw error;
    }

    // Do not allow company to change ownership-related fields
    delete data._id;

    const company = await Company.findByIdAndUpdate(
        id,
        data,
        {
            new: true,
            runValidators: true
        }
    );

    if (!company) {
        const error = new Error("Company not found");
        error.statusCode = 404;
        throw error;
    }

    return company;
};

// Delete company
// Only admin reaches this service through the route
const deleteCompany = async (id) => {
    validateId(id);

    const company = await Company.findByIdAndDelete(id);

    if (!company) {
        const error = new Error("Company not found");
        error.statusCode = 404;
        throw error;
    }

    return company;
};

// Company dashboard
const getCompanyDashboard = async (companyId) => {
    validateId(companyId);

    const company = await Company.findById(companyId);

    if (!company) {
        const error = new Error("Company not found");
        error.statusCode = 404;
        throw error;
    }

    const opportunities = await Opportunity.find({
        companyId: companyId
    });

    const opportunityIds = opportunities.map(
        opportunity => opportunity._id
    );

    const applications = await Application.find({
        opportunityId: { $in: opportunityIds }
    });

    const totalOpportunities = opportunities.length;
    const totalApplications = applications.length;

    const shortlisted = applications.filter(
        application => application.status === "shortlisted"
    ).length;

    const selected = applications.filter(
        application => application.status === "selected"
    ).length;

    const topCandidates = await Application.find({
        opportunityId: { $in: opportunityIds }
    })
        .sort({ matchScore: -1 })
        .limit(5)
        .populate(
            "studentId",
            "name email department year"
        )
        .populate(
            "opportunityId",
            "title type"
        );

    return {
        company: {
            id: company._id,
            name: company.name,
            email: company.email,
            industry: company.industry
        },

        statistics: {
            totalOpportunities,
            totalApplications,
            shortlisted,
            selected
        },

        topCandidates
    };
};

module.exports = {
    createCompany,
    getAllCompanies,
    getCompanyById,
    updateCompany,
    deleteCompany,
    getCompanyDashboard
};