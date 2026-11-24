import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  Clock,
  CalendarDays,
  BarChart3,
  Settings,
  LogOut,
  X,
  UserCheck,
  ShieldCheck,
  User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminNav = [
    { name: 'Admin Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Employees', path: '/employees', icon: Users },
    { name: 'Departments', path: '/departments', icon: Building2 },
    { name: 'Attendance', path: '/attendance', icon: Clock },
    { name: 'Leave Requests', path: '/leaves', icon: CalendarDays },
    { name: 'Reports & Analytics', path: '/reports', icon: BarChart3 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const userNav = [
    { name: 'My Dashboard', path: '/user/dashboard', icon: LayoutDashboard },
    { name: 'My Profile', path: '/profile', icon: User },
    { name: 'Attendance', path: '/attendance', icon: Clock },
    { name: 'My Leaves', path: '/leaves', icon: CalendarDays },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const navItems = isAdmin ? adminNav : userNav;

  return (
    <>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-badge">
              <ShieldCheck size={22} />
            </div>
            <span>NEX<span style={{ color: 'var(--secondary)' }}>ORA</span></span>
          </div>
          <button
            onClick={onClose}
            className="mobile-menu-btn"
            style={{ color: '#FFF' }}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <span className="nav-section-title">
            {isAdmin ? 'ADMINISTRATION' : 'EMPLOYEE PORTAL'}
          </span>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={19} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="user-quick-profile">
            <div className="avatar-initials">
              {user?.fullName ? user.fullName.substring(0, 2).toUpperCase() : 'EM'}
            </div>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', color: '#FFF' }}>
                {user?.fullName || 'User'}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)' }}>
                {isAdmin ? 'System Admin' : 'Employee'}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="btn btn-secondary"
            style={{
              width: '100%',
              background: 'rgba(239, 68, 68, 0.12)',
              borderColor: 'rgba(239, 68, 68, 0.3)',
              color: '#F87171',
              padding: '8px 12px',
              fontSize: '0.85rem'
            }}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 95,
          }}
        />
      )}
    </>
  );
};

export default Sidebar;
