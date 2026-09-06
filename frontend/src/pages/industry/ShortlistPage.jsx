import React, { useEffect, useState } from 'react';
import {
  BookmarkCheck,
  Search,
  Trash2,
  ExternalLink,
  Users,
  CheckCircle2,
  XCircle,
  FileText
} from 'lucide-react';
import industryService from '../../services/industryService';
import CandidateProfileModal from './CandidateProfileModal';
import './ShortlistPage.css';

const ShortlistPage = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [selectedOppId, setSelectedOppId] = useState('');
  const [shortlists, setShortlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Selected candidate profile modal
  const [activeStudentId, setActiveStudentId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedOppId) {
      fetchShortlistsForOpp(selectedOppId);
    }
  }, [selectedOppId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await industryService.getAllOpportunities();
      const opps = res?.data || [];
      setOpportunities(opps);

      if (opps.length > 0) {
        setSelectedOppId(opps[0]._id);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error('Failed to load opportunities:', err);
      setError('Could not fetch opportunities.');
      setLoading(false);
    }
  };

  const fetchShortlistsForOpp = async (oppId) => {
    try {
      setLoading(true);
      setError('');
      const res = await industryService.getOpportunityMatches(oppId);
      const data = res?.data || [];
      // Filter for shortlisted candidates or all matches
      setShortlists(data);
    } catch (err) {
      console.error('Failed to load shortlist items:', err);
      setError('Could not fetch shortlists.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (match, newStatus) => {
    try {
      await industryService.updateShortlistStatus({
        id: match._id,
        studentId: match.studentId?._id || match.studentId,
        opportunityId: selectedOppId,
        status: newStatus
      });

      setShortlists((prev) =>
        prev.map((item) => (item._id === match._id ? { ...item, status: newStatus } : item))
      );
    } catch (err) {
      console.error('Failed to update shortlist status:', err);
      alert('Failed to update status.');
    }
  };

  const filteredShortlists = shortlists.filter((item) => {
    const sName = item.studentId?.name?.toLowerCase() || '';
    const dept = item.studentId?.department?.toLowerCase() || '';
    return sName.includes(searchTerm.toLowerCase()) || dept.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="shortlist-page">
      {/* HEADER */}
      <div className="page-header">
        <div>
          <h2>Shortlisted Candidates Management</h2>
          <p>
            Track evaluation statuses, shortlist candidates across opportunities, and maintain talent pipelines.
          </p>
        </div>
      </div>

      {/* FILTER & SELECTOR BAR */}
      <div className="shortlist-bar-card">
        <div className="opp-select-group">
          <label>Filter Opportunity:</label>
          <select
            value={selectedOppId}
            onChange={(e) => setSelectedOppId(e.target.value)}
          >
            {opportunities.map((opp) => (
              <option key={opp._id} value={opp._id}>
                {opp.title} ({opp.type})
              </option>
            ))}
          </select>
        </div>

        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search shortlisted candidates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* DATA TABLE / CARDS */}
      <div className="content-card">
        {loading ? (
          <div className="loading-state">Loading Shortlist Data...</div>
        ) : filteredShortlists.length === 0 ? (
          <div className="empty-state">
            <BookmarkCheck size={40} className="empty-icon" />
            <p className="empty-title">No Candidates Shortlisted Yet</p>
            <p className="empty-desc">
              Go to Candidate Matching and click "Shortlist Candidate" to build your target talent list.
            </p>
          </div>
        ) : (
          <div className="shortlist-items-grid">
            {filteredShortlists.map((item) => {
              const student = item.studentId || {};
              const isShortlisted = item.status === 'shortlisted';

              return (
                <div key={item._id} className="shortlist-candidate-card">
                  <div className="candidate-main-row">
                    <div className="candidate-avatar-md">
                      {(student.name || 'S').charAt(0).toUpperCase()}
                    </div>
                    <div className="candidate-info-group">
                      <h4 className="candidate-name-txt">{student.name || 'Student Candidate'}</h4>
                      <div className="candidate-meta-txt">
                        {student.department} • Year {student.year} • CGPA: {student.cgpa || '8.5'}
                      </div>
                    </div>

                    <div className="shortlist-status-group">
                      <span className={`status-pill ${item.status || 'matched'}`}>
                        {item.status || 'matched'}
                      </span>
                      <span className="match-score-txt">
                        Match Score: <strong>{item.matchScore || 85}%</strong>
                      </span>
                    </div>
                  </div>

                  {/* ACTION BAR */}
                  <div className="shortlist-action-bar">
                    <button
                      className="btn-outline-sm"
                      onClick={() => setActiveStudentId(student._id || student)}
                    >
                      View Profile & Evidence
                    </button>

                    <div className="status-toggle-buttons">
                      {item.status !== 'shortlisted' ? (
                        <button
                          className="btn-status shortlist"
                          onClick={() => handleStatusChange(item, 'shortlisted')}
                        >
                          <CheckCircle2 size={14} /> Shortlist
                        </button>
                      ) : (
                        <button
                          className="btn-status remove"
                          onClick={() => handleStatusChange(item, 'matched')}
                        >
                          <XCircle size={14} /> Remove Shortlist
                        </button>
                      )}

                      <button
                        className="btn-status reject"
                        onClick={() => handleStatusChange(item, 'rejected')}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CANDIDATE PROFILE MODAL */}
      {activeStudentId && (
        <CandidateProfileModal
          studentId={activeStudentId}
          onClose={() => setActiveStudentId(null)}
        />
      )}
    </div>
  );
};

export default ShortlistPage;
