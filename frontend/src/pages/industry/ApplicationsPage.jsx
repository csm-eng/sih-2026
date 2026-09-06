import React, { useEffect, useState } from 'react';
import {
  FileCheck2,
  Search,
  ChevronRight,
  MessageSquare,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink
} from 'lucide-react';
import industryService from '../../services/industryService';
import CandidateProfileModal from './CandidateProfileModal';
import InterviewFeedbackModal from './InterviewFeedbackModal';
import './ApplicationsPage.css';

const ApplicationsPage = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [selectedOppId, setSelectedOppId] = useState('');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Status Filter Tab: 'all', 'applied', 'under_review', 'shortlisted', 'interview', 'selected', 'rejected'
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals
  const [activeStudentId, setActiveStudentId] = useState(null);
  const [feedbackApplication, setFeedbackApplication] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedOppId) {
      fetchApplicationsForOpp(selectedOppId);
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

  const fetchApplicationsForOpp = async (oppId) => {
    try {
      setLoading(true);
      setError('');
      const res = await industryService.getOpportunityApplications(oppId);
      setApplications(res?.data || []);
    } catch (err) {
      console.error('Failed to load applications:', err);
      setError('Could not fetch applications for this opportunity.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appId, newStatus) => {
    try {
      await industryService.updateApplicationStatus(appId, newStatus);
      setApplications((prev) =>
        prev.map((app) => (app._id === appId ? { ...app, status: newStatus } : app))
      );
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Could not update application status.');
    }
  };

  const filteredApplications = applications.filter((app) => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'interview') return app.status === 'under_review' || app.status === 'shortlisted';
    return app.status === statusFilter;
  });

  return (
    <div className="applications-page">
      {/* HEADER */}
      <div className="page-header">
        <div>
          <h2>Candidate Applications Pipeline</h2>
          <p>
            Review incoming submissions, transition application statuses, and record interview feedback.
          </p>
        </div>
      </div>

      {/* OPPORTUNITY SELECTOR & PIPELINE TABS */}
      <div className="pipeline-controls-card">
        <div className="opp-select-wrapper">
          <label>Opportunity Target:</label>
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

        {/* STATUS TABS */}
        <div className="status-tabs-row">
          <button
            className={`status-tab ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            All ({applications.length})
          </button>
          <button
            className={`status-tab ${statusFilter === 'applied' ? 'active' : ''}`}
            onClick={() => setStatusFilter('applied')}
          >
            Applied
          </button>
          <button
            className={`status-tab ${statusFilter === 'under_review' ? 'active' : ''}`}
            onClick={() => setStatusFilter('under_review')}
          >
            Under Review
          </button>
          <button
            className={`status-tab ${statusFilter === 'shortlisted' ? 'active' : ''}`}
            onClick={() => setStatusFilter('shortlisted')}
          >
            Shortlisted
          </button>
          <button
            className={`status-tab ${statusFilter === 'selected' ? 'active' : ''}`}
            onClick={() => setStatusFilter('selected')}
          >
            Selected
          </button>
          <button
            className={`status-tab ${statusFilter === 'rejected' ? 'active' : ''}`}
            onClick={() => setStatusFilter('rejected')}
          >
            Rejected
          </button>
        </div>
      </div>

      {/* APPLICATIONS LIST */}
      <div className="content-card">
        {loading ? (
          <div className="loading-state">Loading Applications...</div>
        ) : filteredApplications.length === 0 ? (
          <div className="empty-state">
            <FileCheck2 size={40} className="empty-icon" />
            <p className="empty-title">No Applications Found</p>
            <p className="empty-desc">
              No student applications match the selected status filter for this opportunity.
            </p>
          </div>
        ) : (
          <div className="applications-list-container">
            {filteredApplications.map((app) => {
              const student = app.studentId || {};
              const opp = app.opportunityId || {};

              return (
                <div key={app._id} className="application-card-item">
                  <div className="app-card-left">
                    <div className="candidate-avatar">
                      {(student.name || 'S').charAt(0).toUpperCase()}
                    </div>
                    <div className="app-details">
                      <h4 className="app-student-name">{student.name || 'Student Candidate'}</h4>
                      <div className="app-student-sub">
                        {student.department} • Year {student.year} • CGPA: <strong>{student.cgpa || '8.5'}</strong>
                      </div>
                      <div className="app-date">
                        Applied: {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'Recently'}
                      </div>
                      {app.coverLetter && (
                        <div className="app-cover-letter">
                          "{app.coverLetter}"
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="app-card-right">
                    <div className="app-status-badge-group">
                      <span className={`app-status-badge ${app.status}`}>
                        {app.status}
                      </span>
                      <span className="app-score">Match: {app.matchScore || 85}%</span>
                    </div>

                    <div className="app-action-buttons">
                      <button
                        className="btn-outline-sm"
                        onClick={() => setActiveStudentId(student._id || student)}
                      >
                        Inspect Profile
                      </button>

                      <button
                        className="btn-outline-sm feedback-btn"
                        onClick={() => setFeedbackApplication(app)}
                      >
                        <MessageSquare size={14} /> Interview / Feedback
                      </button>

                      {/* QUICK STATUS TRANSITIONS */}
                      <select
                        className="status-change-select"
                        value={app.status}
                        onChange={(e) => handleStatusUpdate(app._id, e.target.value)}
                      >
                        <option value="applied">Status: Applied</option>
                        <option value="under_review">Status: Under Review</option>
                        <option value="shortlisted">Status: Shortlisted</option>
                        <option value="selected">Status: Selected</option>
                        <option value="rejected">Status: Rejected</option>
                      </select>
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

      {/* INTERVIEW FEEDBACK MODAL */}
      {feedbackApplication && (
        <InterviewFeedbackModal
          application={feedbackApplication}
          onClose={() => setFeedbackApplication(null)}
          onSuccess={() => {
            setFeedbackApplication(null);
            if (selectedOppId) fetchApplicationsForOpp(selectedOppId);
          }}
        />
      )}
    </div>
  );
};

export default ApplicationsPage;
