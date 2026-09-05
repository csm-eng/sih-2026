const mongoose = require("mongoose");

const Student = require("../../models/student");
const MockResult = require("../../models/mockresult");
const RoadmapProgress = require("../../models/RoadmapProgress");
const Intervention = require("../../models/interventions");

/*
|--------------------------------------------------------------------------
| Validate MongoDB ObjectId
|--------------------------------------------------------------------------
*/

const validateId = (id, fieldName) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error(`Invalid ${fieldName}`);
        error.statusCode = 400;
        throw error;
    }
};

/*
|--------------------------------------------------------------------------
| Validate Institute Account
|--------------------------------------------------------------------------
*/

const validateInstitute = (user) => {
    if (!user || user.role !== "institute") {
        const error = new Error("Institute access required");
        error.statusCode = 403;
        throw error;
    }

    if (!user.instituteId) {
        const error = new Error(
            "Institute account is not linked to an institute"
        );
        error.statusCode = 403;
        throw error;
    }

    validateId(user.instituteId, "institute ID");
};

/*
|--------------------------------------------------------------------------
| Verify Student Belongs To Institute
|--------------------------------------------------------------------------
*/

const verifyStudentBelongsToInstitute = async (
    instituteId,
    studentId
) => {
    validateId(instituteId, "institute ID");
    validateId(studentId, "student ID");

    const student = await Student.findOne({
        _id: studentId,
        instituteId: instituteId,
    }).lean();

    if (!student) {
        const error = new Error(
            "Student not found or does not belong to this institute"
        );
        error.statusCode = 404;
        throw error;
    }

    return student;
};

/*
|--------------------------------------------------------------------------
| Institute Dashboard
|--------------------------------------------------------------------------
*/

const getDashboard = async (user) => {
    validateInstitute(user);

    const instituteId = user.instituteId;

    const students = await Student.find({
        instituteId,
    }).lean();

    const totalStudents = students.length;

    const activeStudents = students.filter(
        (student) => student.status !== "inactive"
    ).length;

    return {
        totalStudents,
        activeStudents,
        instituteId,
    };
};

/*
|--------------------------------------------------------------------------
| Get All Students
|--------------------------------------------------------------------------
*/

const getStudents = async (user) => {
    validateInstitute(user);

    const students = await Student.find({
        instituteId: user.instituteId,
    })
        .select("-password")
        .sort({ createdAt: -1 })
        .lean();

    return students;
};

/*
|--------------------------------------------------------------------------
| Get Student Details
|--------------------------------------------------------------------------
*/

const getStudentDetails = async (user, studentId) => {
    validateInstitute(user);

    const student = await verifyStudentBelongsToInstitute(
        user.instituteId,
        studentId
    );

    return student;
};

/*
|--------------------------------------------------------------------------
| Get Student Roadmap
|--------------------------------------------------------------------------
*/

const getStudentRoadmap = async (user, studentId) => {
    validateInstitute(user);

    await verifyStudentBelongsToInstitute(
        user.instituteId,
        studentId
    );

    const roadmap = await RoadmapProgress.find({
        studentId,
    })
        .populate("roadmapId")
        .lean();

    return roadmap;
};

/*
|--------------------------------------------------------------------------
| Get Student Performance
|--------------------------------------------------------------------------
*/

const getStudentPerformance = async (user, studentId) => {
    validateInstitute(user);

    await verifyStudentBelongsToInstitute(
        user.instituteId,
        studentId
    );

    const results = await MockResult.find({
        studentId,
    }).lean();

    if (!results.length) {
        return {
            totalTests: 0,
            averageScore: 0,
            highestScore: 0,
            lowestScore: 0,
        };
    }

    const scores = results.map(
        (result) => result.score || 0
    );

    const totalTests = scores.length;

    const averageScore =
        scores.reduce((sum, score) => sum + score, 0) /
        totalTests;

    const highestScore = Math.max(...scores);
    const lowestScore = Math.min(...scores);

    return {
        totalTests,
        averageScore: Number(averageScore.toFixed(2)),
        highestScore,
        lowestScore,
    };
};

