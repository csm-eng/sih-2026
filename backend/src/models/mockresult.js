const mongoose = require("mongoose");

const mockResultSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true
        },

        mockTestId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "MockTest",
            required: true
        },

        score: {
            type: Number,
            required: true,
            min: 0
        },

        weakAreas: {
            type: [String],
            default: []
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("MockResult", mockResultSchema);