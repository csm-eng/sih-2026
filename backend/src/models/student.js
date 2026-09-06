const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
    {
        // =====================================================
        // PERSONAL INFORMATION
        // =====================================================
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        phone: {
            type: String,
            trim: true,
            default: ""
        },

        location: {
            type: String,
            trim: true,
            default: ""
        },

        // =====================================================
        // ACADEMIC INFORMATION
        // =====================================================
        department: {
            type: String,
            required: true,
            trim: true
        },

        year: {
            type: Number,
            required: true,
            min: 1,
            max: 4
        },

        cgpa: {
            type: Number,
            min: 0,
            max: 10,
            default: 0
        },

        instituteId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Institute",
            default: null
        },

        // =====================================================
        // CAREER / INTERESTS
        // =====================================================
        interests: {
            type: [String],
            default: []
        },

        preferredRoles: {
            type: [String],
            default: []
        },

        careerGoal: {
            type: String,
            trim: true,
            default: ""
        },

        // =====================================================
        // STUDENT DECLARED SKILLS
        // These are skills entered by the student.
        // They are NOT automatically treated as verified skills.
        // =====================================================
        skills: {
            type: [String],
            default: []
        },

        // =====================================================
        // PROJECTS
        // =====================================================
        projects: {
            type: [
                {
                    title: {
                        type: String,
                        trim: true
                    },

                    description: {
                        type: String,
                        trim: true
                    },

                    technologies: {
                        type: [String],
                        default: []
                    },

                    projectUrl: {
                        type: String,
                        trim: true,
                        default: ""
                    }
                }
            ],
            default: []
        },

        // =====================================================
        // CERTIFICATIONS
        // =====================================================
        certifications: {
            type: [
                {
                    name: {
                        type: String,
                        trim: true
                    },

                    issuer: {
                        type: String,
                        trim: true
                    },

                    certificateId: {
                        type: String,
                        trim: true
                    },

                    issueDate: {
                        type: Date
                    }
                }
            ],
            default: []
        },

        // =====================================================
        // INTERNSHIPS
        // =====================================================
        internships: {
            type: [
                {
                    company: {
                        type: String,
                        trim: true
                    },

                    role: {
                        type: String,
                        trim: true
                    },

                    startDate: {
                        type: Date
                    },

                    endDate: {
                        type: Date
                    },

                    description: {
                        type: String,
                        trim: true
                    }
                }
            ],
            default: []
        },

        // =====================================================
        // ACHIEVEMENTS
        // =====================================================
        achievements: {
            type: [
                {
                    title: {
                        type: String,
                        trim: true
                    },

                    description: {
                        type: String,
                        trim: true
                    },

                    date: {
                        type: Date
                    }
                }
            ],
            default: []
        },

        // =====================================================
        // RESUME
        // =====================================================
        resume: {
            fileUrl: {
                type: String,
                trim: true,
                default: ""
            },

            fileName: {
                type: String,
                trim: true,
                default: ""
            },

            uploadedAt: {
                type: Date,
                default: null
            }
        },

        // =====================================================
        // PROFILE STATUS
        // =====================================================
        profileCompleted: {
            type: Boolean,
            default: false
        },

        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Student", studentSchema);