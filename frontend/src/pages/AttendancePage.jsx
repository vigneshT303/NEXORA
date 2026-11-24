import React, { useState, useEffect } from 'react';
import { Clock, Calendar, CheckCircle2, AlertCircle, Download, Check, X, Filter } from 'lucide-react';
import { attendanceApi } from '../api/attendanceApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const AttendancePage = () => {
  const { user, isAdmin } = useAuth();
  const { success, error } = useToast();

  const [attendanceList, setAttendanceList] = useState([]);
  const [todayRecord, setTodayRecord] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      if (isAdmin) {
        const res = await attendanceApi.getAll(selectedDate);
        if (res?.data) setAttendanceList(res.data);
      } else {
        const res = await attendanceApi.getMyHistory();
        if (res?.data) setAttendanceList(res.data);
      }

      // Check today's record for current user
      const todayRes = await attendanceApi.getToday();
      if (todayRes?.data) setTodayRecord(todayRes.data);
    } catch (err) {
      console.warn('Attendance load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [selectedDate, isAdmin]);

  const handleCheckIn = async () => {
    setActionLoading(true);
    try {
      const res = await attendanceApi.checkIn(notes);
      success('Punch In recorded successfully!');
      setTodayRecord(res.data);
      setNotes('');
      fetchAttendance();
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
      success('Punch Out recorded successfully!');
      setTodayRecord(res.data);
      setNotes('');
      fetchAttendance();
    } catch (err) {
      error(err.message || 'Check-out failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (attendanceList.length === 0) return;
    const headers = ['Date,Employee ID,Employee Name,Check-In,Check-Out,Status,Notes\n'];
    const rows = attendanceList.map((a) =>
      `"${a.date}","${a.employeeId}","${a.employeeName}","${a.checkInTime || '-'}","${a.checkOutTime || '-'}","${a.status}","${a.notes || ''}"\n`
    );
    const blob = new Blob([headers.concat(rows)], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `attendance_${selectedDate}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    success('Attendance record exported to CSV');
  };

  return (
    <div>
      {/* Page Header */}
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
            Attendance Tracker
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {isAdmin ? 'Monitor daily employee clock-ins, working hours, and presence.' : 'Punch in/out and view your verified attendance log.'}
          </p>
        </div>

        <button onClick={handleExportCSV} className="btn btn-secondary">
          <Download size={18} /> Export Log
        </button>
      </div>

      {/* Quick Punch Bar for Employees */}
      <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              TODAY'S STATUS ({new Date().toISOString().split('T')[0]})
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
              {todayRecord ? (
                todayRecord.checkOutTime ? (
                  <span style={{ color: 'var(--success)' }}>Completed Day ({todayRecord.checkInTime} to {todayRecord.checkOutTime})</span>
                ) : (
                  <span style={{ color: 'var(--primary)' }}>Checked In at {todayRecord.checkInTime}</span>
                )
              ) : (
                <span style={{ color: 'var(--text-muted)' }}>Not yet checked in today</span>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Add optional daily notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{ width: '240px' }}
            />
            <button
              onClick={handleCheckIn}
              disabled={actionLoading || Boolean(todayRecord)}
              className="btn btn-success"
            >
              <CheckCircle2 size={18} /> Punch In
            </button>
            <button
              onClick={handleCheckOut}
              disabled={actionLoading || !todayRecord || Boolean(todayRecord?.checkOutTime)}
              className="btn btn-danger"
            >
              <Clock size={18} /> Punch Out
            </button>
          </div>
        </div>
      </div>

      {/* Admin Date Selector */}
      {isAdmin && (
        <div className="card" style={{ padding: '16px 20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Calendar size={18} style={{ color: 'var(--primary)' }} />
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Select Record Date:</span>
          </div>
          <input
            type="date"
            className="form-control"
            style={{ width: '200px' }}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      )}

      {/* Attendance Records Table */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Employee</th>
                <th>Check-In</th>
                <th>Check-Out</th>
                <th>Status</th>
                <th>Work Notes</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    Loading attendance records...
                  </td>
                </tr>
              ) : attendanceList.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No attendance records found for this date.
                  </td>
                </tr>
              ) : (
                attendanceList.map((att) => (
                  <tr key={att.id}>
                    <td>
                      <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{att.date}</span>
                    </td>
                    <td>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{att.employeeName}</div>
                        <span className="badge badge-purple" style={{ fontSize: '0.72rem' }}>{att.employeeId}</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, color: 'var(--success)' }}>
                        {att.checkInTime || '-'}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, color: att.checkOutTime ? 'var(--primary)' : 'var(--text-muted)' }}>
                        {att.checkOutTime || 'Pending'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${
                        att.status === 'PRESENT' ? 'badge-success' :
                        att.status === 'HALF_DAY' ? 'badge-warning' : 'badge-danger'
                      }`}>
                        {att.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '240px' }}>
                      {att.notes || '-'}
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

export default AttendancePage;
