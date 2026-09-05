import React, { useContext, useEffect, useState } from 'react';
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

  const [student, setStudent] = useState(null);
  const [skillProfiles, setSkillProfiles] = useState([]);
  const [skillGaps, setSkillGaps] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.studentId) {
        setError('Student information is not available.');
        setLoading(false);
        return;
      }

      try {
        // 1. Fetch student information
        const studentResponse = await api.get(
          `/students/${user.studentId}`
        );

        setStudent(studentResponse.data.data);

        // 2. Fetch student's skill profiles
        const skillProfileResponse = await api.get(
          `/skill-profiles/student/${user.studentId}`
        );

        setSkillProfiles(
          skillProfileResponse.data.data || []
        );

        // 3. Fetch student's skill gaps
        const skillGapResponse = await api.get(
          `/skill-gaps/student/${user.studentId}`
        );

        setSkillGaps(
          skillGapResponse.data.data || []
        );

        // 4. Fetch student's recommendations
        const recommendationResponse = await api.get(
          `/recommendations/student/${user.studentId}`
        );

        setRecommendations(
          recommendationResponse.data.data || []
        );
      } catch (err) {
        setError(
          err.response?.data?.message ||
          'Unable to load student dashboard.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="student-dashboard-loading">
        Loading your dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="student-dashboard-loading">
        <p>{error}</p>
      </div>
    );
  }

  const initials = student?.name
    ? student.name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
    : 'ST';

  return (
    <div className="student-dashboard">

      {/* Sidebar */}
      <aside className="student-sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo">S</div>
          <span>SmartHire Hub</span>
        </div>

        <div className="sidebar-section-title">
          Workspace
        </div>

        <nav className="sidebar-nav">
          <button className="sidebar-link active">
            <LayoutDashboard size={18} />
            <span>Overview</span>
          </button>

          <button className="sidebar-link">
            <UserRound size={18} />
            <span>My Profile</span>
          </button>

          <button className="sidebar-link">
            <Brain size={18} />
            <span>My Skills</span>
          </button>

          <button className="sidebar-link">
            <Target size={18} />
            <span>Skill Gaps</span>
          </button>

          <button className="sidebar-link">
            <Map size={18} />
            <span>Learning Roadmap</span>
          </button>

          <button className="sidebar-link">
            <BriefcaseBusiness size={18} />
            <span>Opportunities</span>
          </button>

          <button className="sidebar-link">
            <FileText size={18} />
            <span>Applications</span>
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-divider" />

          <button
            className="sidebar-link logout-button"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="student-main">

        {/* Topbar */}
        <header className="student-topbar">
          <div className="topbar-title">
            Student Workspace
          </div>

          <div className="student-profile">
            <div className="profile-avatar">
              {initials}
            </div>

            <div className="profile-info">
              <span className="profile-name">
                {student?.name}
              </span>

              <span className="profile-role">
                Student
              </span>
            </div>
          </div>
        </header>

        {/* Content */}
        <section className="student-content">

          {/* Header */}
          <div className="dashboard-header">
            <span className="dashboard-label">
              Overview
            </span>

            <h1>
              Welcome back,{' '}
              {student?.name?.split(' ')[0]}.
            </h1>

            <p>
              Track your skills, identify gaps and
              discover opportunities aligned with your
              career goals.
            </p>
          </div>

          {/* Summary Cards */}
          <div className="summary-grid">

            <div className="summary-card">
              <div className="summary-card-label">
                CGPA
              </div>

              <div className="summary-card-value">
                {student?.cgpa ?? '—'}
              </div>

              <div className="summary-card-meta">
                Academic performance
              </div>
            </div>

            <div className="summary-card">
              <div className="summary-card-label">
                Skills
              </div>

              <div className="summary-card-value">
                {student?.skills?.length || 0}
              </div>

              <div className="summary-card-meta">
                Skills in your profile
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
                Areas requiring improvement
              </div>
            </div>

            <div className="summary-card">
              <div className="summary-card-label">
                Recommendations
              </div>

              <div className="summary-card-value">
                {recommendations.length}
              </div>

              <div className="summary-card-meta">
                Suggested learning actions
              </div>
            </div>

          </div>

          {/* Skills + Skill Gaps */}
          <div className="dashboard-grid">

            {/* Skills */}
            <div className="dashboard-card">

              <div className="dashboard-card-header">
                <h3>Your Skills</h3>

                <span>
                  Skill intelligence
                </span>
              </div>

              <div className="skill-list">

                {skillProfiles.length > 0 ? (
                  skillProfiles.map((profile) => {
                    const score = Number(
                      profile.score || 0
                    );

                    return (
                      <div
                        className="skill-row"
                        key={profile._id}
                      >

                        <div className="skill-row-top">
                          <span>
                            {profile.skillId?.name ||
                              'Unknown skill'}
                          </span>

                          <span>
                            {score}/100
                          </span>
                        </div>

                        <div className="skill-bar">
                          <div
                            className="skill-bar-fill"
                            style={{
                              width: `${score}%`,
                            }}
                          />
                        </div>

                        <div className="skill-profile-meta">

                          <span>
                            Level{' '}
                            {profile.level}
                          </span>

                          <span>
                            {
                              profile.experienceMonths
                            }{' '}
                            months experience
                          </span>

                          <span>
                            {profile.status}
                          </span>

                          <span>
                            {profile.verified
                              ? 'Verified'
                              : 'Not verified'}
                          </span>

                        </div>

                      </div>
                    );
                  })
                ) : (
                  <p>
                    No skill profiles available yet.
                  </p>
                )}

              </div>
            </div>

            {/* Skill Gaps */}
            <div className="dashboard-card">

              <div className="dashboard-card-header">
                <h3>Skill Gaps</h3>

                <span>
                  Areas to improve
                </span>
              </div>

              <div className="skill-gap-list">

                {skillGaps.length > 0 ? (
                  skillGaps.map((gap) => (
                    <div
                      className="skill-gap-row"
                      key={gap._id}
                    >

                      <div className="skill-gap-top">

                        <div>
                          <span className="skill-gap-name">
                            {gap.skillId?.name ||
                              'Unknown skill'}
                          </span>

                          <span className="skill-gap-category">
                            {gap.skillId?.category ||
                              'Skill'}
                          </span>
                        </div>

                        <span
                          className={`skill-gap-priority ${gap.priority || 'low'
                            }`}
                        >
                          {gap.priority || 'low'}
                        </span>

                      </div>

                      <div className="skill-gap-levels">

                        <div>
                          <span>
                            Current
                          </span>

                          <strong>
                            {gap.currentLevel}
                          </strong>
                        </div>

                        <div>
                          <span>
                            Required
                          </span>

                          <strong>
                            {gap.requiredLevel}
                          </strong>
                        </div>

                        <div>
                          <span>
                            Gap
                          </span>

                          <strong>
                            {gap.gap}
                          </strong>
                        </div>

                        <div>
                          <span>
                            Demand
                          </span>

                          <strong>
                            {gap.demandScore}
                          </strong>
                        </div>

                      </div>

                    </div>
                  ))
                ) : (
                  <p>
                    No skill gaps identified yet.
                  </p>
                )}

              </div>
            </div>

            {/* Recommendations */}
            <div className="dashboard-card recommendation-card">

              <div className="dashboard-card-header">
                <div className="recommendation-title">
                  <BookOpen size={18} />

                  <h3>
                    Recommended Actions
                  </h3>
                </div>

                <span>
                  Based on your skill gaps
                </span>
              </div>

              <div className="recommendation-list">

                {recommendations.length > 0 ? (
                  recommendations.map(
                    (recommendation) => (
                      <div
                        className="recommendation-row"
                        key={recommendation._id}
                      >

                        <div className="recommendation-main">

                          <div className="recommendation-icon">
                            <BookOpen
                              size={17}
                            />
                          </div>

                          <div className="recommendation-content">

                            <div className="recommendation-heading">

                              <h4>
                                {
                                  recommendation.title
                                }
                              </h4>

                              <span
                                className={`recommendation-priority ${recommendation.priority ||
                                  'low'
                                  }`}
                              >
                                {
                                  recommendation.priority ||
                                  'low'
                                }
                              </span>

                            </div>

                            <p>
                              {
                                recommendation.description
                              }
                            </p>

                            <div className="recommendation-meta">

                              <span>
                                Skill:{' '}
                                {
                                  recommendation
                                    .skillId
                                    ?.name
                                }
                              </span>

                              <span>
                                Type:{' '}
                                {
                                  recommendation.type
                                }
                              </span>

                              <span>
                                {recommendation.completed
                                  ? 'Completed'
                                  : 'Not completed'}
                              </span>

                            </div>

                          </div>

                        </div>

                      </div>
                    )
                  )
                ) : (
                  <p>
                    No recommendations available yet.
                  </p>
                )}

              </div>
            </div>

            {/* Profile Information */}
            <div className="dashboard-card">

              <div className="dashboard-card-header">
                <h3>
                  Profile Information
                </h3>

                <span>
                  Current
                </span>
              </div>

              <div className="profile-details">

                <div className="profile-detail">
                  <span className="profile-detail-label">
                    Name
                  </span>

                  <span className="profile-detail-value">
                    {student?.name}
                  </span>
                </div>

                <div className="profile-detail">
                  <span className="profile-detail-label">
                    Email
                  </span>

                  <span className="profile-detail-value">
                    {student?.email}
                  </span>
                </div>

                <div className="profile-detail">
                  <span className="profile-detail-label">
                    Department
                  </span>

                  <span className="profile-detail-value">
                    {student?.department}
                  </span>
                </div>

                <div className="profile-detail">
                  <span className="profile-detail-label">
                    Year
                  </span>

                  <span className="profile-detail-value">
                    Year {student?.year}
                  </span>
                </div>

                <div className="profile-detail">
                  <span className="profile-detail-label">
                    Status
                  </span>

                  <span className="profile-detail-value">
                    {student?.status}
                  </span>
                </div>

              </div>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
};

export default StudentDashboard;