import React, { createContext, useEffect, useState } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext();

const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];

    if (!base64Url) {
      return null;
    }

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(
          (char) =>
            '%' + ('00' + char.charCodeAt(0).toString(16)).slice(-2)
        )
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    () => localStorage.getItem('token') || null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    const decodedUser = decodeToken(token);

    if (!decodedUser) {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      setLoading(false);
      return;
    }

    setUser(decodedUser);
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);

    try {
      const response = await authService.login(email, password);

      const receivedToken = response?.data?.token;
      const receivedUser = response?.data?.user;

      if (!receivedToken) {
        throw new Error('Login response did not contain a token');
      }

      const decodedUser = decodeToken(receivedToken);

      const userData = {
        ...decodedUser,
        ...receivedUser,
      };

      localStorage.setItem('token', receivedToken);

      setToken(receivedToken);
      setUser(userData);

      return {
        success: true,
        role: userData?.role,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          'Login failed',
      };
    } finally {
      setLoading(false);
    }
  };
const register = async (userData) => {
  setLoading(true);

  try {
    const response = await authService.register(userData);

    return {
      success: true,
      message: response?.message || 'Registration successful',
      data: response?.data,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        'Registration failed',
    };
  } finally {
    setLoading(false);
  }
};
const forgotPassword = async (email) => {
  setLoading(true);

  try {
    const response = await authService.forgotPassword(email);

    return {
      success: true,
      message: response?.message || 'Password reset request successful',
      resetLink: response?.resetLink || null,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        'Password reset failed',
    };
  } finally {
    setLoading(false);
  }
};
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = () => Boolean(token);

  return (
<AuthContext.Provider
  value={{
    user,
    token,
    loading,
    login,
    register,
    forgotPassword,
    logout,
    isAuthenticated,
  }}
>
      {children}
    </AuthContext.Provider>
  );
};