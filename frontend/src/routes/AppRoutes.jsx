import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import StudentDashboard from '../pages/student/StudentDashboard';
// Auth Pages
import AuthLayout from '../components/layout/AuthLayout';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';

// Dummy components for Phase 1

const InstituteDashboard = () => <div>Institute Dashboard</div>;
const IndustryDashboard = () => <div>Industry Dashboard</div>;
const Unauthorized = () => <div>Unauthorized</div>;

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return children;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>
        
        <Route path="/unauthorized" element={<Unauthorized />} />
        
        {/* Student Routes */}
        <Route 
          path="/student/*" 
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <Routes>
                <Route path="dashboard" element={<StudentDashboard />} />
                <Route path="" element={<Navigate to="dashboard" replace />} />
              </Routes>
            </ProtectedRoute>
          } 
        />
        
        {/* Institute Routes */}
        <Route 
          path="/institute/*" 
          element={
            <ProtectedRoute allowedRoles={['institute']}>
              <Routes>
                <Route path="dashboard" element={<InstituteDashboard />} />
                <Route path="" element={<Navigate to="dashboard" replace />} />
              </Routes>
            </ProtectedRoute>
          } 
        />
        
        {/* Industry Routes */}
        <Route 
          path="/industry/*" 
          element={
            <ProtectedRoute allowedRoles={['company']}>
              <Routes>
                <Route path="dashboard" element={<IndustryDashboard />} />
                <Route path="" element={<Navigate to="dashboard" replace />} />
              </Routes>
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
