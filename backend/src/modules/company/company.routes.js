const express = require("express");

const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");

const {
    createCompany,
    getCompanies,
    getCompanyById,
    updateCompany,
    deleteCompany,
    getCompanyDashboard
} = require("./company.controller");

const router = express.Router();

// Create company - Admin only
router.post(
    "/",
    authMiddleware,
    roleMiddleware("admin"),
    createCompany
);

// Get all companies - Public
router.get("/", getCompanies);

// Company dashboard - Company only
router.get(
    "/dashboard",
    authMiddleware,
    roleMiddleware("company"),
    getCompanyDashboard
);

// Get one company - Public
router.get("/:id", getCompanyById);

// Update company - Company only
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("company"),
    updateCompany
);

// Delete company - Admin only
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    deleteCompany
);

module.exports = router;