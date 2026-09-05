const express = require("express");

const {
    createApplication,
    getApplications,
    getApplicationById,
    getStudentApplications,
    getOpportunityApplications,
    updateApplicationStatus,
    deleteApplication
} = require("./application.controller");

const router = express.Router();

router.post("/", createApplication);

router.get("/", getApplications);

router.get("/student/:studentId", getStudentApplications);

router.get("/opportunity/:opportunityId", getOpportunityApplications);

router.get("/:id", getApplicationById);

router.patch("/:id/status", updateApplicationStatus);

router.delete("/:id", deleteApplication);

module.exports = router;