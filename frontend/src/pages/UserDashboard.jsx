import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  CalendarCheck,
  CalendarDays,
  User,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { attendanceApi } from '../api/attendanceApi';
import { leaveApi } from '../api/leaveApi';
import { useToast } from '../context/ToastContext';

const UserDashboard = () => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [recentLeaves, setRecentLeaves] = useState([]);
  const [notes, setNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  // Live digital clock timer
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const loadData = async () => {
    try {
      const [attRes, leaveRes] = await Promise.all([
        attendanceApi.getToday(),
        leaveApi.getMyLeaves(),
      ]);
      if (attRes?.data) setTodayAttendance(attRes.data);
      if (leaveRes?.data) setRecentLeaves(leaveRes.data.slice(0, 4));
    } catch (err) {
      console.warn('User dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCheckIn = async () => {
    setActionLoading(true);
    try {
      const res = await attendanceApi.checkIn(notes);
      success('Checked in successfully!');
      setTodayAttendance(res.data);
      setNotes('');
    } catch (err) {
      error(err.message || 'Check-in failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setActionLoading(true);
    try {
      const res = await attendanceApi.checkOut(notes);
      success('Checked out successfully!');
      setTodayAttendance(res.data);
      setNotes('');
    } catch (err) {
      error(err.message || 'Check-out failed');
    } finally {
      setActionLoading(false);
    }
  };

  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  return (
    <div>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #241044 0%, #3F1D73 100%)',
        borderRadius: 'var(--radius-lg)',
        padding: '32px',
        color: '#FFFFFF',
        marginBottom: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        boxShadow: 'var(--shadow-purple)'
      }}>
        <div>
          <span className="badge badge-purple" style={{ background: 'rgba(255,255,255,0.15)', color: '#FFF', marginBottom: '12px' }}>
            NEXORA Self-Service Portal
          </span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '8px 0 4px', letterSpacing: '-0.5px' }}>
            Hello, {user?.fullName || 'Colleague'}!
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.95rem' }}>
            {formattedDate} • Have a productive day at work!
          </p>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.6)' }}>
            Current Local Time
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
            {formattedTime}
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px',
        marginBottom: '28px'
      }}>
        {/* Attendance Punch In/Out Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="card-header">
              <div>
                <div className="card-title">
                  <Clock size={20} style={{ color: 'var(--primary)' }} />
                  <span>Daily Attendance Punch</span>
                </div>
                <div className="card-subtitle">Mark your attendance in real-time</div>
              </div>

              {todayAttendance && (
                <span className={`badge ${todayAttendance.checkOutTime ? 'badge-success' : 'badge-warning'}`}>
                  {todayAttendance.checkOutTime ? 'Completed Day' : 'Currently Checked In'}
                </span>
              )}
            </div>

            <div style={{
              background: 'var(--bg-main)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              marginBottom: '20px',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>CHECK-IN TIME</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
                    {todayAttendance?.checkInTime || '--:--'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>CHECK-OUT TIME</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
                    {todayAttendance?.checkOutTime || '--:--'}
                  </div>
                </div>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Optional work notes or task summary..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleCheckIn}
              disabled={actionLoading || Boolean(todayAttendance)}
              className="btn btn-success"
              style={{ flex: 1, padding: '12px' }}
            >
              <CheckCircle2 size={18} />
              {todayAttendance ? 'Checked In' : 'Punch In'}
            </button>

            <button
              onClick={handleCheckOut}
              disabled={actionLoading || !todayAttendance || Boolean(todayAttendance?.checkOutTime)}
              className="btn btn-danger"
              style={{ flex: 1, padding: '12px' }}
            >
              <Clock size={18} />
              {todayAttendance?.checkOutTime ? 'Checked Out' : 'Punch Out'}
            </button>
          </div>
        </div>

        {/* My Profile Quick Summary */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">
                <User size={20} style={{ color: 'var(--secondary)' }} />
                <span>My Profile Summary</span>
              </div>
              <div className="card-subtitle">Your company credentials and records</div>
            </div>
            <Link to="/profile" className="btn btn-secondary btn-sm">
              Edit Details
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Full Name</span>
              <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{user?.fullName}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Corporate Email</span>
              <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{user?.email}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Employee ID</span>
              <span className="badge badge-purple">{user?.employeeId || 'Assigned via HR'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Assigned Role</span>
              <span className="badge badge-success">Normal User</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Leave Applications */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">
              <CalendarDays size={20} style={{ color: 'var(--primary)' }} />
              <span>My Leave Applications</span>
            </div>
            <div className="card-subtitle">Check status of your recent leave requests</div>
          </div>

          <Link to="/leaves" className="btn btn-primary btn-sm">
            Apply For Leave
          </Link>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Dates</th>
                <th>Total Days</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {recentLeaves.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>
                    No leave requests found. Click "Apply For Leave" to submit one.
                  </td>
                </tr>
              ) : (
                recentLeaves.map((leave) => (
                  <tr key={leave.id}>
                    <td>
                      <span style={{ fontWeight: 600 }}>{leave.leaveType}</span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.85rem' }}>
                        {leave.startDate} to {leave.endDate}
                      </span>
                    </td>
                    <td>{leave.totalDays} days</td>
                    <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {leave.reason}
                    </td>
                    <td>
                      <span className={`badge ${
                        leave.status === 'APPROVED' ? 'badge-success' :
                        leave.status === 'REJECTED' ? 'badge-danger' : 'badge-warning'
                      }`}>
                        {leave.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {leave.adminRemarks || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
