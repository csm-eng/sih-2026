const mongoose = require("mongoose");

const MockQuestion = require("../../models/MockQuestion");
const MockTest = require("../../models/mocktest");
const MockResult = require("../../models/mockresult");
const SkillProfile = require("../../models/SkillProfile");
const Skill = require("../../models/Skill");
const Student = require("../../models/student");

const validateId = (id, fieldName) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error(
            `Invalid ${fieldName}`
        );
        error.statusCode = 400;
        throw error;
    }
};

const authorizeStudent = async (
    studentId,
    user
) => {
    validateId(studentId, "student ID");

    const student = await Student.findById(studentId);

    if (!student) {
        const error = new Error(
            "Student not found"
        );
        error.statusCode = 404;
        throw error;
    }

    if (user.role === "student") {
        if (
            !user.studentId ||
            user.studentId.toString() !==
            studentId.toString()
        ) {
            const error = new Error(
                "You are not authorized to access this test"
            );
            error.statusCode = 403;
            throw error;
        }
    }

    return student;
};

/* =====================================================
   START TEST
===================================================== */

const startMockTest = async (
    studentId,
    skillId,
    user
) => {
    await authorizeStudent(studentId, user);

    validateId(skillId, "skill ID");

    const skill = await Skill.findById(skillId);

    if (!skill) {
        const error = new Error(
            "Skill not found"
        );
        error.statusCode = 404;
        throw error;
    }

    /*
     * Student must have confirmed the skill first.
     */

    const skillProfile =
        await SkillProfile.findOne({
            studentId,
            skillId,
            verified: true,
        });

    if (!skillProfile) {
        const error = new Error(
            "You must confirm this skill before taking its assessment"
        );
        error.statusCode = 400;
        throw error;
    }

    /*
     * Get questions.
     */

    const questions = await MockQuestion.find({
        skillId,
    }).select(
        "_id question options difficulty"
    );

    if (questions.length === 0) {
        const error = new Error(
            "No mock questions available for this skill"
        );
        error.statusCode = 404;
        throw error;
    }

    /*
     * Create test.
     */

    const test = await MockTest.create({
        studentId,
        skillId,
        questions: questions.map(
            (question) => question._id
        ),
    });

    return {
        testId: test._id,
        skill: skill.name,
        questions,
    };
};

/* =====================================================
   SUBMIT TEST
===================================================== */

const submitMockTest = async (
    testId,
    answers,
    user
) => {
    validateId(testId, "mock test ID");

    const test = await MockTest.findById(testId)
        .populate("skillId");

    if (!test) {
        const error = new Error(
            "Mock test not found"
        );
        error.statusCode = 404;
        throw error;
    }

    await authorizeStudent(
        test.studentId,
        user
    );

    if (test.status === "completed") {
        const error = new Error(
            "This test has already been submitted"
        );
        error.statusCode = 400;
        throw error;
    }

    if (!Array.isArray(answers)) {
        const error = new Error(
            "Answers must be an array"
        );
        error.statusCode = 400;
        throw error;
    }

    const questions =
        await MockQuestion.find({
            _id: { $in: test.questions },
        });

    let correctAnswers = 0;

    for (const question of questions) {
        const submitted = answers.find(
            (answer) =>
                answer.questionId?.toString() ===
                question._id.toString()
        );

        if (
            submitted &&
            Number(submitted.answer) ===
            question.correctAnswer
        ) {
            correctAnswers++;
        }
    }

    const totalQuestions = questions.length;

    const score =
        totalQuestions > 0
            ? Math.round(
                (correctAnswers /
                    totalQuestions) *
                100
            )
            : 0;

    /*
     * Prototype proficiency mapping.
     */

    let level;
    let levelName;

    if (score <= 20) {
        level = 1;
        levelName = "Beginner";
    } else if (score <= 40) {
        level = 2;
        levelName = "Developing";
    } else if (score <= 60) {
        level = 3;
        levelName = "Intermediate";
    } else if (score <= 80) {
        level = 4;
        levelName = "Advanced";
    } else {
        level = 5;
        levelName = "Expert";
    }

    /*
     * Mark test completed.
     */

    test.status = "completed";
    test.completedAt = new Date();

    await test.save();

    /*
     * Create result.
     */

    const result = await MockResult.create({
        mockTestId: test._id,
        studentId: test.studentId,
        skillId: test.skillId._id,
        totalQuestions,
        correctAnswers,
        score,
        level,
        levelName,
    });

    /*
     * Update student's skill profile.
     *
     * This is where proficiency is actually established.
     */

    const skillProfile =
        await SkillProfile.findOne({
            studentId: test.studentId,
            skillId: test.skillId._id,
            verified: true,
        });

    if (skillProfile) {
        skillProfile.proficiencyStatus =
            "assessed";

        skillProfile.level = level;

        skillProfile.score = score;

        skillProfile.source =
            "mock_test";

        skillProfile.status =
            levelName.toLowerCase() ===
                "beginner"
                ? "beginner"
                : levelName.toLowerCase();

        skillProfile.lastAssessedAt =
            new Date();

        await skillProfile.save();
    }

    return {
        result,
        skillProfile,
    };
};

/* =====================================================
   GET RESULT
===================================================== */

const getMockResult = async (
    resultId,
    user
) => {
    validateId(
        resultId,
        "mock result ID"
    );

    const result =
        await MockResult.findById(resultId)
            .populate(
                "skillId",
                "name category"
            )
            .populate(
                "studentId",
                "name email department year"
            );

    if (!result) {
        const error = new Error(
            "Mock result not found"
        );
        error.statusCode = 404;
        throw error;
    }

    if (user.role === "student") {
        if (
            !user.studentId ||
            result.studentId._id.toString() !==
            user.studentId.toString()
        ) {
            const error = new Error(
                "You are not authorized to view this result"
            );
            error.statusCode = 403;
            throw error;
        }
    }

    return result;
};

module.exports = {
    startMockTest,
    submitMockTest,
    getMockResult,
};