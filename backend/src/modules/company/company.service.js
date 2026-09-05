const mongoose = require("mongoose");
const Company = require("../../models/company");

const validateId = (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error("Invalid company ID");
        error.statusCode = 400;
        throw error;
    }
};

const createCompany = async (data) => {
    return await Company.create(data);
};

const getAllCompanies = async () => {
    return await Company.find().sort({ createdAt: -1 });
};

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

const updateCompany = async (id, data) => {
    validateId(id);

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

module.exports = {
    createCompany,
    getAllCompanies,
    getCompanyById,
    updateCompany,
    deleteCompany
};