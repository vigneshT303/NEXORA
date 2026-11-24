import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowLeft, ArrowRight } from 'lucide-react';
import { authApi } from '../api/authApi';
import { useToast } from '../context/ToastContext';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { success, error } = useToast();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!email.trim()) errs.email = 'Email address is required';
    if (!newPassword) errs.newPassword = 'New password is required';
    else if (newPassword.length < 6) errs.newPassword = 'Password must be at least 6 characters';
    if (newPassword !== confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await authApi.forgotPassword({ email, newPassword, confirmPassword });
      success('Password reset successfully! Please sign in with your new password.');
      navigate('/login');
    } catch (err) {
      error(err.message || 'Failed to reset password. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <ShieldCheck size={28} />
          </div>
          <h2 className="auth-title">Reset Password</h2>
          <p className="auth-subtitle">Enter your Nexora registered email and choose a new password</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Account Email</label>
            <div className="input-icon-wrapper">
              <Mail className="input-icon-left" size={18} />
              <input
                type="email"
                className="form-control input-with-icon-left"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">New Password</label>
            <div className="input-icon-wrapper">
              <Lock className="input-icon-left" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control input-with-icon-left input-with-icon-right"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                className="input-icon-right"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.newPassword && <div className="form-error">{errors.newPassword}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Confirm New Password</label>
            <div className="input-icon-wrapper">
              <Lock className="input-icon-left" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control input-with-icon-left"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            {errors.confirmPassword && <div className="form-error">{errors.confirmPassword}</div>}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', marginTop: '8px' }}
            disabled={loading}
          >
            {loading ? 'Updating Password...' : 'Reset & Save Password'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Link
            to="/login"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--text-muted)',
              fontSize: '0.88rem',
              fontWeight: 600,
            }}
          >
            <ArrowLeft size={16} /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
