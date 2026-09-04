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

const errorMiddleware = require("./middleware/errorMiddleware");

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

app.use("/api/institute", instituteRoutes);

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