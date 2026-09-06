import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Users,
  Award,
  BarChart2,
  PieChart,
  RefreshCw
} from 'lucide-react';
import industryService from '../../services/industryService';
import './IndustryAnalyticsPage.css';

const IndustryAnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await industryService.getIndustryAnalytics();
      if (res?.data) {
        setAnalytics(res.data);
      }
    } catch (err) {
      console.error('Failed to load industry analytics:', err);
      setError('Could not fetch industry analytics data.');
    } finally {
      setLoading(false);
    }
  };

  const topDemandedSkills = analytics?.topDemandedSkills || [];
  const averageSkillLevels = analytics?.averageSkillLevels || [];
  const commonSkillGaps = analytics?.commonSkillGaps || [];
  const opportunityStats = analytics?.opportunityStats || { total: 0, open: 0 };
  const applicationStats = analytics?.applicationStats || { total: 0, shortlisted: 0, selected: 0 };

  const isDataEmpty =
    topDemandedSkills.length === 0 &&
    averageSkillLevels.length === 0 &&
    commonSkillGaps.length === 0;

  return (
    <div className="industry-analytics-page">
      {/* HEADER */}
      <div className="page-header">
        <div>
          <h2>Industry Talent & Skill Analytics</h2>
          <p>
            Real-time insights on skill demand, candidate proficiencies, talent shortages, and curriculum gap distributions.
          </p>
        </div>
        <button className="btn-outline-sm" onClick={fetchAnalytics}>
          <RefreshCw size={14} /> Refresh Data
        </button>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="analytics-kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon-wrapper blue">
            <TrendingUp size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Demanded Skills Tracked</span>
            <span className="kpi-value">{topDemandedSkills.length}</span>
            <span className="kpi-subtext">Active industry skill signals</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrapper emerald">
            <Award size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Verified Skill Profiles</span>
            <span className="kpi-value">{averageSkillLevels.length}</span>
            <span className="kpi-subtext">Student skill benchmarks</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrapper amber">
            <AlertTriangle size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Identified Skill Gaps</span>
            <span className="kpi-value">{commonSkillGaps.length}</span>
            <span className="kpi-subtext">Curriculum target areas</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrapper purple">
            <Users size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Company Applications</span>
            <span className="kpi-value">{applicationStats.total}</span>
            <span className="kpi-subtext">{applicationStats.selected} Selected Candidates</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">Loading Analytics Engine...</div>
      ) : isDataEmpty ? (
        <div className="content-card empty-card">
          <BarChart3 size={44} className="empty-icon" />
          <h3>No Analytics Data Available Yet</h3>
          <p className="empty-desc">
            As students confirm verified skills and your company posts opportunities, real-time demand & talent metrics will automatically populate here.
          </p>
        </div>
      ) : (
        <div className="analytics-panels-grid">
          {/* TOP DEMANDED SKILLS */}
          <div className="content-card">
            <div className="card-header">
              <h3>
                <TrendingUp size={18} className="text-emerald" /> Top Demanded Skills
              </h3>
            </div>
            {topDemandedSkills.length === 0 ? (
              <p className="empty-text">No demand data currently recorded.</p>
            ) : (
              <div className="analytics-bars-list">
                {topDemandedSkills.map((sk) => (
                  <div key={sk.skillId} className="analytics-bar-item">
                    <div className="bar-title-row">
                      <span className="bar-skill-name">{sk.skillName}</span>
                      <span className="bar-score">{sk.demandScore} / 100</span>
                    </div>
                    <div className="progress-track">
                      <div
                        className="progress-fill emerald"
                        style={{ width: `${sk.demandScore || 75}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AVERAGE CANDIDATE SKILL LEVELS */}
          <div className="content-card">
            <div className="card-header">
              <h3>
                <Award size={18} className="text-blue" /> Average Candidate Skill Levels
              </h3>
            </div>
            {averageSkillLevels.length === 0 ? (
              <p className="empty-text">No student skill benchmarks recorded yet.</p>
            ) : (
              <div className="analytics-bars-list">
                {averageSkillLevels.map((sk) => (
                  <div key={sk.skillId} className="analytics-bar-item">
                    <div className="bar-title-row">
                      <span className="bar-skill-name">{sk.skillName}</span>
                      <span className="bar-score">Avg L{sk.averageLevel} ({sk.verifiedCount} verified)</span>
                    </div>
                    <div className="progress-track">
                      <div
                        className="progress-fill blue"
                        style={{ width: `${((sk.averageLevel || 1) / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* COMMON SKILL GAPS */}
          <div className="content-card col-span-2">
            <div className="card-header">
              <h3>
                <AlertTriangle size={18} className="text-rose" /> Most Common Student Skill Gaps
              </h3>
            </div>
            {commonSkillGaps.length === 0 ? (
              <p className="empty-text">No skill gaps identified across current applicants.</p>
            ) : (
              <div className="gaps-grid-list">
                {commonSkillGaps.map((gap) => (
                  <div key={gap.skillId} className="gap-stat-chip">
                    <span className="gap-name">{gap.skillName}</span>
                    <span className="gap-count">{gap.affectedStudents} Candidates Affected</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default IndustryAnalyticsPage;
