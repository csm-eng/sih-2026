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
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Circle,
  Save,
  LoaderCircle,
} from 'lucide-react';

import { AuthContext } from '../../../context/AuthContext';
import api from '../../../services/api';

import './LearningRoadmap.css';

const LearningRoadmap = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [roadmaps, setRoadmaps] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    const fetchRoadmapData = async () => {
      if (!user?.studentId) {
        setError('Student information is not available.');
        setLoading(false);
        return;
      }

      try {
        const [roadmapResponse, progressResponse] =
          await Promise.all([
            api.get('/roadmaps'),
            api.get(
              `/roadmaps/progress/student/${user.studentId}`
            ),
          ]);

        setRoadmaps(roadmapResponse.data?.data || []);
        setProgress(progressResponse.data?.data || []);
      } catch (err) {
        console.error('Roadmap error:', err);

        setError(
          err.response?.data?.message ||
          'Unable to load learning roadmap.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmapData();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleStepProgressChange = (
    stepId,
    value
  ) => {
    const numericValue = Math.min(
      Math.max(Number(value), 0),
      100
    );

    setProgress((currentProgress) =>
      currentProgress.map((item, index) => {
        if (index !== 0) {
          return item;
        }

        return {
          ...item,
          steps: (item.steps || []).map((step) =>
            step.stepId === stepId
              ? {
                ...step,
                progress: numericValue,
                completed: numericValue === 100,
              }
              : step
          ),
        };
      })
    );
  };

  const handleSaveProgress = async () => {
    const activeProgress = progress[0];

    if (!activeProgress?._id) {
      setError(
        'No roadmap progress record is available.'
      );
      return;
    }

    try {
      setSaving(true);
      setSaveMessage('');
      setError('');

      const response = await api.put(
        `/roadmaps/progress/${activeProgress._id}`,
        {
          steps: activeProgress.steps || [],
        }
      );

      const updatedProgress =
        response.data?.data;

      if (updatedProgress) {
        setProgress((currentProgress) =>
          currentProgress.map((item, index) =>
            index === 0
              ? updatedProgress
              : item
          )
        );
      }

      setSaveMessage(
        'Progress saved successfully.'
      );

      setTimeout(() => {
        setSaveMessage('');
      }, 3000);
    } catch (err) {
      console.error(
        'Save roadmap progress error:',
        err
      );

      setError(
        err.response?.data?.message ||
        'Unable to save roadmap progress.'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="learning-roadmap-loading">
        Loading your learning roadmap...
      </div>
    );
  }

  if (error && !progress.length) {
    return (
      <div className="learning-roadmap-loading">
        <p>{error}</p>
      </div>
    );
  }

  const activeProgress = progress[0];

  const activeRoadmap =
    activeProgress?.roadmapId ||
    roadmaps[0] ||
    null;

  const currentProgress = Number(
    activeProgress?.progress || 0
  );

  const roadmapSteps =
    activeRoadmap?.steps || [];

  const stepProgressMap = new globalThis.Map(
    (activeProgress?.steps || []).map(
      (step) => [
        step.stepId?.toString(),
        step,
      ]
    )
  );

  return (
    <div className="learning-roadmap-page">

      {/* =========================
          SIDEBAR
      ========================= */}

      <aside className="roadmap-sidebar">

        <div className="roadmap-sidebar-brand">
          <div className="roadmap-sidebar-logo">
            S
          </div>

          <span>
            SmartHire Hub
          </span>
        </div>

        <div className="roadmap-sidebar-section">
          Student Portal
        </div>

        <nav className="roadmap-sidebar-nav">

          <button
            className="roadmap-sidebar-link"
            onClick={() =>
              navigate('/student/dashboard')
            }
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </button>

          <button className="roadmap-sidebar-link">
            <UserRound size={18} />
            <span>My Profile</span>
          </button>

          <button className="roadmap-sidebar-link">
            <Brain size={18} />
            <span>Skills</span>
          </button>

          <button className="roadmap-sidebar-link">
            <Target size={18} />
            <span>Skill Gaps</span>
          </button>

          <button
            className="roadmap-sidebar-link active"
            onClick={() =>
              navigate('/student/roadmap')
            }
          >
            <Map size={18} />
            <span>Learning Roadmap</span>
          </button>

          <button className="roadmap-sidebar-link">
            <BriefcaseBusiness size={18} />
            <span>Opportunities</span>
          </button>

          <button className="roadmap-sidebar-link">
            <FileText size={18} />
            <span>Applications</span>
          </button>

        </nav>

        <div className="roadmap-sidebar-bottom">

          <div className="roadmap-sidebar-divider"></div>

          <button
            className="roadmap-sidebar-link"
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

      <main className="roadmap-main">

        <header className="roadmap-topbar">

          <div className="roadmap-topbar-title">
            Learning Roadmap
          </div>

          <div className="roadmap-student-profile">

            <div className="roadmap-avatar">
              {(user?.name || 'S')
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="roadmap-profile-info">

              <span className="roadmap-profile-name">
                {user?.name || 'Student'}
              </span>

              <span className="roadmap-profile-role">
                Student
              </span>

            </div>

          </div>

        </header>


        {/* =========================
            CONTENT
        ========================= */}

        <div className="roadmap-page-content">

          <button
            className="roadmap-back-button"
            onClick={() =>
              navigate('/student/dashboard')
            }
          >
            <ArrowLeft size={15} />
            Back to Dashboard
          </button>


          <div className="roadmap-page-heading">

            <span className="roadmap-page-label">
              LEARNING & DEVELOPMENT
            </span>

            <h1>
              Your Learning Roadmap
            </h1>

            <p>
              Follow a structured path to strengthen
              your skills and close your skill gaps.
            </p>

          </div>


          {error && (
            <div className="roadmap-error">
              {error}
            </div>
          )}

          {saveMessage && (
            <div className="roadmap-success">
              {saveMessage}
            </div>
          )}


          {!activeRoadmap ? (

            <div className="roadmap-no-data">

              <Map size={35} />

              <h3>
                No roadmap available
              </h3>

              <p>
                A learning roadmap will appear here
                when one is assigned to you.
              </p>

            </div>

          ) : (

            <>

              {/* =========================
                  CURRENT ROADMAP
              ========================= */}

              <section className="roadmap-main-card">

                <div className="roadmap-card-header">

                  <div className="roadmap-card-title">

                    <div className="roadmap-card-icon">
                      <Map size={20} />
                    </div>

                    <div>

                      <span className="roadmap-section-label">
                        CURRENT ROADMAP
                      </span>

                      <h2>
                        {activeRoadmap.title}
                      </h2>

                    </div>

                  </div>

                  <div className="roadmap-large-progress">
                    {currentProgress}%
                  </div>

                </div>


                <p className="roadmap-description">
                  {activeRoadmap.description ||
                    'Follow this roadmap to improve your skills and career readiness.'}
                </p>


                <div className="roadmap-progress-track">

                  <div
                    className="roadmap-progress-fill"
                    style={{
                      width: `${Math.min(
                        Math.max(
                          currentProgress,
                          0
                        ),
                        100
                      )}%`,
                    }}
                  />

                </div>


                <div className="roadmap-progress-summary">

                  <span>
                    {activeProgress?.completed
                      ? 'Roadmap completed'
                      : 'Learning in progress'}
                  </span>

                  <span>
                    {currentProgress}% complete
                  </span>

                </div>


                <div
                  className={`roadmap-status ${activeProgress?.completed
                    ? 'completed'
                    : ''
                    }`}
                >
                  <CheckCircle2 size={14} />

                  {activeProgress?.completed
                    ? 'Completed'
                    : 'In Progress'}
                </div>

              </section>


              {/* =========================
                  ROADMAP STEPS
              ========================= */}

              <section className="roadmap-steps-card">

                <div className="roadmap-section-header">

                  <div>

                    <h3>
                      Roadmap Steps
                    </h3>

                    <p>
                      Complete each step to
                      progress through your
                      learning path.
                    </p>

                  </div>

                  <BookOpen size={20} />

                </div>


                {roadmapSteps.length > 0 ? (

                  <div className="roadmap-step-list">

                    {roadmapSteps
                      .sort(
                        (a, b) =>
                          a.order - b.order
                      )
                      .map((step, index) => {

                        const stepId =
                          step._id?.toString();

                        const savedStep =
                          stepProgressMap.get(
                            stepId
                          );

                        const stepValue =
                          Number(
                            savedStep?.progress || 0
                          );

                        const completed =
                          stepValue === 100;

                        return (
                          <div
                            className={`roadmap-step-item ${completed
                              ? 'completed'
                              : ''
                              }`}
                            key={stepId}
                          >

                            <div className="roadmap-step-number">
                              {String(
                                index + 1
                              ).padStart(2, '0')}
                            </div>


                            <div className="roadmap-step-content">

                              <div className="roadmap-step-header">

                                <div>

                                  <span className="roadmap-step-label">
                                    STEP {index + 1}
                                  </span>

                                  <h4>
                                    {step.title}
                                  </h4>

                                </div>

                                <div className="roadmap-step-percentage">
                                  {stepValue}%
                                </div>

                              </div>


                              <p className="roadmap-step-description">
                                {step.description}
                              </p>


                              <div className="roadmap-step-progress-track">

                                <div
                                  className="roadmap-step-progress-fill"
                                  style={{
                                    width: `${stepValue}%`,
                                  }}
                                />

                              </div>


                              <div className="roadmap-step-footer">

                                <div className="roadmap-step-status">

                                  {completed ? (
                                    <>
                                      <CheckCircle2
                                        size={14}
                                      />
                                      Completed
                                    </>
                                  ) : (
                                    <>
                                      <Circle
                                        size={14}
                                      />
                                      In Progress
                                    </>
                                  )}

                                </div>


                                <div className="roadmap-step-controls">

                                  <label>
                                    Progress
                                  </label>

                                  <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    step="10"
                                    value={stepValue}
                                    onChange={(event) =>
                                      handleStepProgressChange(
                                        stepId,
                                        event.target.value
                                      )
                                    }
                                  />

                                  <span>
                                    {stepValue}%
                                  </span>

                                </div>

                              </div>


                              {step.skills?.length > 0 && (

                                <div className="roadmap-step-skills">

                                  {step.skills.map(
                                    (
                                      skill,
                                      skillIndex
                                    ) => (
                                      <span
                                        key={`${skill}-${skillIndex}`}
                                      >
                                        {skill}
                                      </span>
                                    )
                                  )}

                                </div>

                              )}

                            </div>

                          </div>
                        );
                      })}

                  </div>

                ) : (

                  <div className="roadmap-empty-steps">

                    <Map size={28} />

                    <p>
                      No steps have been
                      defined for this roadmap.
                    </p>

                  </div>

                )}


                {roadmapSteps.length > 0 && (
                  <div className="roadmap-save-area">

                    <button
                      className="roadmap-save-button"
                      onClick={
                        handleSaveProgress
                      }
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <LoaderCircle
                            size={15}
                            className="roadmap-spinner"
                          />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={15} />
                          Save Progress
                        </>
                      )}
                    </button>

                  </div>
                )}

              </section>


              {/* =========================
                  ROADMAP SKILLS
              ========================= */}

              <section className="roadmap-skills-card">

                <div className="roadmap-section-header">

                  <div>

                    <h3>
                      Roadmap Skills
                    </h3>

                    <p>
                      Skills covered in this
                      learning path
                    </p>

                  </div>

                  <BookOpen size={20} />

                </div>


                <div className="roadmap-skill-list">

                  {activeRoadmap.skills?.length > 0 ? (

                    activeRoadmap.skills.map(
                      (skill, index) => (

                        <div
                          className="roadmap-skill-item"
                          key={`${skill}-${index}`}
                        >

                          <div className="roadmap-skill-icon">

                            {activeProgress?.completed ? (
                              <CheckCircle2 size={17} />
                            ) : (
                              <Circle size={17} />
                            )}

                          </div>

                          <div>

                            <strong>
                              {skill}
                            </strong>

                            <span>
                              {activeProgress?.completed
                                ? 'Completed'
                                : 'Part of your roadmap'}
                            </span>

                          </div>

                        </div>

                      )
                    )

                  ) : (

                    <p className="roadmap-no-skills">
                      No individual skills have been
                      defined for this roadmap yet.
                    </p>

                  )}

                </div>

              </section>


              {/* =========================
                  AVAILABLE ROADMAPS
              ========================= */}

              {roadmaps.length > 1 && (

                <section className="roadmap-all-card">

                  <div className="roadmap-section-header">

                    <div>

                      <h3>
                        Available Roadmaps
                      </h3>

                      <p>
                        Other learning paths
                        available in SmartHire Hub
                      </p>

                    </div>

                  </div>


                  <div className="available-roadmap-list">

                    {roadmaps.map(
                      (roadmap) => (

                        <div
                          className="available-roadmap-item"
                          key={roadmap._id}
                        >

                          <div>

                            <strong>
                              {roadmap.title}
                            </strong>

                            <p>
                              {roadmap.description ||
                                'Learning path for skill development.'}
                            </p>

                          </div>

                          <span>
                            {roadmap.skills?.length || 0}{' '}
                            skills
                          </span>

                        </div>

                      )
                    )}

                  </div>

                </section>

              )}

            </>
          )}

        </div>

      </main>

    </div>
  );
};

export default LearningRoadmap;