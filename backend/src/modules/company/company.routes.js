const express = require("express");

const {
    createCompany,
    getCompanies,
    getCompanyById,
    updateCompany,
    deleteCompany
} = require("./company.controller");

const router = express.Router();

// Create company
router.post("/", createCompany);

// Get all companies
router.get("/", getCompanies);

// Get one company
router.get("/:id", getCompanyById);

// Update company
router.put("/:id", updateCompany);

// Delete company
router.delete("/:id", deleteCompany);

module.exports = router;
