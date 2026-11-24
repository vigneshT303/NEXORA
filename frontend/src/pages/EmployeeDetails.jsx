import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Building2,
  Briefcase,
  DollarSign,
  Edit2,
  Trash2,
  Clock,
  CalendarDays,
  ShieldCheck
} from 'lucide-react';
import { employeeApi } from '../api/employeeApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Modal from '../components/Modal';

const EmployeeDetails = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { isAdmin } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await employeeApi.getById(id);
        if (res?.data) {
          setEmployee(res.data);
        }
      } catch (err) {
        error(err.message || 'Failed to fetch employee details');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await employeeApi.delete(id);
      success('Employee deleted successfully');
      navigate('/employees');
    } catch (err) {
      error(err.message || 'Failed to delete employee');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
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
        <p style={{ color: 'var(--text-muted)' }}>Loading employee profile...</p>
      </div>
    );
  }

  if (!employee) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0' }}>
        <h3>Employee Not Found</h3>
        <Link to="/employees" className="btn btn-primary" style={{ marginTop: '16px' }}>
          Back to Directory
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Top Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <Link to="/employees" className="btn btn-secondary" style={{ padding: '8px 14px' }}>
          <ArrowLeft size={16} /> Back to Directory
        </Link>

        {isAdmin && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to={`/employees/edit/${employee.id}`} className="btn btn-primary">
              <Edit2 size={16} /> Edit Profile
            </Link>
            <button onClick={() => setShowDeleteModal(true)} className="btn btn-danger">
              <Trash2 size={16} /> Delete
            </button>
          </div>
        )}
      </div>

      {/* Hero Profile Banner */}
      <div className="card" style={{ padding: '32px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
          <img
            src={employee.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.fullName)}&background=6C3BCE&color=fff`}
            alt={employee.fullName}
            style={{
              width: '96px',
              height: '96px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '4px solid var(--primary-light)',
              boxShadow: 'var(--shadow-md)'
            }}
          />

          <div style={{ flex: 1, minWidth: '240px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                {employee.fullName}
              </h2>
              <span className={`badge ${employee.status === 'ACTIVE' ? 'badge-success' : 'badge-warning'}`}>
                {employee.status}
              </span>
            </div>

            <div style={{ fontSize: '1.05rem', color: 'var(--secondary)', fontWeight: 600, marginTop: '4px' }}>
              {employee.designation} • {employee.department}
            </div>

            <div style={{ display: 'flex', gap: '16px', marginTop: '12px', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={16} style={{ color: 'var(--primary)' }} />
                ID: <strong>{employee.employeeId}</strong>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={16} style={{ color: 'var(--primary)' }} />
                Joined: {employee.joiningDate || 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Information Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Personal Details */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Personal & Contact Details</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Mail size={18} style={{ color: 'var(--primary)' }} />
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Email Address</div>
                <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{employee.email}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Phone size={18} style={{ color: 'var(--primary)' }} />
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Phone Number</div>
                <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{employee.phone || 'Not provided'}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Calendar size={18} style={{ color: 'var(--primary)' }} />
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Date of Birth</div>
                <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{employee.dob || 'Not provided'}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <MapPin size={18} style={{ color: 'var(--primary)' }} />
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Residential Address</div>
                <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{employee.address || 'Not provided'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Employment & Compensation */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Employment & Compensation</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Building2 size={18} style={{ color: 'var(--secondary)' }} />
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Department</div>
                <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{employee.department}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Briefcase size={18} style={{ color: 'var(--secondary)' }} />
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Job Title</div>
                <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{employee.designation}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <DollarSign size={18} style={{ color: 'var(--secondary)' }} />
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Annual Compensation</div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--primary)' }}>
                  ${employee.salary ? employee.salary.toLocaleString() : 'N/A'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Clock size={18} style={{ color: 'var(--secondary)' }} />
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Status</div>
                <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{employee.status}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Employee Record Deletion"
        footer={
          <>
            <button onClick={() => setShowDeleteModal(false)} className="btn btn-secondary" disabled={deleting}>
              Cancel
            </button>
            <button onClick={handleDelete} className="btn btn-danger" disabled={deleting}>
              {deleting ? 'Deleting...' : 'Delete Permanently'}
            </button>
          </>
        }
      >
        <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
          Are you sure you want to delete <strong>{employee.fullName}</strong> ({employee.employeeId})? This action will permanently remove their records from the MongoDB database.
        </p>
      </Modal>
    </div>
  );
};

export default EmployeeDetails;
