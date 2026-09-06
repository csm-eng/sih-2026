import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BriefcaseBusiness,
  Plus,
  Search,
  Trash2,
  Users,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import industryService from '../../services/industryService';
import CreateOpportunityModal from './CreateOpportunityModal';
import './OpportunitiesPage.css';

const OpportunitiesPage = () => {
  const navigate = useNavigate();

  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await industryService.getAllOpportunities();
      setOpportunities(res?.data || []);
    } catch (err) {
      console.error('Failed to fetch opportunities:', err);
      setError('Could not load opportunities.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this opportunity?')) return;
    try {
      await industryService.deleteOpportunity(id);
      setOpportunities((prev) => prev.filter((o) => o._id !== id));
    } catch (err) {
      console.error('Failed to delete opportunity:', err);
      alert('Could not delete opportunity.');
    }
  };

  const filteredOpportunities = opportunities.filter((o) =>
    o.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="opportunities-page">
      {/* HEADER */}
      <div className="page-header">
        <div>
          <h2>Industry Opportunities Management</h2>
          <p>
            Post internships, full-time jobs, and industry projects. Automatically evaluate student matches based on verified skills.
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
          <Plus size={16} /> Post New Opportunity
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="filter-bar-card">
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search opportunities by title, type, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="demand-count-badge">
          {filteredOpportunities.length} Posted Opportunities
        </div>
      </div>

      {/* OPPORTUNITIES GRID */}
      <div className="content-card">
        {loading ? (
          <div className="loading-state">Loading Opportunities...</div>
        ) : filteredOpportunities.length === 0 ? (
          <div className="empty-state">
            <BriefcaseBusiness size={40} className="empty-icon" />
            <p className="empty-title">No Opportunities Found</p>
            <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
              <Plus size={16} /> Create Opportunity
            </button>
          </div>
        ) : (
          <div className="opportunities-full-grid">
            {filteredOpportunities.map((opp) => (
              <div key={opp._id} className="opportunity-full-card">
                <div className="opp-header-row">
                  <div>
                    <h3 className="opp-card-title">{opp.title}</h3>
                    <div className="opp-submeta">
                      <span className="type-tag">{opp.type}</span> •{' '}
                      <span className="mode-tag">{opp.mode}</span> •{' '}
                      <span className="loc-text"><MapPin size={12} /> {opp.location || 'Remote'}</span>
                    </div>
                  </div>
                  <span className={`status-pill ${opp.status || 'open'}`}>
                    {opp.status || 'open'}
                  </span>
                </div>

                <p className="opp-description">
                  {opp.description || 'No detailed description provided.'}
                </p>

                {/* REQUIRED SKILLS LIST */}
                {opp.requiredSkills && opp.requiredSkills.length > 0 && (
                  <div className="opp-skills-row">
                    <span className="req-label">Required Skills:</span>
                    {opp.requiredSkills.map((sk, idx) => (
                      <span key={idx} className="sk-tag">
                        {sk.skillId?.name || 'Skill'} (L{sk.requiredLevel || 1})
                      </span>
                    ))}
                  </div>
                )}

                {/* FOOTER ACTIONS */}
                <div className="opp-card-footer">
                  <button
                    className="btn-outline-sm"
                    onClick={() => navigate(`/industry/candidates?opportunityId=${opp._id}`)}
                  >
                    <Users size={14} /> View Matching Candidates
                  </button>

                  <button
                    className="btn-icon-danger"
                    onClick={() => handleDelete(opp._id)}
                    title="Delete Opportunity"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateOpportunityModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchOpportunities();
          }}
        />
      )}
    </div>
  );
};

export default OpportunitiesPage;
