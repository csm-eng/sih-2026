const mongoose = require("mongoose");
const Roadmap = require("../../models/roadmap");
const RoadmapProgress = require("../../models/RoadmapProgress");
const Student = require("../../models/student");

const validateId = (id, name = "ID") => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error(`Invalid ${name}`);
        error.statusCode = 400;
        throw error;
    }
};

const verifyStudentAccess = async (studentId, user) => {
    validateId(studentId, "student ID");

    if (user.role === "student") {
        if (
            !user.studentId ||
            user.studentId.toString() !== studentId.toString()
        ) {
            const error = new Error("Access denied");
            error.statusCode = 403;
            throw error;
        }
    }

    if (user.role === "institute") {
        if (!user.instituteId) {
            const error = new Error(
                "Institute is not linked to this account"
            );
            error.statusCode = 403;
            throw error;
        }

        const student = await Student.findOne({
            _id: studentId,
            instituteId: user.instituteId
        });

        if (!student) {
            const error = new Error(
                "Student does not belong to your institute"
            );
            error.statusCode = 403;
            throw error;
        }
    }

    const student = await Student.findById(studentId);

    if (!student) {
        const error = new Error("Student not found");
        error.statusCode = 404;
        throw error;
    }

    return student;
};


// =====================================================
// ROADMAP TEMPLATES
// =====================================================

const createRoadmap = async (data) => {
    return await Roadmap.create(data);
};


const getRoadmaps = async () => {
    return await Roadmap.find().sort({ createdAt: -1 });
};


const getRoadmapById = async (id) => {
    validateId(id, "roadmap ID");

    const roadmap = await Roadmap.findById(id);

    if (!roadmap) {
        const error = new Error("Roadmap not found");
        error.statusCode = 404;
        throw error;
    }

    return roadmap;
};


const updateRoadmap = async (id, data) => {
    validateId(id, "roadmap ID");

    const roadmap = await Roadmap.findByIdAndUpdate(
        id,
        data,
        {
            new: true,
            runValidators: true
        }
    );

    if (!roadmap) {
        const error = new Error("Roadmap not found");
        error.statusCode = 404;
        throw error;
    }

    return roadmap;
};


const deleteRoadmap = async (id) => {
    validateId(id, "roadmap ID");

    const roadmap = await Roadmap.findByIdAndDelete(id);

    if (!roadmap) {
        const error = new Error("Roadmap not found");
        error.statusCode = 404;
        throw error;
    }

    // Remove progress records linked to this roadmap
    await RoadmapProgress.deleteMany({
        roadmapId: id
    });

    return roadmap;
};


// =====================================================
// ROADMAP PROGRESS
// =====================================================

const createProgress = async (data, user) => {
    await verifyStudentAccess(data.studentId, user);

    validateId(data.roadmapId, "roadmap ID");

    const roadmap = await Roadmap.findById(data.roadmapId);

    if (!roadmap) {
        const error = new Error("Roadmap not found");
        error.statusCode = 404;
        throw error;
    }

    /*
     * If steps are supplied, validate them and calculate
     * overall progress automatically.
     */

    let steps = data.steps || [];

    if (steps.length > 0) {

        const validStepIds = roadmap.steps.map(
            (step) => step._id.toString()
        );

        steps = steps
            .filter((step) =>
                validStepIds.includes(
                    step.stepId?.toString()
                )
            )
            .map((step) => {

                const stepProgress = Math.min(
                    Math.max(
                        Number(step.progress || 0),
                        0
                    ),
                    100
                );

                return {
                    stepId: step.stepId,
                    progress: stepProgress,
                    completed: stepProgress === 100
                };
            });
    }

    /*
     * Calculate overall roadmap progress from steps.
     */

    let progressValue = Number(data.progress || 0);

    if (roadmap.steps.length > 0) {

        const progressMap = new Map(
            steps.map((step) => [
                step.stepId.toString(),
                step.progress
            ])
        );

        const totalProgress = roadmap.steps.reduce(
            (total, roadmapStep) => {
                return (
                    total +
                    Number(
                        progressMap.get(
                            roadmapStep._id.toString()
                        ) || 0
                    )
                );
            },
            0
        );

        progressValue = Math.round(
            totalProgress / roadmap.steps.length
        );
    }

    const completed = progressValue === 100;

    return await RoadmapProgress.findOneAndUpdate(
        {
            studentId: data.studentId,
            roadmapId: data.roadmapId
        },
        {
            studentId: data.studentId,
            roadmapId: data.roadmapId,
            progress: progressValue,
            completed,
            steps
        },
        {
            new: true,
            upsert: true,
            runValidators: true
        }
    );
};


