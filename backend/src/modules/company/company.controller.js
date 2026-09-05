const companyService = require("./company.service");

const createCompany = async (req, res, next) => {
    try {
        const company = await companyService.createCompany(req.body);

        res.status(201).json({
            success: true,
            message: "Company created successfully",
            data: company
        });
    } catch (error) {
        next(error);
    }
};

const getCompanies = async (req, res, next) => {
    try {
        const companies = await companyService.getAllCompanies();

        res.status(200).json({
            success: true,
            message: "Companies fetched successfully",
            data: companies
        });
    } catch (error) {
        next(error);
    }
};

const getCompanyById = async (req, res, next) => {
    try {
        const company = await companyService.getCompanyById(
            req.params.id
        );

        res.status(200).json({
            success: true,
            message: "Company fetched successfully",
            data: company
        });
    } catch (error) {
        next(error);
    }
};

const updateCompany = async (req, res, next) => {
    try {
        const company = await companyService.updateCompany(
            req.params.id,
            req.body,
            req.user.companyId
        );

        res.status(200).json({
            success: true,
            message: "Company updated successfully",
            data: company
        });
    } catch (error) {
        next(error);
    }
};

const deleteCompany = async (req, res, next) => {
    try {
        await companyService.deleteCompany(req.params.id);

        res.status(200).json({
            success: true,
            message: "Company deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};
const getCompanyDashboard = async (req, res, next) => {
    try {
        const dashboard = await companyService.getCompanyDashboard(
            req.user.companyId
        );

        res.status(200).json({
            success: true,
            message: "Company dashboard fetched successfully",
            data: dashboard
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createCompany,
    getCompanies,
    getCompanyById,
    updateCompany,
    deleteCompany,
    getCompanyDashboard
};