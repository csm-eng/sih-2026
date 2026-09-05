const express = require("express");

const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");

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

// Student submits application
router.post(
    "/",
    authMiddleware,
    roleMiddleware("student"),
    createApplication
);

// Admin views all applications
router.get(
    "/",
    authMiddleware,
    roleMiddleware("admin"),
    getApplications
);

// Student views own applications
router.get(
    "/student/:studentId",
    authMiddleware,
    roleMiddleware("student"),
    getStudentApplications
);

// Company views applications for its own opportunity
router.get(
    "/opportunity/:opportunityId",
    authMiddleware,
    roleMiddleware("company"),
    getOpportunityApplications
);

// Student/company/admin can view an application,
// with ownership enforced by the service
router.get(
    "/:id",
    authMiddleware,
    getApplicationById
);

// Company updates status of applications for its own opportunity
router.patch(
    "/:id/status",
    authMiddleware,
    roleMiddleware("company"),
    updateApplicationStatus
);

// Student can delete own application; admin can delete any
router.delete(
    "/:id",
    authMiddleware,
    deleteApplication
);

module.exports = router;