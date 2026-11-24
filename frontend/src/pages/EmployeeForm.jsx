import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Building2,
  Briefcase,
  DollarSign,
  ArrowLeft,
  Save,
  Image as ImageIcon
} from 'lucide-react';
import { employeeApi } from '../api/employeeApi';
import { departmentApi } from '../api/departmentApi';
import { useToast } from '../context/ToastContext';

const EmployeeForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [formData, setFormData] = useState({
    employeeId: '',
    fullName: '',
    email: '',
    phone: '',
    gender: 'Male',
    dob: '',
    address: '',
    department: '',
    designation: '',
    joiningDate: new Date().toISOString().split('T')[0],
    salary: '',
    status: 'ACTIVE',
    profilePhoto: '',
  });

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const initData = async () => {
      try {
        const deptRes = await departmentApi.getAll();
        if (deptRes?.data) {
          setDepartments(deptRes.data);
          if (!isEditMode && deptRes.data.length > 0) {
            setFormData((prev) => ({ ...prev, department: deptRes.data[0].name }));
          }
        }

        if (isEditMode) {
          const empRes = await employeeApi.getById(id);
          if (empRes?.data) {
            const e = empRes.data;
            setFormData({
              employeeId: e.employeeId || '',
              fullName: e.fullName || '',
              email: e.email || '',
              phone: e.phone || '',
              gender: e.gender || 'Male',
              dob: e.dob || '',
              address: e.address || '',
              department: e.department || '',
              designation: e.designation || '',
              joiningDate: e.joiningDate || '',
              salary: e.salary || '',
              status: e.status || 'ACTIVE',
              profilePhoto: e.profilePhoto || '',
            });
          }
        }
      } catch (err) {
        error(err.message || 'Failed to load data');
      } finally {
        setFetching(false);
      }
    };

    initData();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full Name is required';
    if (!formData.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Valid email is required';
    if (!formData.department) errs.department = 'Department is required';
    if (!formData.designation.trim()) errs.designation = 'Designation is required';
    if (!formData.salary) errs.salary = 'Salary is required';
    else if (isNaN(formData.salary) || Number(formData.salary) <= 0) errs.salary = 'Please enter a valid salary amount';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        ...formData,
        salary: Number(formData.salary),
      };

      if (isEditMode) {
        await employeeApi.update(id, payload);
        success('Employee updated successfully');
      } else {
        await employeeApi.create(payload);
        success('New employee created successfully');
      }
      navigate('/employees');
    } catch (err) {
      error(err.message || 'Failed to save employee');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0' }}>
        <div style={{
          width: '36px',
          height: '36px',
          border: '3px solid var(--primary-light)',
          borderTopColor: 'var(--primary)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 12px'
        }} />
        <p style={{ color: 'var(--text-muted)' }}>Loading employee record...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link to="/employees" className="btn btn-secondary btn-icon" aria-label="Back">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
              {isEditMode ? 'Edit Employee Profile' : 'Add New Employee'}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              {isEditMode ? 'Update employment records and permissions' : 'Create an employee record in the organization database'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Form Card */}
      <div className="card">
        <form onSubmit={handleSubmit}>
          {/* Section 1: Basic Information */}
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={18} /> 1. Personal & Contact Information
          </h3>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <div className="input-icon-wrapper">
                <User className="input-icon-left" size={18} />
                <input
                  type="text"
                  name="fullName"
                  className="form-control input-with-icon-left"
                  placeholder="e.g. Rachel Green"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>
              {errors.fullName && <div className="form-error">{errors.fullName}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <div className="input-icon-wrapper">
                <Mail className="input-icon-left" size={18} />
                <input
                  type="email"
                  name="email"
                  className="form-control input-with-icon-left"
                  placeholder="rachel.green@company.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              {errors.email && <div className="form-error">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <div className="input-icon-wrapper">
                <Phone className="input-icon-left" size={18} />
                <input
                  type="tel"
                  name="phone"
                  className="form-control input-with-icon-left"
                  placeholder="+1 (555) 234-5678"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Gender</label>
              <select
                name="gender"
                className="form-control"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Date of Birth</label>
              <div className="input-icon-wrapper">
                <Calendar className="input-icon-left" size={18} />
                <input
                  type="date"
                  name="dob"
                  className="form-control input-with-icon-left"
                  value={formData.dob}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Residential Address</label>
              <div className="input-icon-wrapper">
                <MapPin className="input-icon-left" size={18} />
                <input
                  type="text"
                  name="address"
                  className="form-control input-with-icon-left"
                  placeholder="City, State, Country"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div style={{ height: '1px', background: 'var(--border-color)', margin: '24px 0' }} />

          {/* Section 2: Job & Position Details */}
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Briefcase size={18} /> 2. Job & Position Details
          </h3>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Employee ID (Optional)</label>
              <input
                type="text"
                name="employeeId"
                className="form-control"
                placeholder="Leave blank for auto-generated ID (EMP-XXXX)"
                value={formData.employeeId}
                onChange={handleChange}
                disabled={isEditMode}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {isEditMode ? 'Employee ID cannot be modified' : 'Auto-generated sequentially if empty'}
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">Department *</label>
              <div className="input-icon-wrapper">
                <Building2 className="input-icon-left" size={18} />
                <select
                  name="department"
                  className="form-control input-with-icon-left"
                  value={formData.department}
                  onChange={handleChange}
                >
                  <option value="">Select Department</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>
              {errors.department && <div className="form-error">{errors.department}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Designation / Job Title *</label>
              <div className="input-icon-wrapper">
                <Briefcase className="input-icon-left" size={18} />
                <input
                  type="text"
                  name="designation"
                  className="form-control input-with-icon-left"
                  placeholder="e.g. Senior Backend Engineer"
                  value={formData.designation}
                  onChange={handleChange}
                />
              </div>
              {errors.designation && <div className="form-error">{errors.designation}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Annual Salary ($) *</label>
              <div className="input-icon-wrapper">
                <DollarSign className="input-icon-left" size={18} />
                <input
                  type="number"
                  name="salary"
                  className="form-control input-with-icon-left"
                  placeholder="e.g. 85000"
                  value={formData.salary}
                  onChange={handleChange}
                />
              </div>
              {errors.salary && <div className="form-error">{errors.salary}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Joining Date</label>
              <div className="input-icon-wrapper">
                <Calendar className="input-icon-left" size={18} />
                <input
                  type="date"
                  name="joiningDate"
                  className="form-control input-with-icon-left"
                  value={formData.joiningDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Employment Status</label>
              <select
                name="status"
                className="form-control"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="ON_LEAVE">On Leave</option>
              </select>
            </div>
          </div>

          <div style={{ height: '1px', background: 'var(--border-color)', margin: '24px 0' }} />

          {/* Section 3: Profile Photo */}
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ImageIcon size={18} /> 3. Profile Avatar & Photo
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <img
              src={formData.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.fullName || 'User')}&background=6C3BCE&color=fff`}
              alt="Avatar preview"
              style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--border-color)' }}
            />
            <div style={{ flex: 1, minWidth: '240px' }}>
              <label className="form-label">Profile Image URL</label>
              <input
                type="url"
                name="profilePhoto"
                className="form-control"
                placeholder="https://images.unsplash.com/photo-..."
                value={formData.profilePhoto}
                onChange={handleChange}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Provide an image URL or leave empty for an automatic monogram avatar.
              </span>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
            <button
              type="button"
              onClick={() => navigate('/employees')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              <Save size={18} />
              {loading ? 'Saving Employee...' : isEditMode ? 'Update Employee' : 'Create Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;
