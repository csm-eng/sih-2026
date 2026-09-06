import React, { useContext } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import { AuthContext } from "../context/AuthContext";

// =====================================================
// AUTH PAGES
// =====================================================
import AuthLayout from "../components/layout/AuthLayout";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

// =====================================================
// STUDENT PAGES
// =====================================================
import StudentDashboard from "../pages/student/StudentDashboard";
import StudentProfile from "../pages/student/StudentProfile";
import LearningRoadmap from "../pages/student/roadmap/LearningRoadmap";

// =====================================================
// INDUSTRY PAGES
// =====================================================
import IndustryLayout from "../components/layout/IndustryLayout";
import IndustryDashboard from "../pages/industry/IndustryDashboard";
import OpportunitiesPage from "../pages/industry/OpportunitiesPage";
import SkillDemandPage from "../pages/industry/SkillDemandPage";
import CandidatesMatchingPage from "../pages/industry/CandidatesMatchingPage";
import ShortlistPage from "../pages/industry/ShortlistPage";
import ApplicationsPage from "../pages/industry/ApplicationsPage";
import IndustryAnalyticsPage from "../pages/industry/IndustryAnalyticsPage";
import IndustryProfilePage from "../pages/industry/IndustryProfilePage";

// =====================================================
// TEMPORARY INSTITUTE COMPONENT
// =====================================================
const InstituteDashboard = () => (
  <div>Institute Dashboard</div>
);

// =====================================================
// UNAUTHORIZED
// =====================================================
const Unauthorized = () => (
  <div>Unauthorized</div>
);

// =====================================================
// PROTECTED ROUTE
// =====================================================
const ProtectedRoute = ({
  children,
  allowedRoles
}) => {
  const {
    isAuthenticated,
    user,
    loading
  } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated()) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (
    allowedRoles &&
    !allowedRoles.includes(user?.role)
  ) {
    return (
      <Navigate
        to="/unauthorized"
        replace
      />
    );
  }

  return children;
};

// =====================================================
// APP ROUTES
// =====================================================
const AppRoutes = () => {
  return (
    <BrowserRouter>

      <Routes>

        {/* =================================================
            ROOT
        ================================================= */}
        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

        {/* =================================================
            AUTH ROUTES
        ================================================= */}
        <Route element={<AuthLayout />}>

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />

          <Route
            path="/reset-password/:token"
            element={<ResetPassword />}
          />

        </Route>

        {/* =================================================
            UNAUTHORIZED
        ================================================= */}
        <Route
          path="/unauthorized"
          element={<Unauthorized />}
        />

        {/* =================================================
            STUDENT ROUTES
        ================================================= */}
        <Route
          path="/student/*"
          element={
            <ProtectedRoute
              allowedRoles={["student"]}
            >
              <Routes>

                {/* Student Dashboard */}
                <Route
                  path="dashboard"
                  element={
                    <StudentDashboard />
                  }
                />

                {/* Student Profile */}
                <Route
                  path="profile"
                  element={
                    <StudentProfile />
                  }
                />

                {/* Learning Roadmap */}
                <Route
                  path="roadmap"
                  element={
                    <LearningRoadmap />
                  }
                />

                {/* Default Student Route */}
                <Route
                  path=""
                  element={
                    <Navigate
                      to="dashboard"
                      replace
                    />
                  }
                />

              </Routes>
            </ProtectedRoute>
          }
        />

        {/* =================================================
            INSTITUTE ROUTES
        ================================================= */}
        <Route
          path="/institute/*"
          element={
            <ProtectedRoute
              allowedRoles={["institute"]}
            >
              <Routes>

                <Route
                  path="dashboard"
                  element={
                    <InstituteDashboard />
                  }
                />

                <Route
                  path=""
                  element={
                    <Navigate
                      to="dashboard"
                      replace
                    />
                  }
                />

              </Routes>
            </ProtectedRoute>
          }
        />

        {/* =================================================
            INDUSTRY ROUTES
        ================================================= */}
        <Route
          path="/industry/*"
          element={
            <ProtectedRoute
              allowedRoles={[
                "company",
                "industry"
              ]}
            >
              <Routes>

                <Route
                  element={
                    <IndustryLayout />
                  }
                >

                  <Route
                    path="dashboard"
                    element={
                      <IndustryDashboard />
                    }
                  />

                  <Route
                    path="opportunities"
                    element={
                      <OpportunitiesPage />
                    }
                  />

                  <Route
                    path="skill-demand"
                    element={
                      <SkillDemandPage />
                    }
                  />

                  <Route
                    path="candidates"
                    element={
                      <CandidatesMatchingPage />
                    }
                  />

                  <Route
                    path="shortlists"
                    element={
                      <ShortlistPage />
                    }
                  />

                  <Route
                    path="applications"
                    element={
                      <ApplicationsPage />
                    }
                  />

                  <Route
                    path="analytics"
                    element={
                      <IndustryAnalyticsPage />
                    }
                  />

                  <Route
                    path="profile"
                    element={
                      <IndustryProfilePage />
                    }
                  />

                  <Route
                    path=""
                    element={
                      <Navigate
                        to="dashboard"
                        replace
                      />
                    }
                  />

                </Route>

              </Routes>
            </ProtectedRoute>
          }
        />

        {/* =================================================
            FALLBACK
        ================================================= */}
        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
};

export default AppRoutes;