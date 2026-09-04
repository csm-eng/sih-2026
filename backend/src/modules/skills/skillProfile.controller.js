const skillProfileService = require("./skillProfile.service");

const createSkillProfile = async (req, res, next) => {
    try {
        const profile = await skillProfileService.createSkillProfile(req.body);

        res.status(201).json({
            success: true,
            message: "Skill profile created successfully",
            data: profile
        });
    } catch (error) {
        next(error);
    }
};

const getSkillProfiles = async (req, res, next) => {
    try {
        const profiles = await skillProfileService.getAllSkillProfiles();

        res.status(200).json({
            success: true,
            message: "Skill profiles fetched successfully",
            data: profiles
        });
    } catch (error) {
        next(error);
    }
};

const getSkillProfileById = async (req, res, next) => {
    try {
        const profile = await skillProfileService.getSkillProfileById(
            req.params.id
        );

        res.status(200).json({
            success: true,
            message: "Skill profile fetched successfully",
            data: profile
        });
    } catch (error) {
        next(error);
    }
};

const getStudentSkillProfiles = async (req, res, next) => {
    try {
        const profiles =
            await skillProfileService.getStudentSkillProfiles(
                req.params.studentId
            );

        res.status(200).json({
            success: true,
            message: "Student skill profiles fetched successfully",
            data: profiles
        });
    } catch (error) {
        next(error);
    }
};

const updateSkillProfile = async (req, res, next) => {
    try {
        const profile = await skillProfileService.updateSkillProfile(
            req.params.id,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Skill profile updated successfully",
            data: profile
        });
    } catch (error) {
        next(error);
    }
};

const deleteSkillProfile = async (req, res, next) => {
    try {
        await skillProfileService.deleteSkillProfile(req.params.id);

        res.status(200).json({
            success: true,
            message: "Skill profile deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createSkillProfile,
    getSkillProfiles,
    getSkillProfileById,
    getStudentSkillProfiles,
    updateSkillProfile,
    deleteSkillProfile
};