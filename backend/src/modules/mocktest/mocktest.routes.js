const express = require("express");

const authMiddleware = require("../../middleware/authMiddleware");

const {
    startMockTest,
    submitMockTest,
    getMockResult,
} = require("./mocktest.controller");

const {
    validateStartMockTest,
    validateSubmitMockTest,
} = require("./mocktest.validation");

const router = express.Router();

router.post(
    "/start",
    authMiddleware,
    validateStartMockTest,
    startMockTest
);

router.post(
    "/:testId/submit",
    authMiddleware,
    validateSubmitMockTest,
    submitMockTest
);

router.get(
    "/results/:resultId",
    authMiddleware,
    getMockResult
);

module.exports = router;