const express = require("express");

const studentRoutes = require("./modules/student/student.routes");

const app = express();


// BODY PARSER
app.use(express.json());


// SERVER TEST
app.get("/api/test", (req, res) => {
    res.json({
        message: "Server is receiving requests"
    });
});


// STUDENT API
app.use(
    "/api/students",
    studentRoutes
);


// ROOT
app.get("/", (req, res) => {
    res.json({
        message: "Academia-Industry Career Platform API"
    });
});


// 404 HANDLER
app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});


module.exports = app;