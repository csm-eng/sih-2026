const express = require("express");

const authRoutes = require("./modules/auth/auth.routes");
const studentRoutes = require("./modules/student/student.routes");
const skillRoutes = require("./modules/skills/skill.routes");
const skillProfileRoutes = require("./modules/skills/skillProfile.routes");
const skillEvidenceRoutes = require("./modules/skills/skillEvidence.routes");
const skillDemandRoutes = require("./modules/skills/skillDemand.routes");
const skillGapRoutes = require("./modules/skills/skillGap.routes");
const recommendationRoutes = require("./modules/recommendations/recommendation.routes");
const instituteRoutes = require("./modules/institute/institute.routes");
const companyRoutes = require("./modules/company/company.routes");
const opportunityRoutes = require("./modules/opportunity/opportunity.routes");
const shortlistRoutes = require("./modules/shortlist/shortlist.routes");
const applicationRoutes = require("./modules/application/application.routes");
const roadmapRoutes = require("./modules/roadmap/roadmap.routes");
const facultyRoutes = require("./modules/faculty/faculty.routes");
const mentorshipRoutes = require("./modules/mentorship/mentorship.routes");
const errorMiddleware = require("./middleware/errorMiddleware");
const analyticsRoutes = require("./modules/analytics/analytics.routes");

const app = express();

// Middleware
app.use(express.json());

// Test route
app.get("/api/test", (req, res) => {
    res.json({
        message: "Server is receiving requests"
    });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/skill-profiles", skillProfileRoutes);
app.use("/api/skill-evidence", skillEvidenceRoutes);
app.use("/api/skill-demand", skillDemandRoutes);
app.use("/api/skill-gaps", skillGapRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/opportunities", opportunityRoutes);
app.use("/api/shortlists", shortlistRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/roadmaps", roadmapRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/institute", instituteRoutes);
app.use("/api/mentorships", mentorshipRoutes);
app.use("/api/analytics", analyticsRoutes);
// Root route
app.get("/", (req, res) => {
    res.json({
        message: "Career Platform API is running"
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// Error handler
app.use(errorMiddleware);

module.exports = app;