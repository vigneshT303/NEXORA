import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, Eye, EyeOff, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { register } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full Name is required';
    if (!formData.email.trim()) errs.email = 'Email address is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Please enter a valid email';
    if (!formData.phone.trim()) errs.phone = 'Phone number is required';
    if (!formData.password) errs.password = 'Password is required';
    else if (formData.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const userData = await register(formData);
      success('Account created successfully! Welcome to EMS Pro.');
      // Normal user role is automatically assigned
      navigate('/user/dashboard');
    } catch (err) {
      error(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card" style={{ maxWidth: '520px' }}>
        <div className="auth-header">
          <div className="auth-logo">
            <ShieldCheck size={28} />
          </div>
          <h2 className="auth-title">Join NEXORA</h2>
          <p className="auth-subtitle">Create your workforce account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div className="input-icon-wrapper">
              <User className="input-icon-left" size={18} />
              <input
                type="text"
                name="fullName"
                className="form-control input-with-icon-left"
                placeholder="e.g. Eleanor Vance"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>
            {errors.fullName && <div className="form-error">{errors.fullName}</div>}
          </div>

          <div className="form-grid" style={{ marginBottom: '16px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Work Email</label>
              <div className="input-icon-wrapper">
                <Mail className="input-icon-left" size={18} />
                <input
                  type="email"
                  name="email"
                  className="form-control input-with-icon-left"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              {errors.email && <div className="form-error">{errors.email}</div>}
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Phone Number</label>
              <div className="input-icon-wrapper">
                <Phone className="input-icon-left" size={18} />
                <input
                  type="tel"
                  name="phone"
                  className="form-control input-with-icon-left"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              {errors.phone && <div className="form-error">{errors.phone}</div>}
            </div>
          </div>

          <div className="form-grid" style={{ marginBottom: '24px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Password</label>
              <div className="input-icon-wrapper">
                <Lock className="input-icon-left" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="form-control input-with-icon-left input-with-icon-right"
                  placeholder="Min 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="input-icon-right"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <div className="form-error">{errors.password}</div>}
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Confirm Password</label>
              <div className="input-icon-wrapper">
                <Lock className="input-icon-left" size={18} />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  name="confirmPassword"
                  className="form-control input-with-icon-left input-with-icon-right"
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="input-icon-right"
                  onClick={() => setShowConfirm(!showConfirm)}
                  aria-label="Toggle confirm password"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && <div className="form-error">{errors.confirmPassword}</div>}
            </div>
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
            Note: New accounts receive standard <strong>Normal User</strong> access. Admin privileges can be granted by an administrator.
          </p>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px' }}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Complete Registration'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
