import React, { useEffect, useState } from 'react';
import {
  X,
  UserCheck,
  CheckCircle2,
  Sparkles,
  Award,
  BookOpen,
  Briefcase,
  ShieldCheck,
  FileText,
  Target
} from 'lucide-react';
import instituteService from '../../services/instituteService';
import './InstituteStudentProfileModal.css';

const InstituteStudentProfileModal = ({ studentId, onClose }) => {
  const [student, setStudent] = useState(null);
  const [verifiedSkills, setVerifiedSkills] = useState([]);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [weakAreas, setWeakAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (studentId) {
      fetchStudentDetails();
    }
  }, [studentId]);

  const fetchStudentDetails = async () => {
    try {
      setLoading(true);
      setError('');

      const [studentRes, verifiedRes, aiRes, weakRes] = await Promise.allSettled([
        instituteService.getStudentDetails(studentId),
        instituteService.getStudentVerifiedSkills(studentId),
        instituteService.getStudentAISuggestions(studentId),
        instituteService.getStudentWeakAreas(studentId)
      ]);

      if (studentRes.status === 'fulfilled' && studentRes.value) {
        setStudent(studentRes.value?.data || studentRes.value?.student || studentRes.value);
      }

      if (verifiedRes.status === 'fulfilled' && verifiedRes.value) {
        setVerifiedSkills(verifiedRes.value.data || []);
      }

      if (aiRes.status === 'fulfilled' && aiRes.value) {
        setAiSuggestions(aiRes.value.data || []);
      }

      if (weakRes.status === 'fulfilled' && weakRes.value) {
        setWeakAreas(weakRes.value.data || weakRes.value || []);
      }
    } catch (err) {
      console.error('Failed to load student profile:', err);
      setError('Could not fetch student details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container large student-profile-modal">
        {/* HEADER */}
        <div className="modal-header">
          <div className="candidate-header-group">
            <div className="candidate-avatar-large">
              {(student?.name || 'S').charAt(0).toUpperCase()}
            </div>
            <div>
              <h3>{student?.name || 'Student Profile'}</h3>
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
          <div className="loading-state">Loading student verified skill profile...</div>
        ) : error ? (
          <div className="form-error-alert">{error}</div>
        ) : (
          <div className="candidate-profile-body">
            {/* EVIDENCE CLASSIFICATION NOTICE */}
            <div className="distinction-notice-banner">
              <ShieldCheck size={20} className="icon-shield" />
              <div>
                <strong>SmartHire Hub Skill Verification Standard:</strong>
                Skills are distinctly classified into 
                <span className="badge-inline confirmed">CONFIRMED SKILLS</span>, 
                <span className="badge-inline ai">AI SUGGESTIONS</span>, 
                <span className="badge-inline assessed">ASSESSED PROFICIENCY</span>, and 
                <span className="badge-inline evidence">EVIDENCE</span>.
                AI extractions are never treated as verified proficiency until explicitly confirmed.
              </div>
            </div>

            {/* CONFIRMED SKILLS */}
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
                        <span>Level: <strong>{prof.level ? `Level ${prof.level} — ${prof.status || 'Intermediate'}` : 'Level 1'}</strong></span>
                        {prof.score && (
                          <span className="badge-tag assessed-tag">
                            ASSESSMENT SCORE: {prof.score}%
                          </span>
                        )}
                      </div>
                      <div className="skill-source">
                        Verified Source: {prof.source || 'self_assessment'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* AI SUGGESTIONS (UNVERIFIED) */}
            <div className="profile-section">
              <div className="section-title-row">
                <h4>
                  <Sparkles size={18} className="text-purple" /> AI Skill Suggestions ({aiSuggestions.length})
                </h4>
                <span className="unverified-status-tag">PENDING STUDENT CONFIRMATION</span>
              </div>
              {aiSuggestions.length === 0 ? (
                <p className="empty-text">No unconfirmed AI skill suggestions.</p>
              ) : (
                <div className="skills-grid">
                  {aiSuggestions.map((prof) => (
                    <div key={prof._id} className="skill-card-item ai-suggestion">
                      <div className="skill-item-header">
                        <span className="skill-name">{prof.skillId?.name || 'Suggested Skill'}</span>
                        <span className="badge-tag ai-tag">AI SUGGESTION</span>
                      </div>
                      <div className="skill-item-meta">
                        <span className="unverified-note">Extracted from resume/projects. Awaiting student verification.</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ACADEMICS & PROJECTS & WEAK AREAS */}
            <div className="profile-grid-2">
              <div className="profile-subcard">
                <h4><BookOpen size={16} /> Projects & Evidence</h4>
                {student?.projects && student.projects.length > 0 ? (
                  <ul className="profile-bullet-list">
                    {student.projects.map((proj, i) => (
                      <li key={i}>{typeof proj === 'string' ? proj : proj.title || 'Project Record'}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="empty-text">No project records submitted.</p>
                )}
              </div>

              <div className="profile-subcard">
                <h4><Award size={16} /> Certifications & Achievements</h4>
                {student?.interests && student.interests.length > 0 ? (
                  <ul className="profile-bullet-list">
                    {student.interests.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="empty-text">No certification items registered.</p>
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

export default InstituteStudentProfileModal;
