import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StudentProfile.css";

const API_URL = "http://localhost:5000";

// =====================================================
// SIMPLE SVG ICONS
// =====================================================
const Icon = ({ type, size = 19 }) => {
    const common = {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "1.8",
        strokeLinecap: "round",
        strokeLinejoin: "round"
    };

    const icons = {
        dashboard: (
            <>
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
            </>
        ),

        profile: (
            <>
                <circle cx="12" cy="8" r="3.5" />
                <path d="M5 21c.7-4 3-6 7-6s6.3 2 7 6" />
            </>
        ),

        skills: (
            <>
                <path d="M9 4.5a3 3 0 0 1 5.8 1A3.5 3.5 0 0 1 18 12a3.5 3.5 0 0 1-3.2 3.5A3 3 0 0 1 9 19a3 3 0 0 1-2.8-4A3.5 3.5 0 0 1 6 8a3.5 3.5 0 0 1 3-3.5Z" />
                <path d="M9 8h.01M15 8h.01M9 12h.01M15 12h.01M12 16h.01" />
            </>
        ),

        gaps: (
            <>
                <circle cx="12" cy="12" r="8.5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="12" cy="12" r="1" />
            </>
        ),

        roadmap: (
            <>
                <path d="M4 5.5 9 3l6 3 5-2.5v15L15 21l-6-3-5 2.5z" />
                <path d="M9 3v15M15 6v15" />
            </>
        ),

        opportunities: (
            <>
                <rect x="3" y="7" width="18" height="13" rx="2" />
                <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                <path d="M3 12h18M10 12v2h4v-2" />
            </>
        ),

        applications: (
            <>
                <path d="M6 3h9l4 4v14H6z" />
                <path d="M14 3v5h5M9 12h6M9 16h6" />
            </>
        ),

        logout: (
            <>
                <path d="M10 17l5-5-5-5" />
                <path d="M15 12H3" />
                <path d="M20 4v16" />
            </>
        ),

        arrow: (
            <>
                <path d="M5 12h14" />
                <path d="m13 6 6 6-6 6" />
            </>
        ),

        plus: (
            <>
                <path d="M12 5v14M5 12h14" />
            </>
        )
    };

    return <svg {...common}>{icons[type]}</svg>;
};


// =====================================================
// SIDEBAR NAVIGATION
// =====================================================
const SidebarItem = ({
    icon,
    label,
    active = false,
    onClick
}) => {
    return (
        <button
            type="button"
            className={`profile-sidebar-item ${
                active ? "active" : ""
            }`}
            onClick={onClick}
        >
            <Icon type={icon} size={19} />
            <span>{label}</span>
        </button>
    );
};


