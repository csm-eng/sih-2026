import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Brain,
  Target,
  BookOpenCheck,
  ChevronRight,
  ArrowUpRight,
  Sparkles,
  Compass
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import instituteService from '../../services/instituteService';
import InstituteStudentProfileModal from './InstituteStudentProfileModal';
import './InstituteDashboard.css';

const InstituteDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [students, setStudents] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Selected student for detailed profile modal
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      const [dashRes, studentsRes, analyticsRes] = await Promise.allSettled([
        instituteService.getDashboard(),
        instituteService.getStudents(),
        instituteService.getSkillAnalytics()
      ]);

      if (dashRes.status === 'fulfilled' && dashRes.value) {
        setDashboardData(dashRes.value.data || dashRes.value);
      }

      if (studentsRes.status === 'fulfilled' && studentsRes.value) {
        setStudents(studentsRes.value.data || studentsRes.value || []);
      }

      if (analyticsRes.status === 'fulfilled' && analyticsRes.value) {
        setAnalytics(analyticsRes.value.data || analyticsRes.value);
      }
    } catch (err) {
      console.error('Failed to load institute dashboard:', err);
      setError('Could not fetch institute dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  const totalStudents = dashboardData?.totalStudents ?? students.length ?? 0;
  const verifiedCount = dashboardData?.studentsWithVerifiedSkills ?? 0;
  const criticalGapsCount = dashboardData?.criticalSkillGaps ?? analytics?.highPriorityGaps ?? 0;
  const alignedSkillsCount = dashboardData?.industryAlignedSkills ?? analytics?.topDemandedSkills?.length ?? 0;

  return (
    <div className="institute-dashboard-page">
      {/* BANNER */}
      <div className="dashboard-header-banner">
        <div className="banner-left">
          <h2>Welcome, {user?.name || 'Institute Administrator'}</h2>
          <p>
            Academia–Industry Skill Intelligence Hub — Monitor student verified proficiencies, skill gaps, and industry demand alignment.
          </p>
        </div>
        <div className="banner-actions">
          <button
            className="btn-primary-institute"
            onClick={() => navigate('/institute/alignment')}
          >
            <Compass size={16} />
            <span>Curriculum Alignment</span>
          </button>
        </div>
      </div>

      {/* SUMMARY KPI CARDS */}
      <div className="summary-cards-grid">
        <div className="kpi-card">
          <div className="kpi-icon-wrapper blue">
            <Users size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Total Students</span>
            <span className="kpi-value">{totalStudents}</span>
            <span className="kpi-subtext">Registered academic directory</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrapper emerald">
            <CheckCircle2 size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Students With Verified Skills</span>
            <span className="kpi-value">{verifiedCount}</span>
            <span className="kpi-subtext">Confirmed evidence profiles</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrapper rose">
            <AlertTriangle size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Critical Skill Gaps</span>
            <span className="kpi-value">{criticalGapsCount}</span>
            <span className="kpi-subtext">High priority target areas</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrapper amber">
            <TrendingUp size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Industry-Aligned Skills</span>
            <span className="kpi-value">{alignedSkillsCount}</span>
            <span className="kpi-subtext">Met industry demand benchmark</span>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT PANELS */}
      <div className="dashboard-panels-grid">
        {/* LEFT COLUMN: Student Skill Directory Highlights */}
        <div className="panel-column main-col">
          <div className="content-card">
            <div className="card-header">
              <h3>Student Skill Profiles Directory</h3>
              <button
                className="link-btn"
                onClick={() => navigate('/institute/students')}
              >
                View Full Directory <ChevronRight size={14} />
              </button>
            </div>

            {students.length === 0 ? (
              <div className="empty-state">
                <Users size={36} className="empty-icon" />
                <p className="empty-title">No Students Registered Yet</p>
                <p className="empty-desc">
                  Student profiles will appear here as students register and build evidence-backed profiles.
                </p>
              </div>
            ) : (
              <div className="student-mini-table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Department</th>
                      <th>Year</th>
                      <th>CGPA</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.slice(0, 5).map((st) => (
                      <tr key={st._id}>
                        <td>
                          <div className="student-cell">
                            <span className="student-avatar-xs">
                              {(st.name || 'S').charAt(0).toUpperCase()}
                            </span>
                            <strong>{st.name}</strong>
                          </div>
                        </td>
                        <td>{st.department || 'CS'}</td>
                        <td>Year {st.year || 3}</td>
                        <td>
                          <span className="cgpa-badge">{st.cgpa || '8.5'}</span>
                        </td>
                        <td>
                          <button
                            className="btn-text-sm"
                            onClick={() => setSelectedStudentId(st._id)}
                          >
                            Inspect Profile <ArrowUpRight size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* CRITICAL SKILL GAP ALERTS */}
          <div className="content-card">
            <div className="card-header">
              <h3>
                <AlertTriangle size={18} className="text-rose" /> High Priority Skill Gap Alerts
              </h3>
              <button
                className="link-btn"
                onClick={() => navigate('/institute/skill-gaps')}
              >
                Skill Gap Analytics <ChevronRight size={14} />
              </button>
            </div>

            {!analytics?.topSkillGaps || analytics.topSkillGaps.length === 0 ? (
              <p className="empty-text">No critical skill gaps identified across current students.</p>
            ) : (
              <div className="gap-alert-items">
                {analytics.topSkillGaps.slice(0, 4).map((gap, i) => (
                  <div key={i} className="gap-alert-card">
                    <div className="gap-alert-info">
                      <span className="gap-skill-name">{gap.skillName}</span>
                      <span className="gap-affected">{gap.studentsAffected} Students Affected</span>
                    </div>
                    <div className="gap-alert-action">
                      <span className="priority-badge high">High Priority</span>
                      <button
                        className="btn-outline-sm"
                        onClick={() => navigate('/institute/interventions')}
                      >
                        Create Intervention
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Skill Intelligence Insights */}
        <div className="panel-column side-col">
          <div className="content-card accent-card">
            <div className="card-header">
              <h3>
                <Sparkles size={18} /> Skill Intelligence Summary
              </h3>
            </div>
            <p className="intelligence-desc">
              SmartHire Hub tracks student proficiencies to guide curriculum upgrades and faculty development programs.
            </p>
            <div className="quick-insights-list">
              <div className="insight-item">
                <Brain size={16} className="text-emerald" />
                <span>Only student-confirmed skills are treated as verified proficiencies.</span>
              </div>
              <div className="insight-item">
                <Target size={16} className="text-rose" />
                <span>Skill gap analytics compare average student levels against industry benchmarks.</span>
              </div>
              <div className="insight-item">
                <BookOpenCheck size={16} className="text-blue" />
                <span>Interventions provide targeted workshops and mentorship support.</span>
              </div>
            </div>
          </div>

          <div className="content-card">
            <div className="card-header">
              <h3>Top Demanded Skills</h3>
              <button
                className="link-btn"
                onClick={() => navigate('/institute/industry-demand')}
              >
                Demand Data <ChevronRight size={14} />
              </button>
            </div>

            {!analytics?.topDemandedSkills || analytics.topDemandedSkills.length === 0 ? (
              <p className="empty-text">No industry skill demand signals registered.</p>
            ) : (
              <div className="demanded-skills-mini">
                {analytics.topDemandedSkills.slice(0, 5).map((sk, idx) => (
                  <div key={idx} className="demanded-mini-row">
                    <span className="sk-name">{sk.skillName}</span>
                    <span className="sk-score">Demand: {sk.demandScore}/100</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* STUDENT PROFILE MODAL */}
      {selectedStudentId && (
        <InstituteStudentProfileModal
          studentId={selectedStudentId}
          onClose={() => setSelectedStudentId(null)}
        />
      )}
    </div>
  );
};

export default InstituteDashboard;
