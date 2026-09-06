const deleteSkillProfile = async (id, user) => {
    validateId(id, "skill profile ID");

    const skillProfile =
        await SkillProfile.findById(id);

    if (!skillProfile) {
        const error = new Error(
            "Skill profile not found"
        );
        error.statusCode = 404;
        throw error;
    }

    /*
     * Student can remove their own skill.
     */
    if (user.role === "student") {
        if (
            !user.studentId ||
            user.studentId.toString() !==
            skillProfile.studentId.toString()
        ) {
            const error = new Error(
                "You are not authorized to remove this skill"
            );
            error.statusCode = 403;
            throw error;
        }
    }

    /*
     * Institute can remove skills belonging
     * to its students.
     */
    if (user.role === "institute") {
        await verifyStudentBelongsToInstitute(
            skillProfile.studentId,
            user
        );
    }

    /*
     * Admin is allowed to remove any skill.
     */

    await SkillProfile.findByIdAndDelete(id);

    return {
        deletedSkillProfileId: id
    };
};