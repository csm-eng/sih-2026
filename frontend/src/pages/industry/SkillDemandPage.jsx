import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  Plus,
  Flame,
  Sparkles,
  Search,
  AlertTriangle,
  Layers,
  CheckCircle2,
  X
} from 'lucide-react';
import industryService from '../../services/industryService';
import './SkillDemandPage.css';

const SkillDemandPage = () => {
  const [skillDemands, setSkillDemands] = useState([]);
  const [skillsCatalog, setSkillsCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Add Skill Demand Modal Form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    skillId: '',
    requiredLevel: 3,
    demandScore: 85,
    source: 'company_requirement'
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');

      const [demandsRes, skillsRes] = await Promise.allSettled([
        industryService.getSkillDemands(),
        industryService.getSkills()
      ]);

      if (demandsRes.status === 'fulfilled' && demandsRes.value?.data) {
        setSkillDemands(demandsRes.value.data || []);
      }

      if (skillsRes.status === 'fulfilled' && skillsRes.value?.data) {
        setSkillsCatalog(skillsRes.value.data || []);
      }
    } catch (err) {
      console.error('Failed to load skill demands:', err);
      setError('Could not load skill demand signals.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDemand = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setFormError('');

      if (!formData.skillId) {
        setFormError('Please select a skill.');
        setSubmitting(false);
        return;
      }

      const payload = {
        skillId: formData.skillId,
        requiredLevel: Number(formData.requiredLevel),
        demandScore: Number(formData.demandScore),
        source: formData.source
      };

      const res = await industryService.createSkillDemand(payload);
      if (res?.success || res?.data) {
        setShowAddModal(false);
        fetchData();
      } else {
        setFormError(res?.message || 'Failed to submit skill demand.');
      }
    } catch (err) {
      setFormError(err.response?.data?.message || err.message || 'Error submitting skill demand.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredDemands = skillDemands.filter((d) => {
    const sName = d.skillId?.name?.toLowerCase() || '';
    const cat = d.skillId?.category?.toLowerCase() || '';
    return sName.includes(searchTerm.toLowerCase()) || cat.includes(searchTerm.toLowerCase());
  });

  // Categorize skills for visual cards
  const highDemandSkills = skillDemands.filter((d) => (d.demandScore || 0) >= 80);
  const emergingSkills = skillDemands.filter((d) => d.source === 'industry_survey' || (d.demandScore || 0) >= 70 && (d.demandScore || 0) < 80);
  const frequentlyRequested = skillDemands.slice(0, 6);

  return (
    <div className="skill-demand-page">
      {/* HEADER */}
      <div className="page-header">
        <div>
          <h2>Industry Skill Demand Portal</h2>
          <p>
            Signal future talent demand, required proficiency benchmarks, and talent scarcity directly to universities.
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={16} /> Specify Skill Demand
        </button>
      </div>

      {/* VISUAL HIGHLIGHT CARDS */}
      <div className="demand-visual-grid">
        <div className="demand-visual-card flame">
          <div className="visual-card-header">
            <Flame size={20} className="icon-flame" />
            <h3>High Demand Skills</h3>
          </div>
          <p className="visual-card-desc">Critical industry requirements with score &gt; 80</p>
          <div className="visual-tags-list">
            {highDemandSkills.slice(0, 5).map((item) => (
              <span key={item._id} className="demand-tag-pill high">
                {item.skillId?.name || 'Skill'} • L{item.requiredLevel || 3} ({item.demandScore || 85} pts)
              </span>
            ))}
            {highDemandSkills.length === 0 && <span className="empty-tag">No high demand signals registered</span>}
          </div>
        </div>

        <div className="demand-visual-card spark">
          <div className="visual-card-header">
            <Sparkles size={20} className="icon-spark" />
            <h3>Emerging Tech Skills</h3>
          </div>
          <p className="visual-card-desc">Rapidly growing modern framework & tool requirements</p>
          <div className="visual-tags-list">
            {emergingSkills.slice(0, 5).map((item) => (
              <span key={item._id} className="demand-tag-pill emerging">
                {item.skillId?.name || 'Skill'} • L{item.requiredLevel || 3}
              </span>
            ))}
            {emergingSkills.length === 0 && <span className="empty-tag">No emerging signals registered</span>}
          </div>
        </div>

        <div className="demand-visual-card alert">
          <div className="visual-card-header">
            <AlertTriangle size={20} className="icon-alert" />
            <h3>Talent Shortage Alert</h3>
          </div>
          <p className="visual-card-desc">High industry demand with low confirmed student availability</p>
          <div className="visual-tags-list">
            {frequentlyRequested.slice(0, 4).map((item) => (
              <span key={item._id} className="demand-tag-pill shortage">
                {item.skillId?.name || 'Skill'} • Shortage
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="filter-bar-card">
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search skill demand by skill name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="demand-count-badge">
          Showing {filteredDemands.length} Demand Signals
        </div>
      </div>

      {/* MAIN DATA TABLE */}
      <div className="content-card">
        {loading ? (
          <div className="loading-state">Loading Skill Demands...</div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Skill Name</th>
                  <th>Category</th>
                  <th>Required Proficiency</th>
                  <th>Demand Score</th>
                  <th>Demand Source</th>
                  <th>Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {filteredDemands.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <div className="skill-cell-title">
                        <strong>{item.skillId?.name || 'Skill'}</strong>
                      </div>
                    </td>
                    <td>
                      <span className="category-pill">{item.skillId?.category || 'Tech'}</span>
                    </td>
                    <td>
                      <div className="level-bar-group">
                        <span className="level-label">Level {item.requiredLevel || 1} / 5</span>
                        <div className="level-track">
                          <div
                            className="level-fill"
                            style={{ width: `${((item.requiredLevel || 1) / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`score-badge ${(item.demandScore || 0) >= 80 ? 'high' : 'normal'}`}>
                        {item.demandScore || 75} / 100
                      </span>
                    </td>
                    <td>
                      <span className="source-tag">{item.source || 'job_posting'}</span>
                    </td>
                    <td>
                      <span className="date-text">
                        {item.lastUpdatedAt ? new Date(item.lastUpdatedAt).toLocaleDateString() : 'Recent'}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredDemands.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-6">
                      No skill demand signals match your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL TO ADD SKILL DEMAND */}
      {showAddModal && (
        <div className="modal-backdrop">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Specify Skill Demand Signal</h3>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div className="form-error-alert">
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateDemand} className="opportunity-form">
              <div className="form-group">
                <label>Select Target Skill *</label>
                <select
                  value={formData.skillId}
                  onChange={(e) => setFormData({ ...formData, skillId: e.target.value })}
                  required
                >
                  <option value="">-- Choose Skill --</option>
                  {skillsCatalog.map((sk) => (
                    <option key={sk._id} value={sk._id}>
                      {sk.name} ({sk.category || 'Tech'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Required Proficiency Level (1 to 5) *</label>
                <select
                  value={formData.requiredLevel}
                  onChange={(e) => setFormData({ ...formData, requiredLevel: e.target.value })}
                >
                  <option value={1}>Level 1 — Fundamental / Beginner</option>
                  <option value={2}>Level 2 — Developing Practical Knowledge</option>
                  <option value={3}>Level 3 — Intermediate Working Proficiency</option>
                  <option value={4}>Level 4 — Advanced System Level</option>
                  <option value={5}>Level 5 — Expert / Architect Level</option>
                </select>
              </div>

              <div className="form-group">
                <label>Demand Intensity Score (0 to 100) *</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.demandScore}
                  onChange={(e) => setFormData({ ...formData, demandScore: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Demand Category / Source</label>
                <select
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                >
                  <option value="company_requirement">Company Direct Requirement</option>
                  <option value="job_posting">Job / Internship Posting</option>
                  <option value="industry_survey">Industry Survey & Benchmark</option>
                </select>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Demand Signal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillDemandPage;
