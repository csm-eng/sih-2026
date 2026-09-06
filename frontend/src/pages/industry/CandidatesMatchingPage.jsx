import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Users,
  Search,
  CheckCircle2,
  AlertCircle,
  BookmarkCheck,
  Check,
  X,
  ChevronDown,
  Sparkles,
  Info,
  SlidersHorizontal
} from 'lucide-react';
import industryService from '../../services/industryService';
import CandidateProfileModal from './CandidateProfileModal';
import './CandidatesMatchingPage.css';

const CandidatesMatchingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedOppIdFromUrl = searchParams.get('opportunityId') || '';

  const [opportunities, setOpportunities] = useState([]);
  const [selectedOpportunityId, setSelectedOpportunityId] = useState(selectedOppIdFromUrl);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Shortlisting state tracking
  const [shortlistedIds, setShortlistedIds] = useState(new Set());
  const [updatingId, setUpdatingId] = useState(null);

  // Selected candidate profile modal
  const [activeStudentId, setActiveStudentId] = useState(null);

  useEffect(() => {
    fetchOpportunities();
  }, []);

  useEffect(() => {
    if (selectedOpportunityId) {
      fetchMatchesForOpportunity(selectedOpportunityId);
    }
  }, [selectedOpportunityId]);

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      const res = await industryService.getAllOpportunities();
      const opps = res?.data || [];
      setOpportunities(opps);

      if (opps.length > 0) {
        const defaultId = selectedOppIdFromUrl || opps[0]._id;
        setSelectedOpportunityId(defaultId);
        const oppObj = opps.find((o) => o._id === defaultId) || opps[0];
        setSelectedOpportunity(oppObj);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error('Failed to load opportunities:', err);
      setError('Could not load opportunities.');
      setLoading(false);
    }
  };

  const fetchMatchesForOpportunity = async (oppId) => {
    try {
      setLoading(true);
      setError('');
      const oppObj = opportunities.find((o) => o._id === oppId);
      if (oppObj) setSelectedOpportunity(oppObj);

      const res = await industryService.getOpportunityMatches(oppId);
      const shortlistData = res?.data || [];
      setMatches(shortlistData);

      const initialShortlisted = new Set();
      shortlistData.forEach((m) => {
        if (m.status === 'shortlisted') {
          initialShortlisted.add(m._id || m.studentId?._id);
        }
      });
      setShortlistedIds(initialShortlisted);
    } catch (err) {
      console.error('Failed to load opportunity candidates:', err);
      setError('Could not load candidates for this opportunity.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpportunityChange = (e) => {
    const oppId = e.target.value;
    setSelectedOpportunityId(oppId);
    setSearchParams({ opportunityId: oppId });
  };

  const handleToggleShortlist = async (match) => {
    const matchId = match._id;
    const studentId = match.studentId?._id || match.studentId;
    const isCurrentlyShortlisted = match.status === 'shortlisted';
    const newStatus = isCurrentlyShortlisted ? 'matched' : 'shortlisted';

    try {
      setUpdatingId(matchId);
      await industryService.updateShortlistStatus({
        id: matchId,
        studentId,
        opportunityId: selectedOpportunityId,
        status: newStatus
      });

      // Update local state
      setMatches((prev) =>
        prev.map((m) => (m._id === matchId ? { ...m, status: newStatus } : m))
      );

      setShortlistedIds((prev) => {
        const next = new Set(prev);
        if (newStatus === 'shortlisted') {
          next.add(matchId);
        } else {
          next.delete(matchId);
        }
        return next;
      });
    } catch (err) {
      console.error('Failed to update shortlist status:', err);
      alert('Could not update shortlist status.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="candidates-matching-page">
      {/* PAGE HEADER */}
      <div className="page-header">
        <div>
          <h2>Candidate Matching & Verified Intelligence</h2>
          <p>
            Explainable Skill Match breakdown. Only student-confirmed skills are evaluated.
          </p>
        </div>
      </div>

      {/* OPPORTUNITY SELECTOR BAR */}
      <div className="opp-selector-card">
        <label>Select Target Opportunity:</label>
        <select
          value={selectedOpportunityId}
          onChange={handleOpportunityChange}
          className="opp-dropdown"
        >
          {opportunities.map((opp) => (
            <option key={opp._id} value={opp._id}>
              {opp.title} ({opp.type} • {opp.location || 'Remote'})
            </option>
          ))}
        </select>

        {selectedOpportunity && (
          <div className="opp-meta-pill">
            Required Skills: {selectedOpportunity.requiredSkills?.length || 0}
          </div>
        )}
      </div>

      {/* VERIFICATION NOTICE */}
      <div className="verification-alert-card">
        <Info size={18} className="icon-info" />
        <div>
          <strong>SmartHire Hub Explainable Skill Matching:</strong> AI-detected skills are strictly excluded from confirmed match scoring until explicitly verified by the student.
        </div>
      </div>

      {/* CANDIDATES LIST */}
      {loading ? (
        <div className="loading-state">Computing Candidate Matches...</div>
      ) : matches.length === 0 ? (
        <div className="content-card empty-card">
          <Users size={40} className="empty-icon" />
          <h3>No Matched Candidates Found</h3>
          <p>
            No student matches computed for this opportunity yet. Students will appear automatically when their verified skills align with opportunity requirements.
          </p>
        </div>
      ) : (
        <div className="candidates-grid">
          {matches.map((item) => {
            const student = item.studentId || {};
            const matchScore = item.matchScore || 0;
            const isShortlisted = item.status === 'shortlisted';

            const matchedSkills = item.matchedSkills || [];
            const missingSkills = item.missingSkills || [];

            return (
              <div key={item._id} className="candidate-matching-card">
                {/* TOP HEADER */}
                <div className="card-top-row">
                  <div className="candidate-primary-info">
                    <h3 className="student-name">{student.name || 'Candidate Student'}</h3>
                    <div className="student-academic-tags">
                      <span>{student.department || 'Computer Science'}</span>
                      <span className="dot">•</span>
                      <span>Year {student.year || 3}</span>
                      <span className="dot">•</span>
                      <span className="cgpa-highlight">CGPA: {student.cgpa || '8.5'}</span>
                    </div>
                  </div>

                  {/* SCORE BADGE */}
                  <div className="match-score-badge">
                    <span className="score-label">Match Score</span>
                    <span className="score-percent">{matchScore}%</span>
                  </div>
                </div>

                {/* EXPLAINABLE MATCHING SECTION */}
                <div className="explainable-matching-container">
                  {/* MATCHED SKILLS BREAKDOWN */}
                  <div className="explainable-column matched">
                    <h4 className="column-title text-emerald">
                      <CheckCircle2 size={15} /> Matched Skills ({matchedSkills.length})
                    </h4>
                    {matchedSkills.length === 0 ? (
                      <p className="no-skill-text">No required skills met at benchmark level.</p>
                    ) : (
                      <div className="skills-explain-list">
                        {matchedSkills.map((sk, idx) => (
                          <div key={idx} className="skill-item-explain matched">
                            <span className="check-mark">✓</span>
                            <span className="skill-name">{sk.skillId?.name || 'Skill'}</span>
                            <span className="skill-level">
                              — Level {sk.studentLevel || 1}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* SKILL GAPS BREAKDOWN */}
                  <div className="explainable-column gaps">
                    <h4 className="column-title text-rose">
                      <AlertCircle size={15} /> Skill Gaps ({missingSkills.length})
                    </h4>
                    {missingSkills.length === 0 ? (
                      <p className="no-skill-text text-emerald">All required skill benchmarks satisfied!</p>
                    ) : (
                      <div className="skills-explain-list">
                        {missingSkills.map((sk, idx) => (
                          <div key={idx} className="skill-item-explain gap">
                            <span className="bullet-mark">•</span>
                            <span className="skill-name">{sk.skillId?.name || 'Skill'}</span>
                            <span className="gap-detail">
                              — Required Level {sk.requiredLevel}, Current Level {sk.studentLevel || 0}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* FOOTER ACTIONS */}
                <div className="card-footer-actions">
                  <button
                    className="btn-outline-sm"
                    onClick={() => setActiveStudentId(student._id || student)}
                  >
                    View Full Profile & Evidence
                  </button>

                  <button
                    className={`shortlist-btn ${isShortlisted ? 'shortlisted' : ''}`}
                    disabled={updatingId === item._id}
                    onClick={() => handleToggleShortlist(item)}
                  >
                    <BookmarkCheck size={16} />
                    <span>{isShortlisted ? 'Shortlisted ✓' : 'Shortlist Candidate'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CANDIDATE PROFILE DRAWER / MODAL */}
      {activeStudentId && (
        <CandidateProfileModal
          studentId={activeStudentId}
          onClose={() => setActiveStudentId(null)}
        />
      )}
    </div>
  );
};

export default CandidatesMatchingPage;
