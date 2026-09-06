import React, { useEffect, useState } from 'react';
import { X, Plus, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import industryService from '../../services/industryService';
import './CreateOpportunityModal.css';

const CreateOpportunityModal = ({ onClose, onSuccess }) => {
  const [skillsCatalog, setSkillsCatalog] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    type: 'internship',
    description: '',
    location: '',
    mode: 'onsite',
    duration: '',
    stipendSalary: '',
    minimumCGPA: 6.0,
    minimumYear: 3,
    department: 'Computer Science, Information Technology',
    applicationDeadline: '',
    preferredSkillsText: ''
  });

  // Selected required skills: array of { skillId, requiredLevel }
  const [requiredSkills, setRequiredSkills] = useState([
    { skillId: '', requiredLevel: 3 }
  ]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoadingSkills(true);
      const res = await industryService.getSkills();
      if (res?.data) {
        setSkillsCatalog(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch skills:', err);
    } finally {
      setLoadingSkills(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSkillRow = () => {
    setRequiredSkills((prev) => [...prev, { skillId: '', requiredLevel: 3 }]);
  };

  const handleRemoveSkillRow = (index) => {
    setRequiredSkills((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSkillChange = (index, field, value) => {
    setRequiredSkills((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError('');

      if (!formData.title.trim()) {
        setError('Opportunity Title is required.');
        setSubmitting(false);
        return;
      }

      // Filter valid required skills
      const validRequiredSkills = requiredSkills
        .filter((s) => s.skillId)
        .map((s) => ({
          skillId: s.skillId,
          requiredLevel: Number(s.requiredLevel)
        }));

      if (validRequiredSkills.length === 0) {
        setError('Please select at least one required skill.');
        setSubmitting(false);
        return;
      }

      const departmentsArray = formData.department
        .split(',')
        .map((d) => d.trim())
        .filter(Boolean);

      const payload = {
        title: formData.title,
        type: formData.type,
        description: formData.description,
        location: formData.location,
        mode: formData.mode,
        requiredSkills: validRequiredSkills,
        eligibility: {
          department: departmentsArray,
          minimumYear: Number(formData.minimumYear),
          minimumCGPA: Number(formData.minimumCGPA)
        },
        applicationDeadline: formData.applicationDeadline ? new Date(formData.applicationDeadline) : undefined,
        status: 'open'
      };

      const result = await industryService.createOpportunity(payload);

      if (result?.success || result?.data) {
        if (onSuccess) onSuccess();
      } else {
        setError(result?.message || 'Failed to create opportunity.');
      }
    } catch (err) {
      console.error('Error creating opportunity:', err);
      setError(err.response?.data?.message || err.message || 'Error submitting opportunity form.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container large">
        <div className="modal-header">
          <div>
            <h3>Create New Industry Opportunity</h3>
            <p className="modal-subtitle">
              Specify job/internship details and skill criteria for verified candidate matching.
            </p>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="form-error-alert">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="opportunity-form">
          <div className="form-grid-2">
            {/* Title */}
            <div className="form-group col-span-2">
              <label>Opportunity Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Full Stack Developer Intern / AI Engineer"
                required
              />
            </div>

            {/* Type */}
            <div className="form-group">
              <label>Opportunity Type *</label>
              <select name="type" value={formData.type} onChange={handleChange}>
                <option value="internship">Internship</option>
                <option value="job">Full-time Job</option>
                <option value="project">Industry Project</option>
              </select>
            </div>

            {/* Work Mode */}
            <div className="form-group">
              <label>Work Mode *</label>
              <select name="mode" value={formData.mode} onChange={handleChange}>
                <option value="onsite">On-site</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            {/* Location */}
            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Bangalore, KA / Hybrid"
              />
            </div>

            {/* Duration */}
            <div className="form-group">
              <label>Duration / Commitment</label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g. 6 Months / Permanent"
              />
            </div>

            {/* Stipend / Salary */}
            <div className="form-group">
              <label>Stipend / Salary Range</label>
              <input
                type="text"
                name="stipendSalary"
                value={formData.stipendSalary}
                onChange={handleChange}
                placeholder="e.g. ₹25,000/mo or ₹8-12 LPA"
              />
            </div>

            {/* Application Deadline */}
            <div className="form-group">
              <label>Application Deadline</label>
              <input
                type="date"
                name="applicationDeadline"
                value={formData.applicationDeadline}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label>Description & Responsibilities</label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the opportunity role, key projects, and expectations..."
            />
          </div>

          {/* REQUIRED SKILLS SECTION */}
          <div className="form-section-box">
            <div className="section-box-header">
              <h4>Required Skills & Desired Proficiency Levels *</h4>
              <button
                type="button"
                className="btn-outline-sm"
                onClick={handleAddSkillRow}
              >
                <Plus size={14} /> Add Skill
              </button>
            </div>
            <p className="section-hint">
              Select skills and min proficiency (1-5). Match scores are calculated using verified student skill profiles.
            </p>

            <div className="skills-select-rows">
              {requiredSkills.map((item, index) => (
                <div key={index} className="skill-row-item">
                  <div className="skill-select-col">
                    <select
                      value={item.skillId}
                      onChange={(e) => handleSkillChange(index, 'skillId', e.target.value)}
                    >
                      <option value="">-- Select Skill --</option>
                      {skillsCatalog.map((sk) => (
                        <option key={sk._id} value={sk._id}>
                          {sk.name} ({sk.category || 'Tech'})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="level-select-col">
                    <label>Required Level:</label>
                    <select
                      value={item.requiredLevel}
                      onChange={(e) => handleSkillChange(index, 'requiredLevel', e.target.value)}
                    >
                      <option value={1}>Level 1 (Beginner)</option>
                      <option value={2}>Level 2 (Developing)</option>
                      <option value={3}>Level 3 (Intermediate)</option>
                      <option value={4}>Level 4 (Advanced)</option>
                      <option value={5}>Level 5 (Expert)</option>
                    </select>
                  </div>

                  {requiredSkills.length > 1 && (
                    <button
                      type="button"
                      className="remove-row-btn"
                      onClick={() => handleRemoveSkillRow(index)}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ELIGIBILITY SECTION */}
          <div className="form-grid-3">
            <div className="form-group">
              <label>Minimum CGPA</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                name="minimumCGPA"
                value={formData.minimumCGPA}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Eligible Minimum Year</label>
              <select
                name="minimumYear"
                value={formData.minimumYear}
                onChange={handleChange}
              >
                <option value={1}>1st Year+</option>
                <option value={2}>2nd Year+</option>
                <option value={3}>3rd Year+</option>
                <option value={4}>4th Year Only</option>
              </select>
            </div>

            <div className="form-group">
              <label>Eligible Departments</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="Comma separated: CS, IT, ECE"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Publishing...' : 'Publish Opportunity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOpportunityModal;
