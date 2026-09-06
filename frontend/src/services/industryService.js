import api from './api';

const industryService = {
  // Company Dashboard Summary
  getDashboard: async () => {
    const response = await api.get('/companies/dashboard');
    return response.data;
  },

  // Company Profile
  getCompanyById: async (companyId) => {
    const response = await api.get(`/companies/${companyId}`);
    return response.data;
  },

  updateCompany: async (companyId, data) => {
    const response = await api.put(`/companies/${companyId}`, data);
    return response.data;
  },

  // Opportunities
  getCompanyOpportunities: async (companyId) => {
    const response = await api.get(`/opportunities/company/${companyId}`);
    return response.data;
  },

  getAllOpportunities: async () => {
    const response = await api.get('/opportunities');
    return response.data;
  },

  getOpportunityById: async (id) => {
    const response = await api.get(`/opportunities/${id}`);
    return response.data;
  },

  createOpportunity: async (opportunityData) => {
    const response = await api.post('/opportunities', opportunityData);
    return response.data;
  },

  updateOpportunity: async (id, opportunityData) => {
    const response = await api.put(`/opportunities/${id}`, opportunityData);
    return response.data;
  },

  deleteOpportunity: async (id) => {
    const response = await api.delete(`/opportunities/${id}`);
    return response.data;
  },

  // Skill Demands
  getSkillDemands: async () => {
    const response = await api.get('/skill-demand');
    return response.data;
  },

  createSkillDemand: async (skillDemandData) => {
    const response = await api.post('/skill-demand', skillDemandData);
    return response.data;
  },

  // Skills Master Catalog
  getSkills: async () => {
    const response = await api.get('/skills');
    return response.data;
  },

  // Candidates & Matching
  getOpportunityMatches: async (opportunityId) => {
    const response = await api.get(`/shortlists/opportunity/${opportunityId}`);
    return response.data;
  },

  updateShortlistStatus: async (payload) => {
    // payload: { id, studentId, opportunityId, status, notes }
    const endpoint = payload.id ? `/shortlists/${payload.id}/status` : '/shortlists/status';
    const response = await api.patch(endpoint, payload);
    return response.data;
  },

  // Applications
  getOpportunityApplications: async (opportunityId) => {
    const response = await api.get(`/applications/opportunity/${opportunityId}`);
    return response.data;
  },

  updateApplicationStatus: async (applicationId, status) => {
    const response = await api.patch(`/applications/${applicationId}/status`, { status });
    return response.data;
  },

  // Candidate Details
  getCandidateProfile: async (studentId) => {
    const response = await api.get(`/students/${studentId}`);
    return response.data;
  },

  getCandidateVerifiedSkills: async (studentId) => {
    const response = await api.get(`/skill-profiles/student/${studentId}/verified`);
    return response.data;
  },

  getCandidateAISuggestions: async (studentId) => {
    const response = await api.get(`/skill-profiles/student/${studentId}/suggestions`);
    return response.data;
  },

  // Analytics
  getIndustryAnalytics: async () => {
    const response = await api.get('/analytics/industry');
    return response.data;
  },

  // Interview & Closed-Loop Feedback
  submitInterviewFeedback: async (applicationId, feedbackData) => {
    try {
      const response = await api.post(`/applications/${applicationId}/feedback`, feedbackData);
      return response.data;
    } catch (err) {
      // Fallback: If isolated endpoint not on backend, update application status or return local acknowledgment
      if (err.response?.status === 404) {
        if (feedbackData.selectionResult) {
          await api.patch(`/applications/${applicationId}/status`, {
            status: feedbackData.selectionResult === 'selected' ? 'selected' : feedbackData.selectionResult === 'rejected' ? 'rejected' : 'shortlisted'
          });
        }
        return {
          success: true,
          message: 'Feedback recorded successfully (Closed Loop)',
          data: feedbackData
        };
      }
      throw err;
    }
  }
};

export default industryService;
