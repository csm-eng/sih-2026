import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BriefcaseBusiness,
  Users,
  BookmarkCheck,
  TrendingUp,
  Plus,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  BarChart2,
  Building2,
  ChevronRight
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import industryService from '../../services/industryService';
import CreateOpportunityModal from './CreateOpportunityModal';
import CandidateProfileModal from './CandidateProfileModal';
import './IndustryDashboard.css';

const IndustryDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  const [skillDemands, setSkillDemands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      const [dashRes, demandsRes] = await Promise.allSettled([
        industryService.getDashboard(),
        industryService.getSkillDemands()
      ]);

      if (dashRes.status === 'fulfilled' && dashRes.value?.success) {
        setDashboardData(dashRes.value.data);
      }

      if (demandsRes.status === 'fulfilled' && demandsRes.value?.data) {
        setSkillDemands(demandsRes.value.data || []);
      }

      if (user?.companyId) {
        const oppsRes = await industryService.getCompanyOpportunities(user.companyId);
        if (oppsRes?.data) {
          setOpportunities(oppsRes.data);
        }
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      setError('Could not load industry dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  const stats = dashboardData?.statistics || {
    totalOpportunities: opportunities.length || 0,
    totalApplications: 0,
    shortlisted: 0,
    selected: 0
  };

  const topCandidates = dashboardData?.topCandidates || [];

  return (
    <div className="industry-dashboard-page">
      {/* HEADER SECTION */}
      <div className="dashboard-header-banner">
        <div className="banner-left">
          <h2>Welcome, {user?.name || 'Industry Partner'}</h2>
          <p>Skill Intelligence Platform — Connecting industry demand with verified student talent.</p>
        </div>
        <div className="banner-actions">
          <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
            <Plus size={16} />
            <span>Create Opportunity</span>
          </button>
        </div>
      </div>

      {/* DASHBOARD SUMMARY KPI CARDS */}
      <div className="summary-cards-grid">
        <div className="kpi-card">
          <div className="kpi-icon-wrapper blue">
            <BriefcaseBusiness size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Active Opportunities</span>
            <span className="kpi-value">{stats.totalOpportunities}</span>
            <span className="kpi-subtext">Open for applications</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrapper purple">
            <Users size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Total Applicants</span>
            <span className="kpi-value">{stats.totalApplications}</span>
            <span className="kpi-subtext">Candidate submissions</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrapper emerald">
            <BookmarkCheck size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Shortlisted Candidates</span>
            <span className="kpi-value">{stats.shortlisted}</span>
            <span className="kpi-subtext">Under active review</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrapper amber">
            <TrendingUp size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">High-Demand Skills</span>
            <span className="kpi-value">{skillDemands.length}</span>
            <span className="kpi-subtext">Monitored demand indicators</span>
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS FOR DASHBOARD PANELS */}
      <div className="dashboard-tab-bar">
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab-btn ${activeTab === 'opportunities' ? 'active' : ''}`}
          onClick={() => setActiveTab('opportunities')}
        >
          Active Opportunities ({opportunities.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'skillDemand' ? 'active' : ''}`}
          onClick={() => setActiveTab('skillDemand')}
        >
          Skill Demand ({skillDemands.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'applicants' ? 'active' : ''}`}
          onClick={() => setActiveTab('applicants')}
        >
          Applicants ({topCandidates.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'insights' ? 'active' : ''}`}
          onClick={() => setActiveTab('insights')}
        >
          Talent Insights
        </button>
      </div>

      {/* TAB CONTENT: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="overview-panels-grid">
          {/* LEFT: Active Opportunities & Candidates */}
          <div className="panel-column main-col">
            <div className="content-card">
              <div className="card-header">
                <h3>Top Matched Applicants</h3>
                <button
                  className="link-btn"
                  onClick={() => navigate('/industry/candidates')}
                >
                  View All Candidates <ChevronRight size={14} />
                </button>
              </div>

              {topCandidates.length === 0 ? (
                <div className="empty-state">
                  <Users size={36} className="empty-icon" />
                  <p className="empty-title">No Candidate Applications Yet</p>
                  <p className="empty-desc">
                    Create opportunities or view talent matching to find students with verified skills.
                  </p>
                </div>
              ) : (
                <div className="candidate-list">
                  {topCandidates.map((app) => (
                    <div key={app._id} className="candidate-item-card">
                      <div className="candidate-info">
                        <div className="candidate-name">{app.studentId?.name || 'Student Candidate'}</div>
                        <div className="candidate-meta">
                          <span>{app.studentId?.department || 'CS/IT'}</span> •{' '}
                          <span>Year {app.studentId?.year || 3}</span> •{' '}
                          <span className="cgpa-tag">CGPA: {app.studentId?.cgpa || '8.5'}</span>
                        </div>
                        <div className="applied-for">
                          Applied for: <strong>{app.opportunityId?.title || 'Internship'}</strong>
                        </div>
                      </div>
                      <div className="candidate-actions">
                        <div className="match-pill">
                          Match: {app.matchScore || 85}%
                        </div>
                        <button
                          className="btn-outline-sm"
                          onClick={() => setSelectedStudentId(app.studentId?._id || app.studentId)}
                        >
                          View Profile
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* OPPORTUNITIES PREVIEW */}
            <div className="content-card">
              <div className="card-header">
                <h3>Active Opportunities</h3>
                <button
                  className="link-btn"
                  onClick={() => navigate('/industry/opportunities')}
                >
                  Manage Opportunities <ChevronRight size={14} />
                </button>
              </div>

              {opportunities.length === 0 ? (
                <div className="empty-state">
                  <BriefcaseBusiness size={36} className="empty-icon" />
                  <p className="empty-title">No Opportunities Posted</p>
                  <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
                    <Plus size={16} /> Post Your First Opportunity
                  </button>
                </div>
              ) : (
                <div className="opportunities-mini-list">
                  {opportunities.slice(0, 3).map((opp) => (
                    <div key={opp._id} className="opp-mini-card">
                      <div className="opp-mini-info">
                        <span className="opp-title">{opp.title}</span>
                        <span className="opp-type-badge">{opp.type}</span>
                        <span className="opp-location">{opp.location || 'Remote'} ({opp.mode})</span>
                      </div>
                      <button
                        className="btn-text-sm"
                        onClick={() => navigate('/industry/candidates?opportunityId=' + opp._id)}
                      >
                        Matching Candidates <ArrowRight size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Skill Intelligence Highlights */}
          <div className="panel-column side-col">
            <div className="content-card accent-card">
              <div className="card-header">
                <h3>
                  <Sparkles size={18} /> Skill Intelligence Highlights
                </h3>
              </div>
              <p className="intelligence-desc">
                SmartHire Hub enforces <strong>Verified Evidence Matching</strong>. Only student-confirmed skills and assessed proficiencies influence match scores.
              </p>
              <div className="quick-insights-list">
                <div className="insight-item">
                  <CheckCircle2 size={16} className="text-emerald" />
                  <span>Only confirmed skills treated as actual candidate proficiencies.</span>
                </div>
                <div className="insight-item">
                  <AlertCircle size={16} className="text-amber" />
                  <span>Explainable skill gap breakdowns highlight precise training interventions needed.</span>
                </div>
                <div className="insight-item">
                  <BarChart2 size={16} className="text-blue" />
                  <span>Industry feedback feeds back into institutional curriculum insights.</span>
                </div>
              </div>
            </div>

            <div className="content-card">
              <div className="card-header">
                <h3>High Demand Skills</h3>
                <button
                  className="link-btn"
                  onClick={() => navigate('/industry/skill-demand')}
                >
                  Skill Demand <ChevronRight size={14} />
                </button>
              </div>

              {skillDemands.length === 0 ? (
                <p className="empty-text">No skill demand signals published yet.</p>
              ) : (
                <div className="skill-tags-cloud">
                  {skillDemands.slice(0, 8).map((d) => (
                    <span key={d._id} className="skill-tag-pill">
                      {d.skillId?.name || 'Skill'} (L{d.requiredLevel || 3})
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: OPPORTUNITIES */}
      {activeTab === 'opportunities' && (
        <div className="content-card">
          <div className="card-header">
            <h3>Your Posted Opportunities</h3>
            <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
              <Plus size={16} /> Add Opportunity
            </button>
          </div>
          {opportunities.length === 0 ? (
            <div className="empty-state">
              <BriefcaseBusiness size={36} className="empty-icon" />
              <p className="empty-title">No opportunities found.</p>
              <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
                Create Opportunity
              </button>
            </div>
          ) : (
            <div className="opportunities-grid">
              {opportunities.map((opp) => (
                <div key={opp._id} className="opp-full-card">
                  <div className="opp-header">
                    <h4>{opp.title}</h4>
                    <span className={`status-badge ${opp.status}`}>{opp.status}</span>
                  </div>
                  <div className="opp-meta-row">
                    <span>Type: <strong>{opp.type}</strong></span>
                    <span>Mode: <strong>{opp.mode}</strong></span>
                    <span>Location: <strong>{opp.location || 'Remote'}</strong></span>
                  </div>
                  <p className="opp-desc">{opp.description || 'No description provided.'}</p>
                  <div className="opp-footer">
                    <button
                      className="btn-outline-sm"
                      onClick={() => navigate(`/industry/candidates?opportunityId=${opp._id}`)}
                    >
                      View Candidates & Match Score
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: SKILL DEMAND */}
      {activeTab === 'skillDemand' && (
        <div className="content-card">
          <div className="card-header">
            <h3>Monitored Skill Demand Signals</h3>
            <button className="btn-outline-sm" onClick={() => navigate('/industry/skill-demand')}>
              Open Full Skill Demand Portal
            </button>
          </div>
          <div className="skill-demands-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Skill</th>
                  <th>Category</th>
                  <th>Required Proficiency</th>
                  <th>Demand Score</th>
                  <th>Source</th>
                </tr>
              </thead>
              <tbody>
                {skillDemands.map((d) => (
                  <tr key={d._id}>
                    <td><strong>{d.skillId?.name || 'Skill'}</strong></td>
                    <td>{d.skillId?.category || 'General'}</td>
                    <td>Level {d.requiredLevel || 1} / 5</td>
                    <td>
                      <span className="score-pill">{d.demandScore || 80}/100</span>
                    </td>
                    <td>{d.source || 'company_requirement'}</td>
                  </tr>
                ))}
                {skillDemands.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-4">No skill demand signals found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: APPLICANTS */}
      {activeTab === 'applicants' && (
        <div className="content-card">
          <div className="card-header">
            <h3>Recent Applicant Profiles</h3>
            <button className="btn-outline-sm" onClick={() => navigate('/industry/applications')}>
              Go to Applications Tracking
            </button>
          </div>
          {topCandidates.length === 0 ? (
            <div className="empty-state">
              <Users size={36} className="empty-icon" />
              <p className="empty-title">No candidates have applied yet.</p>
            </div>
          ) : (
            <div className="candidate-list">
              {topCandidates.map((app) => (
                <div key={app._id} className="candidate-item-card">
                  <div className="candidate-info">
                    <div className="candidate-name">{app.studentId?.name || 'Student'}</div>
                    <div className="candidate-meta">
                      {app.studentId?.department} • Year {app.studentId?.year} • CGPA: {app.studentId?.cgpa || 'N/A'}
                    </div>
                  </div>
                  <button
                    className="btn-primary-sm"
                    onClick={() => setSelectedStudentId(app.studentId?._id || app.studentId)}
                  >
                    Inspect Profile & Verified Evidence
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: TALENT INSIGHTS */}
      {activeTab === 'insights' && (
        <div className="content-card">
          <div className="card-header">
            <h3>Talent Intelligence Summary</h3>
            <button className="btn-outline-sm" onClick={() => navigate('/industry/analytics')}>
              View Full Analytics
            </button>
          </div>
          <p className="empty-desc">
            Explore industry demand trends, average candidate skill levels, and talent shortages.
          </p>
        </div>
      )}

      {/* MODALS */}
      {showCreateModal && (
        <CreateOpportunityModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchDashboardData();
          }}
        />
      )}

      {selectedStudentId && (
        <CandidateProfileModal
          studentId={selectedStudentId}
          onClose={() => setSelectedStudentId(null)}
        />
      )}
    </div>
  );
};

export default IndustryDashboard;