/*
|--------------------------------------------------------------------------
| Get Student Mock Test Results
|--------------------------------------------------------------------------
*/

const getStudentMockResults = async (
    user,
    studentId
) => {
    validateInstitute(user);

    await verifyStudentBelongsToInstitute(
        user.instituteId,
        studentId
    );

    const results = await MockResult.find({
        studentId,
    })
        .populate("mockTestId")
        .sort({ createdAt: -1 })
        .lean();

    return results;
};

/*
|--------------------------------------------------------------------------
| Get Student Weak Areas
|--------------------------------------------------------------------------
*/

const getStudentWeakAreas = async (
    user,
    studentId
) => {
    validateInstitute(user);

    await verifyStudentBelongsToInstitute(
        user.instituteId,
        studentId
    );

    const results = await MockResult.find({
        studentId,
    }).lean();

    const weakAreas = {};

    results.forEach((result) => {
        if (!result.weakAreas) {
            return;
        }

        result.weakAreas.forEach((area) => {
            if (!weakAreas[area]) {
                weakAreas[area] = 0;
            }

            weakAreas[area]++;
        });
    });

    return Object.entries(weakAreas)
        .map(([area, count]) => ({
            area,
            occurrences: count,
        }))
        .sort(
            (a, b) => b.occurrences - a.occurrences
        );
};

/*
|--------------------------------------------------------------------------
| Create Intervention
|--------------------------------------------------------------------------
*/

const createIntervention = async (
    user,
    studentId,
    interventionData
) => {
    validateInstitute(user);

    if (
        !interventionData ||
        typeof interventionData !== "object"
    ) {
        const error = new Error(
            "Invalid intervention data"
        );
        error.statusCode = 400;
        throw error;
    }

    await verifyStudentBelongsToInstitute(
        user.instituteId,
        studentId
    );

    /*
    | Prevent client from controlling ownership fields.
    */

    const data = {
        ...interventionData,
        studentId,
        instituteId: user.instituteId,
        createdBy: user._id,
    };

    delete data._id;

    const intervention =
        await Intervention.create(data);

    return intervention;
};

/*
|--------------------------------------------------------------------------
| Get Student Interventions
|--------------------------------------------------------------------------
*/

const getStudentInterventions = async (
    user,
    studentId
) => {
    validateInstitute(user);

    await verifyStudentBelongsToInstitute(
        user.instituteId,
        studentId
    );

    const interventions =
        await Intervention.find({
            studentId,
            instituteId: user.instituteId,
        })
            .sort({ createdAt: -1 })
            .lean();

    return interventions;
};

/*
|--------------------------------------------------------------------------
| Update Intervention
|--------------------------------------------------------------------------
*/

const updateIntervention = async (
    user,
    interventionId,
    updateData
) => {
    validateInstitute(user);

    validateId(
        interventionId,
        "intervention ID"
    );

    if (
        !updateData ||
        typeof updateData !== "object"
    ) {
        const error = new Error(
            "Invalid intervention data"
        );
        error.statusCode = 400;
        throw error;
    }

    /*
    | Prevent changing ownership or system fields.
    */

    delete updateData._id;
    delete updateData.studentId;
    delete updateData.instituteId;
    delete updateData.createdBy;

    const intervention =
        await Intervention.findOneAndUpdate(
            {
                _id: interventionId,
                instituteId: user.instituteId,
            },
            updateData,
            {
                new: true,
                runValidators: true,
            }
        );

    if (!intervention) {
        const error = new Error(
            "Intervention not found"
        );
        error.statusCode = 404;
        throw error;
    }

    return intervention;
};

/*
|--------------------------------------------------------------------------
| Exports
|--------------------------------------------------------------------------
*/

module.exports = {
    getDashboard,
    getStudents,
    getStudentDetails,
    getStudentRoadmap,
    getStudentPerformance,
    getStudentMockResults,
    getStudentWeakAreas,
    createIntervention,
    getStudentInterventions,
    updateIntervention,
};