import React, { useContext } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BriefcaseBusiness,
  TrendingUp,
  Users,
  BookmarkCheck,
  FileCheck2,
  BarChart3,
  User,
  LogOut,
  Building2
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import './IndustryLayout.css';

const IndustryLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/industry/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/industry/opportunities', label: 'Opportunities', icon: BriefcaseBusiness },
    { path: '/industry/skill-demand', label: 'Skill Demand', icon: TrendingUp },
    { path: '/industry/candidates', label: 'Candidates', icon: Users },
    { path: '/industry/shortlists', label: 'Shortlists', icon: BookmarkCheck },
    { path: '/industry/applications', label: 'Applications', icon: FileCheck2 },
    { path: '/industry/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/industry/profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="industry-portal-layout">
      {/* SIDEBAR */}
      <aside className="industry-sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo">
            <Building2 size={20} />
          </div>
          <div className="sidebar-title-group">
            <span className="sidebar-app-name">SmartHire</span>
            <span className="sidebar-portal-tag">Industry Hub</span>
          </div>
        </div>

        <div className="sidebar-section-title">PORTAL MENU</div>

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
          <div className="sidebar-company-card">
            <div className="company-avatar">
              {(user?.name || user?.email || 'I').charAt(0).toUpperCase()}
            </div>
            <div className="company-info">
              <div className="company-name">{user?.name || 'Industry Partner'}</div>
              <div className="company-role">Industry Recruiter</div>
            </div>
          </div>

          <div className="sidebar-divider" />

          <button className="sidebar-link logout-button" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="industry-main">
        <header className="industry-topbar">
          <div className="topbar-left">
            <h1 className="topbar-portal-title">Academia–Industry Skill Intelligence</h1>
          </div>
          <div className="topbar-right">
            <div className="topbar-user-badge">
              <span className="live-dot" />
              <span>{user?.email || 'Logged in'}</span>
            </div>
          </div>
        </header>

        <div className="industry-content-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default IndustryLayout;
