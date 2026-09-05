import api from './api';

const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (userData) => {
    // MOCK IMPLEMENTATION (Endpoint does not exist in backend)
    console.warn("Mocking registration API call");
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: "Registration successful (Mocked)",
          data: {
            token: "mock-jwt-token-register",
            user: {
              id: "mock-id-123",
              name: userData.name,
              email: userData.email,
              role: userData.role || "student"
            }
          }
        });
      }, 1000);
    });
  },

  forgotPassword: async (email) => {
    // MOCK IMPLEMENTATION (Endpoint does not exist in backend)
    console.warn("Mocking forgot password API call");
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: "Password reset link sent to your email (Mocked)"
        });
      }, 1000);
    });
  }
};

export default authService;