// =====================================================
// GET STUDENT PROGRESS
// =====================================================

const getStudentProgress = async (studentId, user) => {
    await verifyStudentAccess(studentId, user);

    return await RoadmapProgress.find({ studentId })
        .populate("roadmapId")
        .sort({ updatedAt: -1 });
};


// =====================================================
// GET SINGLE PROGRESS
// =====================================================

const getProgressById = async (id, user) => {
    validateId(id, "progress ID");

    const progress = await RoadmapProgress
        .findById(id)
        .populate("roadmapId");

    if (!progress) {
        const error = new Error(
            "Roadmap progress not found"
        );
        error.statusCode = 404;
        throw error;
    }

    await verifyStudentAccess(
        progress.studentId,
        user
    );

    return progress;
};


// =====================================================
// UPDATE PROGRESS
// =====================================================

const updateProgress = async (id, data, user) => {
    validateId(id, "progress ID");

    const progress = await RoadmapProgress.findById(id);

    if (!progress) {
        const error = new Error(
            "Roadmap progress not found"
        );
        error.statusCode = 404;
        throw error;
    }

    await verifyStudentAccess(
        progress.studentId,
        user
    );

    /*
     * Prevent changing ownership.
     */

    delete data.studentId;
    delete data.roadmapId;


    /*
     * If step progress is supplied, calculate the
     * overall roadmap progress automatically.
     */

    if (data.steps !== undefined) {

        const roadmap = await Roadmap.findById(
            progress.roadmapId
        );

        if (!roadmap) {
            const error = new Error(
                "Roadmap not found"
            );
            error.statusCode = 404;
            throw error;
        }

        const validStepIds = roadmap.steps.map(
            (step) => step._id.toString()
        );

        const steps = data.steps
            .filter((step) =>
                validStepIds.includes(
                    step.stepId?.toString()
                )
            )
            .map((step) => {

                const stepProgress = Math.min(
                    Math.max(
                        Number(step.progress || 0),
                        0
                    ),
                    100
                );

                return {
                    stepId: step.stepId,
                    progress: stepProgress,
                    completed:
                        stepProgress === 100
                };
            });

        data.steps = steps;

        if (roadmap.steps.length > 0) {

            const progressMap = new Map(
                steps.map((step) => [
                    step.stepId.toString(),
                    step.progress
                ])
            );

            const totalProgress =
                roadmap.steps.reduce(
                    (total, roadmapStep) => {
                        return (
                            total +
                            Number(
                                progressMap.get(
                                    roadmapStep._id.toString()
                                ) || 0
                            )
                        );
                    },
                    0
                );

            data.progress = Math.round(
                totalProgress /
                roadmap.steps.length
            );

            data.completed =
                data.progress === 100;
        }
    }

    /*
     * Preserve old behavior when only overall progress
     * is sent.
     */

    if (
        data.progress !== undefined &&
        data.steps === undefined
    ) {
        data.progress = Math.min(
            Math.max(
                Number(data.progress),
                0
            ),
            100
        );

        data.completed =
            data.progress === 100;
    }

    const updatedProgress =
        await RoadmapProgress.findByIdAndUpdate(
            id,
            data,
            {
                new: true,
                runValidators: true
            }
        ).populate("roadmapId");

    return updatedProgress;
};


// =====================================================
// DELETE PROGRESS
// =====================================================

const deleteProgress = async (id) => {
    validateId(id, "progress ID");

    const progress =
        await RoadmapProgress.findByIdAndDelete(id);

    if (!progress) {
        const error = new Error(
            "Roadmap progress not found"
        );
        error.statusCode = 404;
        throw error;
    }

    return progress;
};


module.exports = {
    createRoadmap,
    getRoadmaps,
    getRoadmapById,
    updateRoadmap,
    deleteRoadmap,
    createProgress,
    getStudentProgress,
    getProgressById,
    updateProgress,
    deleteProgress
};