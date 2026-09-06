import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  LayoutDashboard,
  UserRound,
  Brain,
  Target,
  Map,
  BriefcaseBusiness,
  FileText,
  LogOut,
  BookOpen,
} from 'lucide-react';

import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';

import './StudentDashboard.css';

const StudentDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [skillProfiles, setSkillProfiles] = useState([]);
  const [skillGaps, setSkillGaps] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [roadmaps, setRoadmaps] = useState([]);
  const [roadmapProgress, setRoadmapProgress] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError('');

        if (!user?.studentId) {
          setError('Student information is not available.');
          return;
        }

        const studentId = user.studentId;

        const [
          studentResponse,
          skillProfileResponse,
          skillGapResponse,
          recommendationResponse,
          roadmapResponse,
          progressResponse,
        ] = await Promise.all([
          api.get(`/students/${studentId}`),
          api.get(`/skill-profiles/student/${studentId}`),
          api.get(`/skill-gaps/student/${studentId}`),
          api.get(`/recommendations/student/${studentId}`),
          api.get('/roadmaps'),
          api.get(`/roadmaps/progress/student/${studentId}`),
        ]);

        setStudent(
          studentResponse.data?.data ||
          studentResponse.data?.student ||
          studentResponse.data
        );

        setSkillProfiles(
          skillProfileResponse.data?.data ||
          skillProfileResponse.data?.skillProfiles ||
          []
        );

        setSkillGaps(
          skillGapResponse.data?.data ||
          skillGapResponse.data?.skillGaps ||
          []
        );

        setRecommendations(
          recommendationResponse.data?.data ||
          recommendationResponse.data?.recommendations ||
          []
        );

        setRoadmaps(
          roadmapResponse.data?.data ||
          roadmapResponse.data?.roadmaps ||
          []
        );

        setRoadmapProgress(
          progressResponse.data?.data ||
          progressResponse.data?.progress ||
          []
        );

      } catch (err) {
        console.error('Dashboard error:', err);

        setError(
          err.response?.data?.message ||
          'Unable to load dashboard data.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  /* =========================
     ROADMAP DATA
  ========================= */

  const activeProgress =
    roadmapProgress.length > 0
      ? roadmapProgress[0]
      : null;

  const activeRoadmap =
    activeProgress?.roadmapId ||
    roadmaps[0] ||
    null;

  const progress = Number(activeProgress?.progress || 0);

  const roadmapTitle =
    typeof activeRoadmap === 'object'
      ? activeRoadmap?.title
      : 'Learning Roadmap';

  const roadmapDescription =
    typeof activeRoadmap === 'object'
      ? activeRoadmap?.description
      : '';

  const roadmapSkills =
    typeof activeRoadmap === 'object'
      ? activeRoadmap?.skills || []
      : [];

  /* =========================
     HELPERS
  ========================= */

  const getSkillName = (item) => {
    return (
      item?.skillId?.name ||
      item?.skill?.name ||
      item?.name ||
      'Skill'
    );
  };

  const getSkillCategory = (item) => {
    return (
      item?.skillId?.category ||
      item?.skill?.category ||
      item?.category ||
      'Technical Skill'
    );
  };

  if (loading) {
    return (
      <div className="student-dashboard-loading">
        Loading your dashboard...
      </div>
    );
  }

  return (
    <div className="student-dashboard">

      {/* =========================
                SIDEBAR
            ========================= */}

      <aside className="student-sidebar">

        <div className="sidebar-brand">

          <div className="sidebar-logo">
            S
          </div>

          <span>
            SmartHire Hub
          </span>

        </div>

        <div className="sidebar-section-title">
          Student Portal
        </div>

        <nav className="sidebar-nav">

          {/* Dashboard */}

          <button
            className="sidebar-link active"
            onClick={() => navigate('/student/dashboard')}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </button>


          {/* Profile */}

          <button className="sidebar-link">
            <UserRound size={18} />
            <span>My Profile</span>
          </button>


          {/* Skills */}

          <button className="sidebar-link">
            <Brain size={18} />
            <span>Skills</span>
          </button>


          {/* Skill Gaps */}

          <button className="sidebar-link">
            <Target size={18} />
            <span>Skill Gaps</span>
          </button>


          {/* Learning Roadmap */}

          <button
            className="sidebar-link"
            onClick={() => navigate('/student/roadmap')}
          >
            <Map size={18} />
            <span>Learning Roadmap</span>
          </button>


          {/* Opportunities */}

          <button className="sidebar-link">
            <BriefcaseBusiness size={18} />
            <span>Opportunities</span>
          </button>


          {/* Applications */}

          <button className="sidebar-link">
            <FileText size={18} />
            <span>Applications</span>
          </button>

        </nav>


        {/* =========================
                    SIDEBAR BOTTOM
                ========================= */}

        <div className="sidebar-bottom">

          <div className="sidebar-divider"></div>

          <button
            className="sidebar-link logout-button"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>

        </div>

      </aside>


      {/* =========================
                MAIN
            ========================= */}

      <main className="student-main">

        {/* =========================
                    TOPBAR
                ========================= */}

        <header className="student-topbar">

          <div className="topbar-title">
            Student Dashboard
          </div>

          <div className="student-profile">

            <div className="profile-avatar">
              {(student?.name || user?.name || 'S')
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="profile-info">

              <span className="profile-name">
                {student?.name || user?.name || 'Student'}
              </span>

              <span className="profile-role">
                {student?.department || 'Student'}
              </span>

            </div>

          </div>

        </header>


        {/* =========================
                    CONTENT
                ========================= */}

        <div className="student-content">

          {error && (
            <div
              style={{
                marginBottom: '20px',
                padding: '12px 15px',
                borderRadius: '8px',
                background: '#fee2e2',
                color: '#b91c1c',
                fontSize: '13px',
              }}
            >
              {error}
            </div>
          )}


          {/* =========================
                        HEADER
                    ========================= */}

          <div className="dashboard-header">

            <span className="dashboard-label">
              STUDENT OVERVIEW
            </span>

            <h1>
              Welcome, {student?.name || user?.name || 'Student'}
            </h1>

            <p>
              Track your skills, identify gaps and prepare
              for opportunities.
            </p>

          </div>


          {/* =========================
                        SUMMARY CARDS
                    ========================= */}

          <section className="summary-grid">

            <div className="summary-card">

              <div className="summary-card-label">
                Department
              </div>

              <div className="summary-card-value">
                {student?.department || 'N/A'}
              </div>

              <div className="summary-card-meta">
                Academic Department
              </div>

            </div>


            <div className="summary-card">

              <div className="summary-card-label">
                Year
              </div>

              <div className="summary-card-value">
                {student?.year
                  ? `Year ${student.year}`
                  : 'N/A'}
              </div>

              <div className="summary-card-meta">
                Current Academic Year
              </div>

            </div>


            <div className="summary-card">

              <div className="summary-card-label">
                Skills
              </div>

              <div className="summary-card-value">
                {skillProfiles.length}
              </div>

              <div className="summary-card-meta">
                Skills in Profile
              </div>

            </div>


            <div className="summary-card">

              <div className="summary-card-label">
                Skill Gaps
              </div>

              <div className="summary-card-value">
                {skillGaps.length}
              </div>

              <div className="summary-card-meta">
                Areas to Improve
              </div>

            </div>

          </section>


          {/* =========================
                        DASHBOARD GRID
                    ========================= */}

          <section className="dashboard-grid">


            {/* =========================
                            YOUR SKILLS
                        ========================= */}

            <div className="dashboard-card">

              <div className="dashboard-card-header">

                <h3>
                  Your Skills
                </h3>

                <span>
                  Current skill profile
                </span>

              </div>


              {skillProfiles.length > 0 ? (

                <div className="skill-list">

                  {skillProfiles.map((profile, index) => {

                    const level =
                      Number(profile?.level || 0);

                    return (
                      <div
                        className="skill-row"
                        key={profile?._id || index}
                      >

                        <div className="skill-row-top">

                          <span>
                            {getSkillName(profile)}
                          </span>

                          <span>
                            Level {level}
                          </span>

                        </div>

                        <div className="skill-bar">

                          <div
                            className="skill-bar-fill"
                            style={{
                              width: `${Math.min(
                                level * 20,
                                100
                              )}%`,
                            }}
                          ></div>

                        </div>

                        <div className="skill-profile-meta">

                          <span>
                            {getSkillCategory(profile)}
                          </span>

                        </div>

                      </div>
                    );
                  })}

                </div>

              ) : (

                <p
                  style={{
                    color: '#94a3b8',
                    fontSize: '12px',
                  }}
                >
                  No skills added yet.
                </p>

              )}

            </div>


            {/* =========================
                            SKILL GAPS
                        ========================= */}

            <div className="dashboard-card">

              <div className="dashboard-card-header">

                <h3>
                  Skill Gaps
                </h3>

                <span>
                  Areas that need improvement
                </span>

              </div>


              {skillGaps.length > 0 ? (

                <div className="skill-gap-list">

                  {skillGaps.map((gap, index) => {

                    const priority =
                      String(
                        gap?.priority || 'medium'
                      ).toLowerCase();

                    return (
                      <div
                        className="skill-gap-row"
                        key={gap?._id || index}
                      >

                        <div className="skill-gap-top">

                          <div>

                            <span className="skill-gap-name">
                              {getSkillName(gap)}
                            </span>

                            <span className="skill-gap-category">
                              {getSkillCategory(gap)}
                            </span>

                          </div>

                          <span
                            className={`skill-gap-priority ${priority}`}
                          >
                            {priority}
                          </span>

                        </div>


                        <div className="skill-gap-levels">

                          <div>

                            <span>
                              Current
                            </span>

                            <strong>
                              {gap?.currentLevel ??
                                gap?.current ??
                                0}
                            </strong>

                          </div>


                          <div>

                            <span>
                              Required
                            </span>

                            <strong>
                              {gap?.requiredLevel ??
                                gap?.required ??
                                0}
                            </strong>

                          </div>


                          <div>

                            <span>
                              Gap
                            </span>

                            <strong>
                              {gap?.gap ??
                                gap?.difference ??
                                0}
                            </strong>

                          </div>


                          <div>

                            <span>
                              Status
                            </span>

                            <strong>
                              Improve
                            </strong>

                          </div>

                        </div>

                      </div>
                    );
                  })}

                </div>

              ) : (

                <p
                  style={{
                    color: '#94a3b8',
                    fontSize: '12px',
                  }}
                >
                  No skill gaps identified.
                </p>

              )}

            </div>


            {/* =========================
                            RECOMMENDATIONS
                        ========================= */}

            <div className="dashboard-card recommendation-card">

              <div className="dashboard-card-header recommendation-title">

                <div>

                  <h3>
                    Recommended Actions
                  </h3>

                  <span>
                    Improve your employability
                  </span>

                </div>

                <BriefcaseBusiness size={18} />

              </div>


              {recommendations.length > 0 ? (

                <div className="recommendation-list">

                  {recommendations.map(
                    (recommendation, index) => {

                      const priority =
                        String(
                          recommendation?.priority ||
                          'medium'
                        ).toLowerCase();

                      return (
                        <div
                          className="recommendation-row"
                          key={
                            recommendation?._id ||
                            index
                          }
                        >

                          <div className="recommendation-main">

                            <div className="recommendation-icon">

                              <BookOpen size={17} />

                            </div>


                            <div className="recommendation-content">

                              <div className="recommendation-heading">

                                <h4>
                                  {recommendation?.title ||
                                    'Recommended Action'}
                                </h4>

                                <span
                                  className={`recommendation-priority ${priority}`}
                                >
                                  {priority}
                                </span>

                              </div>


                              <p>
                                {recommendation?.description ||
                                  recommendation?.reason ||
                                  'Work on this recommendation to improve your profile.'}
                              </p>


                              <div className="recommendation-meta">

                                {recommendation?.type && (
                                  <span>
                                    {recommendation.type}
                                  </span>
                                )}

                                {recommendation?.skillId?.name && (
                                  <span>
                                    Skill:{' '}
                                    {recommendation.skillId.name}
                                  </span>
                                )}

                              </div>

                            </div>

                          </div>

                        </div>
                      );
                    }
                  )}

                </div>

              ) : (

                <p
                  style={{
                    color: '#94a3b8',
                    fontSize: '12px',
                  }}
                >
                  No recommendations available yet.
                </p>

              )}

            </div>


            {/* =========================
                            LEARNING ROADMAP
                        ========================= */}

            <div className="dashboard-card roadmap-card">

              <div className="dashboard-card-header roadmap-title">

                <div>

                  <h3>
                    Learning Roadmap
                  </h3>

                  <span>
                    Your personalized learning journey
                  </span>

                </div>

                <Map size={18} />

              </div>


              {activeRoadmap ? (

                <div className="roadmap-content">

                  <div className="roadmap-header-row">

                    <div>

                      <h4>
                        {roadmapTitle ||
                          'Learning Roadmap'}
                      </h4>

                      <p>
                        {roadmapDescription ||
                          'Follow this roadmap to improve your skills and career readiness.'}
                      </p>

                    </div>

                    <div className="roadmap-progress-value">
                      {progress}%
                    </div>

                  </div>


                  <div className="roadmap-progress-track">

                    <div
                      className="roadmap-progress-fill"
                      style={{
                        width: `${Math.min(
                          Math.max(progress, 0),
                          100
                        )}%`,
                      }}
                    ></div>

                  </div>


                  <div className="roadmap-progress-meta">

                    <span>
                      {progress >= 100
                        ? 'Completed'
                        : 'In Progress'}
                    </span>

                    <button
                      onClick={() =>
                        navigate('/student/roadmap')
                      }
                      style={{
                        border: 'none',
                        background: 'transparent',
                        color: '#0284c7',
                        cursor: 'pointer',
                        fontSize: '10px',
                        fontWeight: '600',
                      }}
                    >
                      View Roadmap →
                    </button>

                  </div>


                  {roadmapSkills.length > 0 && (

                    <div className="roadmap-skills">

                      {roadmapSkills.map(
                        (skill, index) => (
                          <span
                            className="roadmap-skill"
                            key={index}
                          >
                            {skill}
                          </span>
                        )
                      )}

                    </div>

                  )}

                </div>

              ) : (

                <div className="roadmap-empty">

                  <Map size={28} />

                  <div>

                    <strong>
                      No roadmap assigned yet
                    </strong>

                    <p>
                      Your learning roadmap will appear
                      here once it is assigned.
                    </p>

                  </div>

                </div>

              )}

            </div>


            {/* =========================
                            PROFILE
                        ========================= */}

            <div className="dashboard-card">

              <div className="dashboard-card-header">

                <h3>
                  Profile Information
                </h3>

                <span>
                  Academic details
                </span>

              </div>


              <div className="profile-details">

                <div className="profile-detail">

                  <span className="profile-detail-label">
                    Name
                  </span>

                  <span className="profile-detail-value">
                    {student?.name || 'N/A'}
                  </span>

                </div>


                <div className="profile-detail">

                  <span className="profile-detail-label">
                    Email
                  </span>

                  <span className="profile-detail-value">
                    {student?.email ||
                      user?.email ||
                      'N/A'}
                  </span>

                </div>


                <div className="profile-detail">

                  <span className="profile-detail-label">
                    Department
                  </span>

                  <span className="profile-detail-value">
                    {student?.department || 'N/A'}
                  </span>

                </div>


                <div className="profile-detail">

                  <span className="profile-detail-label">
                    Year
                  </span>

                  <span className="profile-detail-value">
                    {student?.year
                      ? `Year ${student.year}`
                      : 'N/A'}
                  </span>

                </div>


                <div className="profile-detail">

                  <span className="profile-detail-label">
                    CGPA
                  </span>

                  <span className="profile-detail-value">
                    {student?.cgpa ?? 'N/A'}
                  </span>

                </div>


                <div className="profile-detail">

                  <span className="profile-detail-label">
                    Status
                  </span>

                  <span className="profile-detail-value">
                    {student?.status || 'Active'}
                  </span>

                </div>

              </div>

            </div>

          </section>

        </div>

      </main>

    </div>
  );
};

export default StudentDashboard;