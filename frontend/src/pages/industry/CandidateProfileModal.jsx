import React, { useEffect, useState } from 'react';
import {
  X,
  UserCheck,
  Award,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  ShieldCheck,
  FileText
} from 'lucide-react';
import industryService from '../../services/industryService';
import './CandidateProfileModal.css';

const CandidateProfileModal = ({ studentId, onClose }) => {
  const [student, setStudent] = useState(null);
  const [verifiedSkills, setVerifiedSkills] = useState([]);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (studentId) {
      fetchCandidateDetails();
    }
  }, [studentId]);

  const fetchCandidateDetails = async () => {
    try {
      setLoading(true);
      setError('');

      const [studentRes, verifiedRes, aiRes] = await Promise.allSettled([
        industryService.getCandidateProfile(studentId),
        industryService.getCandidateVerifiedSkills(studentId),
        industryService.getCandidateAISuggestions(studentId)
      ]);

      if (studentRes.status === 'fulfilled' && (studentRes.value?.data || studentRes.value?.student)) {
        setStudent(studentRes.value?.data || studentRes.value?.student || studentRes.value);
      }

      if (verifiedRes.status === 'fulfilled' && verifiedRes.value?.data) {
        setVerifiedSkills(verifiedRes.value.data || []);
      }

      if (aiRes.status === 'fulfilled' && aiRes.value?.data) {
        setAiSuggestions(aiRes.value.data || []);
      }
    } catch (err) {
      console.error('Failed to load candidate profile:', err);
      setError('Could not fetch candidate details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container large candidate-profile-modal">
        {/* HEADER */}
        <div className="modal-header">
          <div className="candidate-header-group">
            <div className="candidate-avatar-large">
              {(student?.name || 'S').charAt(0).toUpperCase()}
            </div>
            <div>
              <h3>{student?.name || 'Candidate Student Profile'}</h3>
              <p className="modal-subtitle">
                {student?.department} • Year {student?.year} • CGPA: <strong>{student?.cgpa || 'N/A'}</strong>
              </p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {loading ? (
          <div className="loading-state">Loading candidate skill profile and verified evidence...</div>
        ) : error ? (
          <div className="form-error-alert">{error}</div>
        ) : (
          <div className="candidate-profile-body">
            {/* NOTICE BANNER: CLEAR DISTINCTION */}
            <div className="distinction-notice-banner">
              <ShieldCheck size={20} className="icon-shield" />
              <div>
                <strong>SmartHire Hub Evidence System:</strong>
                Skills are strictly classified into 
                <span className="badge-inline confirmed">CONFIRMED SKILLS</span>, 
                <span className="badge-inline ai">AI SUGGESTIONS</span>, and 
                <span className="badge-inline assessed">ASSESSED PROFICIENCY</span>.
              </div>
            </div>

            {/* CONFIRMED SKILLS SECTION */}
            <div className="profile-section">
              <div className="section-title-row">
                <h4>
                  <CheckCircle2 size={18} className="text-emerald" /> Confirmed Skills ({verifiedSkills.length})
                </h4>
                <span className="verified-status-tag">STUDENT VERIFIED & CONFIRMED</span>
              </div>
              {verifiedSkills.length === 0 ? (
                <p className="empty-text">No confirmed skills registered yet.</p>
              ) : (
                <div className="skills-grid">
                  {verifiedSkills.map((prof) => (
                    <div key={prof._id} className="skill-card-item confirmed">
                      <div className="skill-item-header">
                        <span className="skill-name">{prof.skillId?.name || 'Skill'}</span>
                        <span className="badge-tag confirmed-tag">CONFIRMED SKILL</span>
                      </div>
                      <div className="skill-item-meta">
                        <span>Level: <strong>{prof.level ? `Level ${prof.level} / 5` : 'Level 1'}</strong></span>
                        {prof.score && (
                          <span className="badge-tag assessed-tag">
                            ASSESSED PROFICIENCY: {prof.score}/100
                          </span>
                        )}
                      </div>
                      <div className="skill-source">
                        Source: {prof.source || 'self_assessment'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* AI SUGGESTIONS SECTION (UNVERIFIED) */}
            <div className="profile-section">
              <div className="section-title-row">
                <h4>
                  <Sparkles size={18} className="text-purple" /> AI Suggested Skills ({aiSuggestions.length})
                </h4>
                <span className="unverified-status-tag">PENDING STUDENT CONFIRMATION</span>
              </div>
              {aiSuggestions.length === 0 ? (
                <p className="empty-text">No pending AI skill suggestions.</p>
              ) : (
                <div className="skills-grid">
                  {aiSuggestions.map((prof) => (
                    <div key={prof._id} className="skill-card-item ai-suggestion">
                      <div className="skill-item-header">
                        <span className="skill-name">{prof.skillId?.name || 'Suggested Skill'}</span>
                        <span className="badge-tag ai-tag">AI SUGGESTION</span>
                      </div>
                      <div className="skill-item-meta">
                        <span className="unverified-note">Not counted in match percentage until student confirms.</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ACADEMIC & PROJECTS SECTION */}
            <div className="profile-grid-2">
              {/* PROJECTS */}
              <div className="profile-subcard">
                <h4><BookOpen size={16} /> Relevant Projects</h4>
                {student?.projects && student.projects.length > 0 ? (
                  <ul className="profile-bullet-list">
                    {student.projects.map((proj, i) => (
                      <li key={i}>{typeof proj === 'string' ? proj : proj.title || 'Project Item'}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="empty-text">No projects listed.</p>
                )}
              </div>

              {/* CERTIFICATIONS / ACHIEVEMENTS */}
              <div className="profile-subcard">
                <h4><Award size={16} /> Certifications & Evidence</h4>
                {student?.interests && student.interests.length > 0 ? (
                  <ul className="profile-bullet-list">
                    {student.interests.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="empty-text">No certification records available.</p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfileModal;