// =====================================================
// STUDENT PROFILE
// =====================================================
const StudentProfile = () => {
    const navigate = useNavigate();

    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        location: "",
        department: "",
        year: 1,
        cgpa: 0,
        interests: [],
        preferredRoles: [],
        careerGoal: "",
        skills: [],
        projects: [],
        certifications: [],
        internships: [],
        achievements: []
    });

    const [interestInput, setInterestInput] = useState("");
    const [roleInput, setRoleInput] = useState("");
    const [skillInput, setSkillInput] = useState("");

    const token = localStorage.getItem("token");

    // =====================================================
    // GET STUDENT ID
    // =====================================================
    const getStudentIdFromToken = () => {
        try {
            if (!token) return null;

            const payload = JSON.parse(
                atob(token.split(".")[1])
            );

            return payload.studentId;
        } catch (err) {
            console.error(
                "Failed to decode token:",
                err
            );
            return null;
        }
    };

    const studentId =
        getStudentIdFromToken();

    // =====================================================
    // LOAD PROFILE
    // =====================================================
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                if (!token) {
                    setError(
                        "You are not logged in."
                    );
                    setLoading(false);
                    return;
                }

                if (!studentId) {
                    setError(
                        "Student ID not found in authentication token."
                    );
                    setLoading(false);
                    return;
                }

                const response = await fetch(
                    `${API_URL}/api/students/${studentId}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

                const result =
                    await response.json();

                if (!response.ok) {
                    throw new Error(
                        result.message ||
                        "Failed to load student profile"
                    );
                }

                const data = result.data;

                setStudent(data);

                setForm({
                    name: data.name || "",
                    email: data.email || "",
                    phone: data.phone || "",
                    location:
                        data.location || "",
                    department:
                        data.department || "",
                    year: data.year || 1,
                    cgpa: data.cgpa || 0,
                    interests:
                        data.interests || [],
                    preferredRoles:
                        data.preferredRoles ||
                        [],
                    careerGoal:
                        data.careerGoal || "",
                    skills:
                        data.skills || [],
                    projects:
                        data.projects || [],
                    certifications:
                        data.certifications ||
                        [],
                    internships:
                        data.internships || [],
                    achievements:
                        data.achievements || []
                });
            } catch (err) {
                console.error(
                    "Profile loading error:",
                    err
                );

                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [studentId, token]);

    // =====================================================
    // BASIC INPUT
    // =====================================================
    const handleChange = (e) => {
        const {
            name,
            value
        } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // =====================================================
    // TAGS
    // =====================================================
    const addToArray = (
        field,
        value,
        clearInput
    ) => {
        const trimmed =
            value.trim();

        if (!trimmed) return;

        const exists =
            form[field].some(
                (item) =>
                    item.toLowerCase() ===
                    trimmed.toLowerCase()
            );

        if (exists) {
            clearInput("");
            return;
        }

        setForm((prev) => ({
            ...prev,
            [field]: [
                ...prev[field],
                trimmed
            ]
        }));

        clearInput("");
    };

    const removeFromArray = (
        field,
        value
    ) => {
        setForm((prev) => ({
            ...prev,
            [field]:
                prev[field].filter(
                    (item) =>
                        item !== value
                )
        }));
    };

    // =====================================================
    // PROJECTS
    // =====================================================
    const addProject = () => {
        setForm((prev) => ({
            ...prev,
            projects: [
                ...prev.projects,
                {
                    title: "",
                    description: "",
                    technologies: [],
                    projectUrl: ""
                }
            ]
        }));
    };

    const removeProject = (
        index
    ) => {
        setForm((prev) => ({
            ...prev,
            projects:
                prev.projects.filter(
                    (_, i) =>
                        i !== index
                )
        }));
    };

    const handleProjectChange = (
        index,
        field,
        value
    ) => {
        setForm((prev) => {
            const projects = [
                ...prev.projects
            ];

            projects[index] = {
                ...projects[index],
                [field]: value
            };

            return {
                ...prev,
                projects
            };
        });
    };

    // =====================================================
    // CERTIFICATIONS
    // =====================================================
    const addCertification = () => {
        setForm((prev) => ({
            ...prev,
            certifications: [
                ...prev.certifications,
                {
                    name: "",
                    issuer: "",
                    certificateId: ""
                }
            ]
        }));
    };

    const removeCertification = (
        index
    ) => {
        setForm((prev) => ({
            ...prev,
            certifications:
                prev.certifications.filter(
                    (_, i) =>
                        i !== index
                )
        }));
    };

    const handleCertificationChange = (
        index,
        field,
        value
    ) => {
        setForm((prev) => {
            const certifications = [
                ...prev.certifications
            ];

            certifications[index] = {
                ...certifications[index],
                [field]: value
            };

            return {
                ...prev,
                certifications
            };
        });
    };

    // =====================================================
    // INTERNSHIPS
    // =====================================================
    const addInternship = () => {
        setForm((prev) => ({
            ...prev,
            internships: [
                ...prev.internships,
                {
                    company: "",
                    role: "",
                    description: ""
                }
            ]
        }));
    };

    const removeInternship = (
        index
    ) => {
        setForm((prev) => ({
            ...prev,
            internships:
                prev.internships.filter(
                    (_, i) =>
                        i !== index
                )
        }));
    };

    const handleInternshipChange = (
        index,
        field,
        value
    ) => {
        setForm((prev) => {
            const internships = [
                ...prev.internships
            ];

            internships[index] = {
                ...internships[index],
                [field]: value
            };

            return {
                ...prev,
                internships
            };
        });
    };

    // =====================================================
    // ACHIEVEMENTS
    // =====================================================
    const addAchievement = () => {
        setForm((prev) => ({
            ...prev,
            achievements: [
                ...prev.achievements,
                {
                    title: "",
                    description: ""
                }
            ]
        }));
    };

    const removeAchievement = (
        index
    ) => {
        setForm((prev) => ({
            ...prev,
            achievements:
                prev.achievements.filter(
                    (_, i) =>
                        i !== index
                )
        }));
    };

    const handleAchievementChange = (
        index,
        field,
        value
    ) => {
        setForm((prev) => {
            const achievements = [
                ...prev.achievements
            ];

            achievements[index] = {
                ...achievements[index],
                [field]: value
            };

            return {
                ...prev,
                achievements
            };
        });
    };

    // =====================================================
    // SAVE
    // =====================================================
    const handleSave = async (e) => {
        e.preventDefault();

        setSaving(true);
        setError("");

        try {
            const response =
                await fetch(
                    `${API_URL}/api/students/${studentId}`,
                    {
                        method: "PUT",
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                            "Content-Type":
                                "application/json"
                        },
                        body: JSON.stringify({
                            ...form,
                            year: Number(
                                form.year
                            ),
                            cgpa: Number(
                                form.cgpa
                            ),
                            profileCompleted:
                                true
                        })
                    }
                );

            const result =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    "Failed to save profile"
                );
            }

            setStudent(result.data);

            alert(
                "Profile saved successfully!"
            );

            navigate(
                "/student/dashboard"
            );
        } catch (err) {
            console.error(
                "Save profile error:",
                err
            );

            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    // =====================================================
    // LOADING
    // =====================================================
    if (loading) {
        return (
            <div className="profile-loading">
                Loading your profile...
            </div>
        );
    }

    // =====================================================
    // USER INITIAL
    // =====================================================
    const userInitial =
        form.name
            ? form.name
                  .charAt(0)
                  .toUpperCase()
            : "J";

    // =====================================================
    // PAGE
    // =====================================================
    return (
        <div className="student-profile-page">

            {/* =================================================
                SIDEBAR
            ================================================= */}
            <aside className="profile-sidebar">

                <div className="profile-brand">

                    <div className="profile-brand-logo">
                        S
                    </div>

                    <span>
                        SmartHire Hub
                    </span>

                </div>

                <div className="profile-sidebar-title">
                    STUDENT PORTAL
                </div>

                <nav className="profile-sidebar-nav">

                    <SidebarItem
                        icon="dashboard"
                        label="Dashboard"
                        onClick={() =>
                            navigate(
                                "/student/dashboard"
                            )
                        }
                    />

                    <SidebarItem
                        icon="profile"
                        label="My Profile"
                        active
                    />

                    <SidebarItem
                        icon="skills"
                        label="Skills"
                        onClick={() =>
                            navigate(
                                "/student/dashboard"
                            )
                        }
                    />

                    <SidebarItem
                        icon="gaps"
                        label="Skill Gaps"
                        onClick={() =>
                            navigate(
                                "/student/dashboard"
                            )
                        }
                    />

                    <SidebarItem
                        icon="roadmap"
                        label="Learning Roadmap"
                        onClick={() =>
                            navigate(
                                "/student/roadmap"
                            )
                        }
                    />

                    <SidebarItem
                        icon="opportunities"
                        label="Opportunities"
                        onClick={() =>
                            navigate(
                                "/student/dashboard"
                            )
                        }
                    />

                    <SidebarItem
                        icon="applications"
                        label="Applications"
                        onClick={() =>
                            navigate(
                                "/student/dashboard"
                            )
                        }
                    />

                </nav>

            </aside>


            {/* =================================================
                MAIN
            ================================================= */}
            <main className="profile-main">

                {/* TOPBAR */}
                <header className="profile-topbar">

                    <h1>
                        Student Profile
                    </h1>

                    <div className="profile-user">

                        <div className="profile-avatar">
                            {userInitial}
                        </div>

                        <div className="profile-user-details">

                            <strong>
                                {form.name ||
                                    "Student"}
                            </strong>

                            <span>
                                {form.department ||
                                    "Student"}
                            </span>

                        </div>

                    </div>

                </header>


                {/* CONTENT */}
                <div className="profile-content">

                    {/* PAGE INTRO */}
                    <div className="profile-intro">

                        <div>

                            <div className="profile-eyebrow">
                                MY PROFILE
                            </div>

                            <h2>
                                Build your
                                <span>
                                    {" "}career profile
                                </span>
                            </h2>

                            <p>
                                Tell us about your
                                academic journey,
                                interests, skills and
                                experience. Our AI will
                                use this information to
                                recommend relevant
                                skill assessments.
                            </p>

                        </div>

                        <button
                            type="button"
                            className="profile-back-button"
                            onClick={() =>
                                navigate(
                                    "/student/dashboard"
                                )
                            }
                        >
                            ← Dashboard
                        </button>

                    </div>


                    {/* ERROR */}
                    {error && (
                        <div className="profile-error">
                            {error}
                        </div>
                    )}


                    <form
                        className="profile-form"
                        onSubmit={handleSave}
                    >

                        {/* =================================================
                            PERSONAL
                        ================================================= */}
                        <section className="profile-section">

                            <div className="section-heading">

                                <div className="section-number">
                                    01
                                </div>

                                <div>
                                    <h3>
                                        Personal Information
                                    </h3>

                                    <p>
                                        Basic information
                                        about you
                                    </p>
                                </div>

                            </div>

                            <div className="form-grid">

                                <div className="form-group">
                                    <label>
                                        Full Name
                                    </label>

                                    <input
                                        name="name"
                                        value={
                                            form.name
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Your full name"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>
                                        Email
                                    </label>

                                    <input
                                        value={
                                            form.email
                                        }
                                        disabled
                                    />
                                </div>

                                <div className="form-group">
                                    <label>
                                        Phone
                                    </label>

                                    <input
                                        name="phone"
                                        value={
                                            form.phone
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Phone number"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>
                                        Location
                                    </label>

                                    <input
                                        name="location"
                                        value={
                                            form.location
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="City"
                                    />
                                </div>

                            </div>

                        </section>


                        {/* =================================================
                            ACADEMIC
                        ================================================= */}
                        <section className="profile-section">

                            <div className="section-heading">

                                <div className="section-number">
                                    02
                                </div>

                                <div>
                                    <h3>
                                        Academic Information
                                    </h3>

                                    <p>
                                        Your current
                                        academic details
                                    </p>
                                </div>

                            </div>

                            <div className="form-grid">

                                <div className="form-group">
                                    <label>
                                        Department
                                    </label>

                                    <input
                                        name="department"
                                        value={
                                            form.department
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>
                                        Year
                                    </label>

                                    <select
                                        name="year"
                                        value={
                                            form.year
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    >
                                        <option value={1}>
                                            1st Year
                                        </option>

                                        <option value={2}>
                                            2nd Year
                                        </option>

                                        <option value={3}>
                                            3rd Year
                                        </option>

                                        <option value={4}>
                                            4th Year
                                        </option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>
                                        CGPA
                                    </label>

                                    <input
                                        type="number"
                                        name="cgpa"
                                        value={
                                            form.cgpa
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        min="0"
                                        max="10"
                                        step="0.01"
                                    />
                                </div>

                            </div>

                        </section>


                        {/* =================================================
                            CAREER
                        ================================================= */}
                        <section className="profile-section">

                            <div className="section-heading">

                                <div className="section-number">
                                    03
                                </div>

                                <div>
                                    <h3>
                                        Career Direction
                                    </h3>

                                    <p>
                                        Help AI understand
                                        where you want to go
                                    </p>
                                </div>

                            </div>

                            <div className="form-group">

                                <label>
                                    Career Goal
                                </label>

                                <textarea
                                    name="careerGoal"
                                    value={
                                        form.careerGoal
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Example: Become a software engineer and work on AI-powered applications"
                                    rows="4"
                                />

                            </div>


                            {/* INTERESTS */}
                            <div className="tag-input-group">

                                <label>
                                    Career Interests
                                </label>

                                <div className="tag-input">

                                    <input
                                        value={
                                            interestInput
                                        }
                                        onChange={(e) =>
                                            setInterestInput(
                                                e.target.value
                                            )
                                        }
                                        onKeyDown={(e) => {
                                            if (
                                                e.key ===
                                                "Enter"
                                            ) {
                                                e.preventDefault();

                                                addToArray(
                                                    "interests",
                                                    interestInput,
                                                    setInterestInput
                                                );
                                            }
                                        }}
                                        placeholder="e.g. Artificial Intelligence"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            addToArray(
                                                "interests",
                                                interestInput,
                                                setInterestInput
                                            )
                                        }
                                    >
                                        Add
                                    </button>

                                </div>

                                <div className="tags">

                                    {form.interests.map(
                                        (interest) => (
                                            <span
                                                className="tag"
                                                key={
                                                    interest
                                                }
                                            >
                                                {interest}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeFromArray(
                                                            "interests",
                                                            interest
                                                        )
                                                    }
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        )
                                    )}

                                </div>

                            </div>


                            {/* ROLES */}
                            <div className="tag-input-group">

                                <label>
                                    Preferred Roles
                                </label>

                                <div className="tag-input">

                                    <input
                                        value={
                                            roleInput
                                        }
                                        onChange={(e) =>
                                            setRoleInput(
                                                e.target.value
                                            )
                                        }
                                        onKeyDown={(e) => {
                                            if (
                                                e.key ===
                                                "Enter"
                                            ) {
                                                e.preventDefault();

                                                addToArray(
                                                    "preferredRoles",
                                                    roleInput,
                                                    setRoleInput
                                                );
                                            }
                                        }}
                                        placeholder="e.g. Software Engineer"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            addToArray(
                                                "preferredRoles",
                                                roleInput,
                                                setRoleInput
                                            )
                                        }
                                    >
                                        Add
                                    </button>

                                </div>

                                <div className="tags">

                                    {form.preferredRoles.map(
                                        (role) => (
                                            <span
                                                className="tag"
                                                key={role}
                                            >
                                                {role}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeFromArray(
                                                            "preferredRoles",
                                                            role
                                                        )
                                                    }
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        )
                                    )}

                                </div>

                            </div>

                        </section>


                        {/* =================================================
                            SKILLS
                        ================================================= */}
                        <section className="profile-section">

                            <div className="section-heading">

                                <div className="section-number">
                                    04
                                </div>

                                <div>
                                    <h3>
                                        Skills
                                    </h3>

                                    <p>
                                        Skills you currently
                                        consider yourself
                                        familiar with
                                    </p>
                                </div>

                            </div>

                            <div className="tag-input">

                                <input
                                    value={
                                        skillInput
                                    }
                                    onChange={(e) =>
                                        setSkillInput(
                                            e.target.value
                                        )
                                    }
                                    onKeyDown={(e) => {
                                        if (
                                            e.key ===
                                            "Enter"
                                        ) {
                                            e.preventDefault();

                                            addToArray(
                                                "skills",
                                                skillInput,
                                                setSkillInput
                                            );
                                        }
                                    }}
                                    placeholder="e.g. Java"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        addToArray(
                                            "skills",
                                            skillInput,
                                            setSkillInput
                                        )
                                    }
                                >
                                    Add Skill
                                </button>

                            </div>

                            <div className="tags">

                                {form.skills.map(
                                    (skill) => (
                                        <span
                                            className="tag skill-tag"
                                            key={skill}
                                        >
                                            {skill}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeFromArray(
                                                        "skills",
                                                        skill
                                                    )
                                                }
                                            >
                                                ×
                                            </button>
                                        </span>
                                    )
                                )}

                            </div>

                            <div className="ai-note">

                                <div className="ai-note-title">
                                    AI Skill Intelligence
                                </div>

                                <p>
                                    Your declared skills
                                    are used as input
                                    for AI-powered skill
                                    analysis. Proficiency
                                    levels are determined
                                    later through
                                    assessments.
                                </p>

                            </div>

                        </section>


                        {/* =================================================
                            PROJECTS
                        ================================================= */}
                        <section className="profile-section">

                            <div className="section-heading">

                                <div className="section-number">
                                    05
                                </div>

                                <div>
                                    <h3>
                                        Projects
                                    </h3>

                                    <p>
                                        Projects help AI
                                        understand your
                                        practical experience
                                    </p>
                                </div>

                            </div>

                            {form.projects.map(
                                (
                                    project,
                                    index
                                ) => (
                                    <div
                                        className="dynamic-card"
                                        key={
                                            project._id ||
                                            index
                                        }
                                    >

                                        <div className="dynamic-card-header">

                                            <h4>
                                                Project{" "}
                                                {index + 1}
                                            </h4>

                                            <button
                                                type="button"
                                                className="remove-button"
                                                onClick={() =>
                                                    removeProject(
                                                        index
                                                    )
                                                }
                                            >
                                                Remove
                                            </button>

                                        </div>

                                        <div className="form-grid">

                                            <div className="form-group">
                                                <label>
                                                    Project Title
                                                </label>

                                                <input
                                                    value={
                                                        project.title ||
                                                        ""
                                                    }
                                                    onChange={(e) =>
                                                        handleProjectChange(
                                                            index,
                                                            "title",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Project name"
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>
                                                    Project URL
                                                </label>

                                                <input
                                                    value={
                                                        project.projectUrl ||
                                                        ""
                                                    }
                                                    onChange={(e) =>
                                                        handleProjectChange(
                                                            index,
                                                            "projectUrl",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="GitHub / Live URL"
                                                />
                                            </div>

                                        </div>

                                        <div className="form-group">
                                            <label>
                                                Description
                                            </label>

                                            <textarea
                                                value={
                                                    project.description ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    handleProjectChange(
                                                        index,
                                                        "description",
                                                        e.target.value
                                                    )
                                                }
                                                rows="3"
                                                placeholder="Describe what you built"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>
                                                Technologies
                                            </label>

                                            <input
                                                value={
                                                    Array.isArray(
                                                        project.technologies
                                                    )
                                                        ? project.technologies.join(
                                                              ", "
                                                          )
                                                        : ""
                                                }
                                                onChange={(e) =>
                                                    handleProjectChange(
                                                        index,
                                                        "technologies",
                                                        e.target.value
                                                            .split(
                                                                ","
                                                            )
                                                            .map(
                                                                (
                                                                    tech
                                                                ) =>
                                                                    tech.trim()
                                                            )
                                                            .filter(
                                                                Boolean
                                                            )
                                                    )
                                                }
                                                placeholder="Java, MongoDB, React"
                                            />
                                        </div>

                                    </div>
                                )
                            )}

                            <button
                                type="button"
                                className="secondary-button"
                                onClick={
                                    addProject
                                }
                            >
                                <Icon
                                    type="plus"
                                    size={15}
                                />
                                Add Project
                            </button>

                        </section>


                        {/* =================================================
                            CERTIFICATIONS
                        ================================================= */}
                        <section className="profile-section">

                            <div className="section-heading">

                                <div className="section-number">
                                    06
                                </div>

                                <div>
                                    <h3>
                                        Certifications
                                    </h3>

                                    <p>
                                        Your learning
                                        credentials
                                    </p>
                                </div>

                            </div>

                            {form.certifications.map(
                                (
                                    certificate,
                                    index
                                ) => (
                                    <div
                                        className="dynamic-card"
                                        key={
                                            certificate._id ||
                                            index
                                        }
                                    >

                                        <div className="dynamic-card-header">

                                            <h4>
                                                Certification{" "}
                                                {index + 1}
                                            </h4>

                                            <button
                                                type="button"
                                                className="remove-button"
                                                onClick={() =>
                                                    removeCertification(
                                                        index
                                                    )
                                                }
                                            >
                                                Remove
                                            </button>

                                        </div>

                                        <div className="form-grid">

                                            <div className="form-group">
                                                <label>
                                                    Name
                                                </label>

                                                <input
                                                    value={
                                                        certificate.name ||
                                                        ""
                                                    }
                                                    onChange={(e) =>
                                                        handleCertificationChange(
                                                            index,
                                                            "name",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>
                                                    Issuer
                                                </label>

                                                <input
                                                    value={
                                                        certificate.issuer ||
                                                        ""
                                                    }
                                                    onChange={(e) =>
                                                        handleCertificationChange(
                                                            index,
                                                            "issuer",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>
                                                    Certificate ID
                                                </label>

                                                <input
                                                    value={
                                                        certificate.certificateId ||
                                                        ""
                                                    }
                                                    onChange={(e) =>
                                                        handleCertificationChange(
                                                            index,
                                                            "certificateId",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>

                                        </div>

                                    </div>
                                )
                            )}

                            <button
                                type="button"
                                className="secondary-button"
                                onClick={
                                    addCertification
                                }
                            >
                                <Icon
                                    type="plus"
                                    size={15}
                                />
                                Add Certification
                            </button>

                        </section>


                        {/* =================================================
                            INTERNSHIPS
                        ================================================= */}
                        <section className="profile-section">

                            <div className="section-heading">

                                <div className="section-number">
                                    07
                                </div>

                                <div>
                                    <h3>
                                        Internships
                                    </h3>

                                    <p>
                                        Professional
                                        experience
                                    </p>
                                </div>

                            </div>

                            {form.internships.map(
                                (
                                    internship,
                                    index
                                ) => (
                                    <div
                                        className="dynamic-card"
                                        key={
                                            internship._id ||
                                            index
                                        }
                                    >

                                        <div className="dynamic-card-header">

                                            <h4>
                                                Internship{" "}
                                                {index + 1}
                                            </h4>

                                            <button
                                                type="button"
                                                className="remove-button"
                                                onClick={() =>
                                                    removeInternship(
                                                        index
                                                    )
                                                }
                                            >
                                                Remove
                                            </button>

                                        </div>

                                        <div className="form-grid">

                                            <div className="form-group">
                                                <label>
                                                    Company
                                                </label>

                                                <input
                                                    value={
                                                        internship.company ||
                                                        ""
                                                    }
                                                    onChange={(e) =>
                                                        handleInternshipChange(
                                                            index,
                                                            "company",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>
                                                    Role
                                                </label>

                                                <input
                                                    value={
                                                        internship.role ||
                                                        ""
                                                    }
                                                    onChange={(e) =>
                                                        handleInternshipChange(
                                                            index,
                                                            "role",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>

                                        </div>

                                        <div className="form-group">
                                            <label>
                                                Description
                                            </label>

                                            <textarea
                                                value={
                                                    internship.description ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    handleInternshipChange(
                                                        index,
                                                        "description",
                                                        e.target.value
                                                    )
                                                }
                                                rows="3"
                                            />
                                        </div>

                                    </div>
                                )
                            )}

                            <button
                                type="button"
                                className="secondary-button"
                                onClick={
                                    addInternship
                                }
                            >
                                <Icon
                                    type="plus"
                                    size={15}
                                />
                                Add Internship
                            </button>

                        </section>


                        {/* =================================================
                            ACHIEVEMENTS
                        ================================================= */}
                        <section className="profile-section">

                            <div className="section-heading">

                                <div className="section-number">
                                    08
                                </div>

                                <div>
                                    <h3>
                                        Achievements
                                    </h3>

                                    <p>
                                        Hackathons, awards
                                        and accomplishments
                                    </p>
                                </div>

                            </div>

                            {form.achievements.map(
                                (
                                    achievement,
                                    index
                                ) => (
                                    <div
                                        className="dynamic-card"
                                        key={
                                            achievement._id ||
                                            index
                                        }
                                    >

                                        <div className="dynamic-card-header">

                                            <h4>
                                                Achievement{" "}
                                                {index + 1}
                                            </h4>

                                            <button
                                                type="button"
                                                className="remove-button"
                                                onClick={() =>
                                                    removeAchievement(
                                                        index
                                                    )
                                                }
                                            >
                                                Remove
                                            </button>

                                        </div>

                                        <div className="form-group">
                                            <label>
                                                Title
                                            </label>

                                            <input
                                                value={
                                                    achievement.title ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    handleAchievementChange(
                                                        index,
                                                        "title",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>
                                                Description
                                            </label>

                                            <textarea
                                                value={
                                                    achievement.description ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    handleAchievementChange(
                                                        index,
                                                        "description",
                                                        e.target.value
                                                    )
                                                }
                                                rows="3"
                                            />
                                        </div>

                                    </div>
                                )
                            )}

                            <button
                                type="button"
                                className="secondary-button"
                                onClick={
                                    addAchievement
                                }
                            >
                                <Icon
                                    type="plus"
                                    size={15}
                                />
                                Add Achievement
                            </button>

                        </section>


                        {/* =================================================
                            SAVE
                        ================================================= */}
                        <div className="profile-submit-area">

                            <div>
                                <h3>
                                    Ready to build your
                                    skill profile?
                                </h3>

                                <p>
                                    Save your information
                                    and continue to
                                    AI-powered skill
                                    analysis.
                                </p>
                            </div>

                            <button
                                type="submit"
                                className="save-profile-button"
                                disabled={saving}
                            >
                                {saving
                                    ? "Saving..."
                                    : "Save Profile & Continue →"}
                            </button>

                        </div>

                    </form>

                </div>

            </main>

        </div>
    );
};

export default StudentProfile;