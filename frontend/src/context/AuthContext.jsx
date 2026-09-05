import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      try {
        const base64Url = token.split('.')[1];
        if (base64Url) {
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
  
          const decoded = JSON.parse(jsonPayload);
          setUser(decoded);
        }
      } catch (error) {
        console.error("Invalid token format");
        setToken(null);
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await authService.login(email, password);
      
      const receivedToken = response.data.token;
      let userData = response.data.user;
      
      if (!userData && receivedToken) {
         try {
           const base64Url = receivedToken.split('.')[1];
           const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
           const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
               return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
           }).join(''));
           userData = JSON.parse(jsonPayload);
         } catch (e) {
           console.error("Token decoding failed", e);
         }
      }

      setToken(receivedToken);
      localStorage.setItem('token', receivedToken);
      setUser(userData);
      
      setLoading(false);
      return { success: true, role: userData?.role };
    } catch (error) {
      setLoading(false);
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await authService.register(userData);
      setLoading(false);
      return { success: true, message: response.message };
    } catch (error) {
      setLoading(false);
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Registration failed' 
      };
    }
  };

  const forgotPassword = async (email) => {
    setLoading(true);
    try {
      const response = await authService.forgotPassword(email);
      setLoading(false);
      return { success: true, message: response.message };
    } catch (error) {
      setLoading(false);
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Forgot password failed' 
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  const isAuthenticated = () => !!token;

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, forgotPassword, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
