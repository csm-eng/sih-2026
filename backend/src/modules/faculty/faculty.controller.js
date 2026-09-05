const facultyService = require("./faculty.service");

const createFaculty = async (req, res, next) => {
    try {
        const faculty = await facultyService.createFaculty(
            req.body,
            req.user
        );

        res.status(201).json({
            success: true,
            message: "Faculty created successfully",
            data: faculty
        });
    } catch (error) {
        next(error);
    }
};

const getFaculties = async (req, res, next) => {
    try {
        const faculties = await facultyService.getFaculties(req.user);

        res.status(200).json({
            success: true,
            count: faculties.length,
            data: faculties
        });
    } catch (error) {
        next(error);
    }
};

const getFacultyById = async (req, res, next) => {
    try {
        const faculty = await facultyService.getFacultyById(
            req.params.id,
            req.user
        );

        res.status(200).json({
            success: true,
            data: faculty
        });
    } catch (error) {
        next(error);
    }
};

const updateFaculty = async (req, res, next) => {
    try {
        const faculty = await facultyService.updateFaculty(
            req.params.id,
            req.body,
            req.user
        );

        res.status(200).json({
            success: true,
            message: "Faculty updated successfully",
            data: faculty
        });
    } catch (error) {
        next(error);
    }
};

const deleteFaculty = async (req, res, next) => {
    try {
        await facultyService.deleteFaculty(
            req.params.id,
            req.user
        );

        res.status(200).json({
            success: true,
            message: "Faculty deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createFaculty,
    getFaculties,
    getFacultyById,
    updateFaculty,
    deleteFaculty
};