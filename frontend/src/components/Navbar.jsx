import React, { useState, useEffect, useRef } from 'react';
import { Menu, Bell, Check, ExternalLink, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { notificationApi } from '../api/dashboardApi';
import { Link } from 'react-router-dom';

const Navbar = ({ onToggleSidebar }) => {
  const { user, isAdmin } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const res = await notificationApi.getAll();
      if (res?.data) {
        setNotifications(res.data);
        setUnreadCount(res.data.filter((n) => !n.read).length);
      }
    } catch (err) {
      console.warn('Failed to load notifications:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.warn('Error marking notifications as read:', err);
    }
  };

  const handleMarkOneRead = async (id) => {
    try {
      await notificationApi.markRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.warn('Error marking notification as read:', err);
    }
  };

  return (
    <header className="top-navbar">
      <div className="navbar-left">
        <button
          onClick={onToggleSidebar}
          className="mobile-menu-btn"
          aria-label="Toggle navigation"
        >
          <Menu size={22} />
        </button>

        <div className="navbar-title-section">
          <h1>Nexora Workspace</h1>
          <p>Welcome back, {user?.fullName || 'User'}</p>
        </div>
      </div>

      <div className="navbar-right">
        <span className={`role-pill ${isAdmin ? 'role-admin' : 'role-user'}`}>
          {isAdmin ? 'Admin' : 'Normal User'}
        </span>

        {/* Notifications Popover */}
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="nav-icon-btn"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && <span className="icon-badge">{unreadCount}</span>}
          </button>

          {showNotifications && (
            <div
              style={{
                position: 'absolute',
                top: '50px',
                right: '0',
                width: '340px',
                background: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--border-color)',
                zIndex: 150,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#FAF9FE',
                }}
              >
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                  Notifications ({unreadCount})
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--primary)',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    No notifications yet.
                  </div>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => !item.read && handleMarkOneRead(item.id)}
                      style={{
                        padding: '12px 16px',
                        borderBottom: '1px solid var(--border-color)',
                        background: item.read ? '#FFFFFF' : '#F6F3FD',
                        cursor: item.read ? 'default' : 'pointer',
                        transition: 'var(--transition)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-main)' }}>
                          {item.title}
                        </span>
                        {!item.read && (
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }} />
                        )}
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                        {item.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Link */}
        <Link
          to={isAdmin ? '/settings' : '/profile'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
          }}
        >
          <div className="avatar-initials">
            {user?.fullName ? user.fullName.substring(0, 2).toUpperCase() : <UserIcon size={16} />}
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
