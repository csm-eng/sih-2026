import React, { useState } from 'react';
import { X, MessageSquare, CheckCircle, Star, AlertCircle } from 'lucide-react';
import industryService from '../../services/industryService';
import './InterviewFeedbackModal.css';

const InterviewFeedbackModal = ({ application, onClose, onSuccess }) => {
  const student = application?.studentId || {};
  const opportunity = application?.opportunityId || {};

  const [formData, setFormData] = useState({
    interviewStatus: 'completed',
    feedbackNotes: '',
    skillObservations: '',
    recommendationRating: 4,
    selectionResult: application?.status === 'selected' ? 'selected' : 'shortlisted'
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError('');
      setSuccessMsg('');

      const result = await industryService.submitInterviewFeedback(
        application._id,
        formData
      );

      if (result?.success || result?.data) {
        setSuccessMsg('Interview Feedback & Closed-Loop Observations recorded!');
        setTimeout(() => {
          if (onSuccess) onSuccess();
        }, 1200);
      } else {
        setError(result?.message || 'Failed to record interview feedback.');
      }
    } catch (err) {
      console.error('Error submitting interview feedback:', err);
      setError(err.response?.data?.message || err.message || 'Failed to submit feedback.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <div className="modal-header">
          <div>
            <h3>Record Interview & Closed-Loop Feedback</h3>
            <p className="modal-subtitle">
              Candidate: <strong>{student.name || 'Student'}</strong> — Role: <strong>{opportunity.title || 'Opportunity'}</strong>
            </p>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {error && <div className="form-error-alert">{error}</div>}
        {successMsg && (
          <div className="form-success-alert">
            <CheckCircle size={18} />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="opportunity-form">
          <div className="form-group">
            <label>Interview Status *</label>
            <select
              value={formData.interviewStatus}
              onChange={(e) => setFormData({ ...formData, interviewStatus: e.target.value })}
            >
              <option value="scheduled">Interview Scheduled</option>
              <option value="in_progress">Interview In Progress</option>
              <option value="completed">Interview Completed</option>
              <option value="cancelled">Interview Cancelled</option>
            </select>
          </div>

          <div className="form-group">
            <label>Selection Result / Pipeline Status *</label>
            <select
              value={formData.selectionResult}
              onChange={(e) => setFormData({ ...formData, selectionResult: e.target.value })}
            >
              <option value="under_review">Under Review</option>
              <option value="shortlisted">Shortlisted for Next Round</option>
              <option value="selected">Selected / Hired</option>
              <option value="rejected">Rejected / Not Selected</option>
            </select>
          </div>

          <div className="form-group">
            <label>Candidate Recommendation Rating (1 to 5 Stars)</label>
            <select
              value={formData.recommendationRating}
              onChange={(e) => setFormData({ ...formData, recommendationRating: Number(e.target.value) })}
            >
              <option value={5}>5 Stars — Strongly Recommend</option>
              <option value={4}>4 Stars — Recommend</option>
              <option value={3}>3 Stars — Neutral / Borderline</option>
              <option value={2}>2 Stars — Needs Skill Improvement</option>
              <option value={1}>1 Star — Not Recommended</option>
            </select>
          </div>

          <div className="form-group">
            <label>Interview Feedback & Evaluator Notes</label>
            <textarea
              rows="3"
              value={formData.feedbackNotes}
              onChange={(e) => setFormData({ ...formData, feedbackNotes: e.target.value })}
              placeholder="Record candidate strengths, problem-solving approach, communication skills, and interview remarks..."
            />
          </div>

          {/* CLOSED LOOP SKILL OBSERVATIONS */}
          <div className="form-section-box">
            <h4>Closed-Loop Skill Observations (Institutional Feedback)</h4>
            <p className="section-hint">
              Observations feed back into institutional insights to improve curriculum design and student training interventions.
            </p>
            <textarea
              rows="2"
              value={formData.skillObservations}
              onChange={(e) => setFormData({ ...formData, skillObservations: e.target.value })}
              placeholder="e.g. Candidate exhibited strong Java fundamentals, but lacked hands-on Spring Boot REST API deployment practice."
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : 'Submit Closed-Loop Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InterviewFeedbackModal;
