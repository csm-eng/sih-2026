const mongoose = require("mongoose");

const Opportunity = require("../../models/Opportunity");
const Company = require("../../models/company");
const Skill = require("../../models/Skill");

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

const getAllOpportunities = async () => {
    return await Opportunity.find()
        .populate("companyId", "name email industry website location")
        .populate(
            "requiredSkills.skillId",
            "name category description"
        )
        .sort({ createdAt: -1 });
};

const getOpportunityById = async (id) => {
    validateId(id, "opportunity ID");

    const opportunity = await Opportunity.findById(id)
        .populate("companyId", "name email industry website location")
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

const getCompanyOpportunities = async (companyId) => {
    validateId(companyId, "company ID");

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

const updateOpportunity = async (id, data) => {
    validateId(id, "opportunity ID");

    if (data.companyId) {
        validateId(data.companyId, "company ID");

        const company = await Company.findById(data.companyId);

        if (!company) {
            const error = new Error("Company not found");
            error.statusCode = 404;
            throw error;
        }
    }

    if (data.requiredSkills) {
        await validateSkills(data.requiredSkills);
    }

    const opportunity = await Opportunity.findByIdAndUpdate(
        id,
        data,
        {
            new: true,
            runValidators: true
        }
    )
        .populate("companyId", "name email industry website location")
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

const deleteOpportunity = async (id) => {
    validateId(id, "opportunity ID");

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
    getOpportunityById,
    getCompanyOpportunities,
    updateOpportunity,
    deleteOpportunity
};