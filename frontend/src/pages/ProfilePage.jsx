import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Lock, Save, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/authApi';
import { useToast } from '../context/ToastContext';

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const { success, error } = useToast();

  const [personalData, setPersonalData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    employeeId: user?.employeeId || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPass, setChangingPass] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      error('Please complete all password fields');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      error('New password must be at least 6 characters');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      error('New passwords do not match');
      return;
    }

    setChangingPass(true);
    try {
      await authApi.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      success('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      error(err.message || 'Failed to change password');
    } finally {
      setChangingPass(false);
    }
  };

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
          My Account & Profile
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Manage your personal credentials, contact details, and password.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="card" style={{ padding: '28px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div className="avatar-initials" style={{ width: '72px', height: '72px', fontSize: '1.6rem' }}>
            {user?.fullName ? user.fullName.substring(0, 2).toUpperCase() : 'EM'}
          </div>

          <div style={{ flex: 1, minWidth: '220px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0 0 4px', color: 'var(--text-main)' }}>
              {user?.fullName}
            </h3>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>{user?.email}</div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
              <span className="badge badge-purple">
                {user?.employeeId ? `Employee ID: ${user.employeeId}` : 'Employee Portal'}
              </span>
              <span className="badge badge-success">
                {user?.role === 'ROLE_ADMIN' ? 'Administrator' : 'Normal User'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Form */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Lock size={18} style={{ color: 'var(--primary)' }} />
            <span>Update Account Password</span>
          </div>
          <div className="card-subtitle">Keep your account secure with a strong password</div>
        </div>

        <form onSubmit={handlePasswordChange}>
          <div className="form-group">
            <label className="form-label">Current Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter current password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              required
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">New Password (Min 6 chars)</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter new password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Re-enter new password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
            <button type="submit" className="btn btn-primary" disabled={changingPass}>
              <Save size={16} />
              {changingPass ? 'Updating...' : 'Save New Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
