const express = require("express");

const {
    createOpportunity,
    getOpportunities,
    getOpportunityById,
    getCompanyOpportunities,
    updateOpportunity,
    deleteOpportunity
} = require("./opportunity.controller");

const router = express.Router();

// Create opportunity
router.post("/", createOpportunity);

// Get all opportunities
router.get("/", getOpportunities);

// Get opportunities by company
router.get(
    "/company/:companyId",
    getCompanyOpportunities
);

// Get one opportunity
router.get("/:id", getOpportunityById);

// Update opportunity
router.put("/:id", updateOpportunity);

// Delete opportunity
router.delete("/:id", deleteOpportunity);

module.exports = router;