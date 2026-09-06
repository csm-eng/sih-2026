import api from './api';

const instituteService = {
  // Institute Dashboard Summary
  getDashboard: async () => {
    const response = await api.get('/institute/dashboard');
    return response.data;
  },

  // Student Directory
  getStudents: async () => {
    const response = await api.get('/institute/students');
    return response.data;
  },

  getStudentDetails: async (studentId) => {
    const response = await api.get(`/institute/students/${studentId}`);
    return response.data;
  },

  getStudentVerifiedSkills: async (studentId) => {
    const response = await api.get(`/skill-profiles/student/${studentId}/verified`);
    return response.data;
  },

  getStudentAISuggestions: async (studentId) => {
    const response = await api.get(`/skill-profiles/student/${studentId}/suggestions`);
    return response.data;
  },

  getStudentRoadmap: async (studentId) => {
    const response = await api.get(`/institute/students/${studentId}/roadmap`);
    return response.data;
  },

  getStudentMockResults: async (studentId) => {
    const response = await api.get(`/institute/students/${studentId}/mock-results`);
    return response.data;
  },

  getStudentWeakAreas: async (studentId) => {
    const response = await api.get(`/institute/students/${studentId}/weak-areas`);
    return response.data;
  },

  // Interventions
  getStudentInterventions: async (studentId) => {
    const response = await api.get(`/institute/students/${studentId}/interventions`);
    return response.data;
  },

  createIntervention: async (studentId, interventionData) => {
    const response = await api.post(`/institute/students/${studentId}/interventions`, interventionData);
    return response.data;
  },

  updateIntervention: async (interventionId, data) => {
    const response = await api.patch(`/institute/interventions/${interventionId}`, data);
    return response.data;
  },

  // Skill Intelligence & Analytics
  getSkillAnalytics: async () => {
    const response = await api.get('/analytics/skills');
    return response.data;
  },

  getSkillGaps: async () => {
    const response = await api.get('/skill-gaps');
    return response.data;
  },

  getSkillDemands: async () => {
    const response = await api.get('/skill-demand');
    return response.data;
  },

  getSkillsCatalog: async () => {
    const response = await api.get('/skills');
    return response.data;
  },

  // Faculty Management
  getFaculties: async () => {
    const response = await api.get('/faculty');
    return response.data;
  },

  createFaculty: async (facultyData) => {
    const response = await api.post('/faculty', facultyData);
    return response.data;
  },

  // Mentorship Management
  getMentorships: async () => {
    const response = await api.get('/mentorships');
    return response.data;
  },

  updateMentorship: async (id, mentorshipData) => {
    const response = await api.put(`/mentorships/${id}`, mentorshipData);
    return response.data;
  }
};

export default instituteService;
