import React, { useState } from 'react';
import {
  Bell,
  Sliders,
  Volume2,
  RefreshCw,
  Mail,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  Activity,
  Zap,
  Globe,
  Database
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const SettingsPage = () => {
  const { user, isAdmin } = useAuth();
  const { success } = useToast();

  // Notification state
  const [leaveAlerts, setLeaveAlerts] = useState(true);
  const [systemAnnouncements, setSystemAnnouncements] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  // Display & system preferences
  const [compactDensity, setCompactDensity] = useState(false);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState('30');
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  // Sync state
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncData = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      success('Workspace cache and session synchronised successfully!');
    }, 800);
  };

  const handleSavePreferences = () => {
    success('Settings and preferences saved successfully!');
  };

  return (
    <div className="page-animated" style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '28px'
      }}>
        <div>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
            System & Account Settings
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Configure notification preferences, interactive behaviors, and system display options.
          </p>
        </div>

        <button
          onClick={handleSyncData}
          className="btn btn-secondary"
          disabled={isSyncing}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <RefreshCw size={16} className={isSyncing ? 'spin-icon' : ''} />
          {isSyncing ? 'Syncing...' : 'Sync Session'}
        </button>
      </div>

      {/* Section 1: Notification & Alert Preferences */}
      <div className="card interactive-card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <div>
            <div className="card-title">
              <Bell size={20} style={{ color: 'var(--primary)' }} />
              <span>Notification & Alert Preferences</span>
            </div>
            <div className="card-subtitle">Control in-app alerts, push triggers, and reminders</div>
          </div>
          <span className="badge badge-purple">Real-time Alerts</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Toggle 1: Leave Updates */}
          <div className="settings-toggle-row">
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <div className="settings-icon-badge">
                <Bell size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                  Leave Request Status Updates
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Instant alerts when an administrator approves, rejects, or remarks on a leave request.
                </div>
              </div>
            </div>
            <label className="switch-toggle">
              <input
                type="checkbox"
                checked={leaveAlerts}
                onChange={(e) => setLeaveAlerts(e.target.checked)}
              />
              <span className="switch-slider"></span>
            </label>
          </div>

          <div className="divider-line" />

          {/* Toggle 2: System Announcements */}
          <div className="settings-toggle-row">
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <div className="settings-icon-badge">
                <Mail size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                  System Announcements & Broadcasts
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Broadcast messages for organization holidays, payroll updates, and system maintenance.
                </div>
              </div>
            </div>
            <label className="switch-toggle">
              <input
                type="checkbox"
                checked={systemAnnouncements}
                onChange={(e) => setSystemAnnouncements(e.target.checked)}
              />
              <span className="switch-slider"></span>
            </label>
          </div>

          <div className="divider-line" />

          {/* Toggle 3: Sound Feedback */}
          <div className="settings-toggle-row">
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <div className="settings-icon-badge">
                <Volume2 size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                  Punch In & Clock Audio Chime
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Play a soft confirmation chime when checking in or clocking out attendance.
                </div>
              </div>
            </div>
            <label className="switch-toggle">
              <input
                type="checkbox"
                checked={soundEffects}
                onChange={(e) => setSoundEffects(e.target.checked)}
              />
              <span className="switch-slider"></span>
            </label>
          </div>

          <div className="divider-line" />

          {/* Toggle 4: Weekly Digest */}
          <div className="settings-toggle-row">
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <div className="settings-icon-badge">
                <Smartphone size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                  Weekly Performance & Attendance Summary
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Receive a weekly compiled digest of hours worked, leave balances, and team updates.
                </div>
              </div>
            </div>
            <label className="switch-toggle">
              <input
                type="checkbox"
                checked={weeklyDigest}
                onChange={(e) => setWeeklyDigest(e.target.checked)}
              />
              <span className="switch-slider"></span>
            </label>
          </div>
        </div>
      </div>

      {/* Section 2: Display & Workspace Customization */}
      <div className="card interactive-card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <div>
            <div className="card-title">
              <Sliders size={20} style={{ color: 'var(--secondary)' }} />
              <span>Workspace & Display Preferences</span>
            </div>
            <div className="card-subtitle">Fine-tune density, animation motion, and live polling rates</div>
          </div>
          <span className="badge badge-info">UI Customization</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Setting 1: Compact View */}
          <div className="settings-toggle-row">
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                Compact Table Row Density
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Condense table padding to display more employee and attendance records per screen.
              </div>
            </div>
            <label className="switch-toggle">
              <input
                type="checkbox"
                checked={compactDensity}
                onChange={(e) => setCompactDensity(e.target.checked)}
              />
              <span className="switch-slider"></span>
            </label>
          </div>

          <div className="divider-line" />

          {/* Setting 2: Smooth Motion & Transitions */}
          <div className="settings-toggle-row">
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                Hardware Accelerated Animations & Smooth Transitions
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Enable card hover lifts, animated modals, and interactive micro-interactions.
              </div>
            </div>
            <label className="switch-toggle">
              <input
                type="checkbox"
                checked={animationsEnabled}
                onChange={(e) => setAnimationsEnabled(e.target.checked)}
              />
              <span className="switch-slider"></span>
            </label>
          </div>

          <div className="divider-line" />

          {/* Setting 3: Live Polling Interval */}
          <div className="settings-toggle-row">
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                Dashboard Live Polling Interval
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Frequency of background synchronization for attendance and pending leaves.
              </div>
            </div>
            <select
              className="form-control"
              style={{ width: '180px' }}
              value={autoRefreshInterval}
              onChange={(e) => setAutoRefreshInterval(e.target.value)}
            >
              <option value="15">Every 15 Seconds</option>
              <option value="30">Every 30 Seconds</option>
              <option value="60">Every 1 Minute</option>
              <option value="300">Every 5 Minutes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Section 3: Active Session & Environment Information */}
      <div className="card interactive-card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <div>
            <div className="card-title">
              <Activity size={20} style={{ color: 'var(--success)' }} />
              <span>Active Session & Infrastructure</span>
            </div>
            <div className="card-subtitle">Real-time system diagnostics and connectivity info</div>
          </div>
          <span className="badge badge-success">
            <CheckCircle2 size={13} /> Active & Secured
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          <div className="info-stat-box">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 600 }}>
              <ShieldCheck size={16} style={{ color: 'var(--primary)' }} />
              AUTHENTICATED USER
            </div>
            <div style={{ fontWeight: 700, fontSize: '1rem', marginTop: '6px', color: 'var(--text-main)' }}>
              {user?.fullName || 'Active User'}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--primary)', marginTop: '2px', fontWeight: 600 }}>
              {user?.email}
            </div>
          </div>

          <div className="info-stat-box">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 600 }}>
              <Zap size={16} style={{ color: 'var(--secondary)' }} />
              ROLE PERMISSIONS
            </div>
            <div style={{ fontWeight: 700, fontSize: '1rem', marginTop: '6px', color: 'var(--text-main)' }}>
              {isAdmin ? 'System Administrator' : 'Normal User (Employee)'}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--success)', marginTop: '2px', fontWeight: 600 }}>
              {isAdmin ? 'Full Access Granted' : 'Standard Self-Service'}
            </div>
          </div>

          <div className="info-stat-box">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 600 }}>
              <Database size={16} style={{ color: 'var(--info)' }} />
              DATABASE ENGINE
            </div>
            <div style={{ fontWeight: 700, fontSize: '1rem', marginTop: '6px', color: 'var(--text-main)' }}>
              MongoDB
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Port 27017 (employee_db)
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
        <button
          onClick={handleSavePreferences}
          className="btn btn-primary"
          style={{ padding: '12px 28px', fontSize: '0.95rem' }}
        >
          <CheckCircle2 size={18} /> Save Settings & Preferences
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
