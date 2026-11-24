import React, { useState, useEffect } from 'react';
import { CalendarDays, Plus, Check, X, Clock, AlertCircle } from 'lucide-react';
import { leaveApi } from '../api/leaveApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Modal from '../components/Modal';

const LeavePage = () => {
  const { user, isAdmin } = useAuth();
  const { success, error } = useToast();

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  // Apply modal
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    leaveType: 'Annual',
    startDate: '',
    endDate: '',
    reason: '',
  });
  const [applyLoading, setApplyLoading] = useState(false);

  // Review modal (Approve / Reject)
  const [reviewTarget, setReviewTarget] = useState(null);
  const [reviewAction, setReviewAction] = useState('approve'); // approve or reject
  const [remarks, setRemarks] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const res = isAdmin ? await leaveApi.getAll() : await leaveApi.getMyLeaves();
      if (res?.data) {
        setLeaves(res.data);
      }
    } catch (err) {
      error(err.message || 'Failed to fetch leaves');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [isAdmin]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!formData.startDate || !formData.endDate) {
      error('Please select both start and end dates');
      return;
    }
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      error('End date cannot be earlier than start date');
      return;
    }

    setApplyLoading(true);
    try {
      await leaveApi.apply(formData);
      success('Leave application submitted successfully');
      setIsApplyModalOpen(false);
      setFormData({ leaveType: 'Annual', startDate: '', endDate: '', reason: '' });
      fetchLeaves();
    } catch (err) {
      error(err.message || 'Failed to submit application');
    } finally {
      setApplyLoading(false);
    }
  };

  const handleReviewConfirm = async () => {
    if (!reviewTarget) return;
    setReviewLoading(true);
    try {
      if (reviewAction === 'approve') {
        await leaveApi.approve(reviewTarget.id, remarks || 'Approved by administrator');
        success(`Leave for ${reviewTarget.employeeName} approved`);
      } else {
        await leaveApi.reject(reviewTarget.id, remarks || 'Rejected by administrator');
        success(`Leave for ${reviewTarget.employeeName} rejected`);
      }
      setReviewTarget(null);
      setRemarks('');
      fetchLeaves();
    } catch (err) {
      error(err.message || 'Operation failed');
    } finally {
      setReviewLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
            Leave Management
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {isAdmin ? 'Review employee leave requests, approve or reject applications.' : 'Apply for time off and monitor approval status.'}
          </p>
        </div>

        <button onClick={() => setIsApplyModalOpen(true)} className="btn btn-primary">
          <Plus size={18} /> Apply For Leave
        </button>
      </div>

      {/* Leaves Table */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Leave Type</th>
                <th>Duration & Dates</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Remarks</th>
                {isAdmin && <th style={{ textAlign: 'right' }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={isAdmin ? 7 : 6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    Loading leave requests...
                  </td>
                </tr>
              ) : leaves.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 7 : 6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No leave requests found.
                  </td>
                </tr>
              ) : (
                leaves.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{item.employeeName}</div>
                        <span className="badge badge-purple" style={{ fontSize: '0.72rem' }}>{item.employeeId}</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600 }}>{item.leaveType}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{item.totalDays} day(s)</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {item.startDate} to {item.endDate}
                      </div>
                    </td>
                    <td style={{ maxWidth: '240px', fontSize: '0.85rem' }}>
                      {item.reason}
                    </td>
                    <td>
                      <span className={`badge ${
                        item.status === 'APPROVED' ? 'badge-success' :
                        item.status === 'REJECTED' ? 'badge-danger' : 'badge-warning'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {item.adminRemarks || '-'}
                    </td>
                    {isAdmin && (
                      <td>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          {item.status === 'PENDING' ? (
                            <>
                              <button
                                onClick={() => {
                                  setReviewTarget(item);
                                  setReviewAction('approve');
                                  setRemarks('Approved by manager');
                                }}
                                className="btn btn-secondary btn-icon"
                                style={{ color: 'var(--success)' }}
                                title="Approve"
                              >
                                <Check size={16} />
                              </button>
                              <button
                                onClick={() => {
                                  setReviewTarget(item);
                                  setReviewAction('reject');
                                  setRemarks('Capacity constraints during requested dates');
                                }}
                                className="btn btn-secondary btn-icon"
                                style={{ color: 'var(--danger)' }}
                                title="Reject"
                              >
                                <X size={16} />
                              </button>
                            </>
                          ) : (
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Processed</span>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply Leave Modal */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title="Apply For Leave"
      >
        <form onSubmit={handleApply}>
          <div className="form-group">
            <label className="form-label">Leave Category</label>
            <select
              className="form-control"
              value={formData.leaveType}
              onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
            >
              <option value="Annual">Annual / Vacation Leave</option>
              <option value="Casual">Casual Leave</option>
              <option value="Sick">Sick / Medical Leave</option>
              <option value="Maternity">Maternity / Paternity Leave</option>
              <option value="Emergency">Emergency Leave</option>
            </select>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Start Date *</label>
              <input
                type="date"
                className="form-control"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">End Date *</label>
              <input
                type="date"
                className="form-control"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Reason for Request *</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="State the reason for your time-off request..."
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
            <button type="button" onClick={() => setIsApplyModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={applyLoading}>
              {applyLoading ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Admin Approve / Reject Modal */}
      <Modal
        isOpen={Boolean(reviewTarget)}
        onClose={() => setReviewTarget(null)}
        title={reviewAction === 'approve' ? 'Approve Leave Application' : 'Reject Leave Application'}
        footer={
          <>
            <button onClick={() => setReviewTarget(null)} className="btn btn-secondary" disabled={reviewLoading}>
              Cancel
            </button>
            <button
              onClick={handleReviewConfirm}
              className={`btn ${reviewAction === 'approve' ? 'btn-success' : 'btn-danger'}`}
              disabled={reviewLoading}
            >
              {reviewLoading ? 'Processing...' : reviewAction === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
            </button>
          </>
        }
      >
        <div>
          <p style={{ margin: '0 0 16px', fontSize: '0.95rem', color: 'var(--text-main)' }}>
            Confirm decision for <strong>{reviewTarget?.employeeName}</strong> ({reviewTarget?.totalDays} days of {reviewTarget?.leaveType} leave).
          </p>

          <div className="form-group">
            <label className="form-label">Administrative Remarks (Sent to Employee)</label>
            <input
              type="text"
              className="form-control"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Approved, please hand over pending tasks."
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default LeavePage;
