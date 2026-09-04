const express = require("express");

const authRoutes = require("./modules/auth/auth.routes");
const studentRoutes = require("./modules/student/student.routes");
const skillRoutes = require("./modules/skills/skill.routes");
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