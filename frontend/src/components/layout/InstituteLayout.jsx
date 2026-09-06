import React, { useContext } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Brain,
  Target,
  TrendingUp,
  BookOpenCheck,
  UserCheck,
  UserGroup,
  BarChart3,
  Compass,
  User,
  LogOut,
  GraduationCap
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import './InstituteLayout.css';

const InstituteLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/institute/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/institute/students', label: 'Students', icon: Users },
    { path: '/institute/skill-intelligence', label: 'Skill Intelligence', icon: Brain },
    { path: '/institute/skill-gaps', label: 'Skill Gaps', icon: Target },
    { path: '/institute/industry-demand', label: 'Industry Demand', icon: TrendingUp },
    { path: '/institute/interventions', label: 'Learning Interventions', icon: BookOpenCheck },
    { path: '/institute/faculty', label: 'Faculty', icon: UserCheck },
    { path: '/institute/mentorship', label: 'Mentorship', icon: Compass },
    { path: '/institute/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/institute/alignment', label: 'Industry Alignment', icon: Compass },
    { path: '/institute/profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="institute-portal-layout">
      {/* SIDEBAR */}
      <aside className="institute-sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo">
            <GraduationCap size={22} />
          </div>
          <div className="sidebar-title-group">
            <span className="sidebar-app-name">SmartHire</span>
            <span className="sidebar-portal-tag">Institute Portal</span>
          </div>
        </div>

        <div className="sidebar-section-title">ACADEMIC NAVIGATION</div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'active' : ''}`
                }
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-user-card">
            <div className="user-avatar">
              {(user?.name || user?.email || 'I').charAt(0).toUpperCase()}
            </div>
            <div className="user-info">
              <div className="user-name">{user?.name || 'Institute Admin'}</div>
              <div className="user-role">Academic Leadership</div>
            </div>
          </div>

          <div className="sidebar-divider" />

          <button className="sidebar-link logout-button" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="institute-main">
        <header className="institute-topbar">
          <div className="topbar-left">
            <h1 className="topbar-portal-title">Skill Intelligence & Curriculum Insights</h1>
          </div>
          <div className="topbar-right">
            <div className="topbar-user-badge">
              <span className="live-dot" />
              <span>{user?.email || 'Logged in'}</span>
            </div>
          </div>
        </header>

        <div className="institute-content-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default InstituteLayout;
