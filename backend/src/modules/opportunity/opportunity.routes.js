const express = require("express");

const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");

const {
    createOpportunityController,
    getOpportunities,
    getOpenOpportunitiesController,
    getOpportunity,
    getCompanyOpportunityList,
    updateOpportunityController,
    deleteOpportunityController
} = require("./opportunity.controller");

const router = express.Router();

// Public - get all opportunities
router.get("/", getOpportunities);

// Student - get open opportunities
router.get(
    "/open",
    authMiddleware,
    roleMiddleware("student"),
    getOpenOpportunitiesController
);

// Company - get its own opportunities
router.get(
    "/company/:companyId",
    authMiddleware,
    roleMiddleware("company"),
    getCompanyOpportunityList
);

// Public - get opportunity by ID
router.get("/:id", getOpportunity);

// Company - create opportunity
router.post(
    "/",
    authMiddleware,
    roleMiddleware("company"),
    createOpportunityController
);

// Company - update own opportunity
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("company"),
    updateOpportunityController
);

// Company - delete own opportunity
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("company"),
    deleteOpportunityController
);

module.exports = router;