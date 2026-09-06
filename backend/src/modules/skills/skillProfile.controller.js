const skillProfileService = require("./skillProfile.service");
const skillExtractionService = require("../../services/skillExtractionService");

// ======================================================
// CREATE SKILL PROFILE
// ======================================================
const createSkillProfile = async (req, res, next) => {
    try {
        const profile = await skillProfileService.createSkillProfile(
            req.body,
            req.user
        );

        res.status(201).json({
            success: true,
            message: "Skill profile created successfully",
            data: profile
        });
    } catch (error) {
        next(error);
    }
};

// ======================================================
// GET ALL SKILL PROFILES
// ======================================================
const getSkillProfiles = async (req, res, next) => {
    try {
        const profiles = await skillProfileService.getAllSkillProfiles(
            req.user
        );

        res.status(200).json({
            success: true,
            data: profiles
        });
    } catch (error) {
        next(error);
    }
};

// ======================================================
// GET SKILL PROFILE BY ID
// ======================================================
const getSkillProfileById = async (req, res, next) => {
    try {
        const profile = await skillProfileService.getSkillProfileById(
            req.params.id,
            req.user
        );

        res.status(200).json({
            success: true,
            data: profile
        });
    } catch (error) {
        next(error);
    }
};

// ======================================================
// GET ALL SKILL PROFILES OF A STUDENT
// ======================================================
const getStudentSkillProfiles = async (req, res, next) => {
    try {
        const profiles =
            await skillProfileService.getStudentSkillProfiles(
                req.params.studentId,
                req.user
            );

        res.status(200).json({
            success: true,
            data: profiles
        });
    } catch (error) {
        next(error);
    }
};

// ======================================================
// GET VERIFIED SKILL PROFILES
// ======================================================
const getVerifiedStudentSkillProfiles = async (req, res, next) => {
    try {
        const profiles =
            await skillProfileService.getVerifiedStudentSkillProfiles(
                req.params.studentId,
                req.user
            );

        res.status(200).json({
            success: true,
            data: profiles
        });
    } catch (error) {
        next(error);
    }
};

// ======================================================
// GET AI SKILL SUGGESTIONS
// ======================================================
const getAISkillSuggestions = async (req, res, next) => {
    try {
        const profiles =
            await skillProfileService.getAISkillSuggestions(
                req.params.studentId,
                req.user
            );

        res.status(200).json({
            success: true,
            data: profiles
        });
    } catch (error) {
        next(error);
    }
};

// ======================================================
// CONFIRM AI SKILL
// ======================================================
const confirmAISkill = async (req, res, next) => {
    try {
        const profile = await skillProfileService.confirmAISkill(
            req.params.id,
            req.user,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "AI skill confirmed successfully",
            data: profile
        });
    } catch (error) {
        next(error);
    }
};

// ======================================================
// UPDATE SKILL PROFILE
// ======================================================
const updateSkillProfile = async (req, res, next) => {
    try {
        const profile = await skillProfileService.updateSkillProfile(
            req.params.id,
            req.body,
            req.user
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

// ======================================================
// DELETE SKILL PROFILE
// ======================================================
const deleteSkillProfile = async (req, res, next) => {
    try {
        const result = await skillProfileService.deleteSkillProfile(
            req.params.id,
            req.user
        );

        res.status(200).json({
            success: true,
            message: "Skill profile deleted successfully",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

// ======================================================
// EXTRACT SKILLS FROM TEXT / RESUME
// ======================================================
const extractSkillsFromResume = async (req, res, next) => {
    try {
        const profiles =
            await skillExtractionService.extractAndSaveSkills(
                req.params.studentId,
                req.body.text
            );

        res.status(200).json({
            success: true,
            message: "Skills extracted successfully",
            data: profiles
        });
    } catch (error) {
        next(error);
    }
};

// ======================================================
// ANALYZE COMPLETE STUDENT PROFILE USING AI
// ======================================================
const analyzeStudentProfile = async (req, res, next) => {
    try {
        const Student = require("../../models/student");

        const student = await Student.findById(req.params.studentId);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        const {
            interests = [],
            preferredRoles = [],
            careerGoal = "",
            skills = [],
            projects = [],
            certifications = [],
            internships = [],
            achievements = []
        } = student;

        const profileText = `
Career Goal:
${careerGoal}

Interests:
${interests.join(", ")}

Preferred Roles:
${preferredRoles.join(", ")}

Declared Skills:
${skills.join(", ")}

Projects:
${projects
                .map(
                    (project) =>
                        `${project.title || ""} ${project.description || ""
                        } Technologies: ${Array.isArray(project.technologies)
                            ? project.technologies.join(", ")
                            : ""
                        }`
                )
                .join("\n")}

Certifications:
${certifications
                .map(
                    (certificate) =>
                        `${certificate.name || ""} ${certificate.issuer || ""}`
                )
                .join("\n")}

Internships:
${internships
                .map(
                    (internship) =>
                        `${internship.company || ""} ${internship.role || ""
                        } ${internship.description || ""}`
                )
                .join("\n")}

Achievements:
${achievements
                .map(
                    (achievement) =>
                        `${achievement.title || ""} ${achievement.description || ""
                        }`
                )
                .join("\n")}
        `.trim();

        const profiles =
            await skillExtractionService.extractAndSaveSkills(
                req.params.studentId,
                profileText
            );

        res.status(200).json({
            success: true,
            message: "Student profile analyzed successfully",
            data: profiles
        });
    } catch (error) {
        next(error);
    }
};

// ======================================================
// EXPORTS
// ======================================================
module.exports = {
    createSkillProfile,
    getSkillProfiles,
    getSkillProfileById,
    getStudentSkillProfiles,
    getVerifiedStudentSkillProfiles,
    getAISkillSuggestions,
    confirmAISkill,
    updateSkillProfile,
    deleteSkillProfile,
    extractSkillsFromResume,
    analyzeStudentProfile
};