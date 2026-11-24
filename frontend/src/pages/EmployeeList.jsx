import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Download,
  AlertTriangle,
  ArrowUpDown,
  Mail,
  Phone,
  Building2
} from 'lucide-react';
import { employeeApi } from '../api/employeeApi';
import { departmentApi } from '../api/departmentApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Modal from '../components/Modal';
import Pagination from '../components/Pagination';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [sortBy, setSortBy] = useState('name-asc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { isAdmin } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const [empRes, deptRes] = await Promise.all([
        employeeApi.getAll({}),
        departmentApi.getAll(),
      ]);
      if (empRes?.data) setEmployees(empRes.data);
      if (deptRes?.data) setDepartments(deptRes.data);
    } catch (err) {
      error(err.message || 'Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Filter & Search logic
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchSearch =
        !search.trim() ||
        emp.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        emp.email?.toLowerCase().includes(search.toLowerCase()) ||
        emp.employeeId?.toLowerCase().includes(search.toLowerCase()) ||
        emp.designation?.toLowerCase().includes(search.toLowerCase());

      const matchDept = selectedDept === 'ALL' || emp.department === selectedDept;
      const matchStatus = selectedStatus === 'ALL' || emp.status === selectedStatus;

      return matchSearch && matchDept && matchStatus;
    }).sort((a, b) => {
      if (sortBy === 'name-asc') return (a.fullName || '').localeCompare(b.fullName || '');
      if (sortBy === 'name-desc') return (b.fullName || '').localeCompare(a.fullName || '');
      if (sortBy === 'id-asc') return (a.employeeId || '').localeCompare(b.employeeId || '');
      if (sortBy === 'salary-desc') return (b.salary || 0) - (a.salary || 0);
      return 0;
    });
  }, [employees, search, selectedDept, selectedStatus, sortBy]);

  // Paginated slice
  const paginatedEmployees = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredEmployees.slice(start, start + itemsPerPage);
  }, [filteredEmployees, currentPage]);

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await employeeApi.delete(deleteTarget.id);
      success(`Employee ${deleteTarget.fullName} deleted successfully.`);
      setEmployees((prev) => prev.filter((e) => e.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      error(err.message || 'Failed to delete employee');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExportCSV = () => {
    if (filteredEmployees.length === 0) return;
    const headers = ['Employee ID,Full Name,Email,Phone,Department,Designation,Status,Salary,Joining Date\n'];
    const rows = filteredEmployees.map((e) =>
      `"${e.employeeId || ''}","${e.fullName || ''}","${e.email || ''}","${e.phone || ''}","${e.department || ''}","${e.designation || ''}","${e.status || ''}","${e.salary || ''}","${e.joiningDate || ''}"\n`
    );
    const blob = new Blob([headers.concat(rows)], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `employees_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    success('Employee roster exported as CSV');
  };

  return (
    <div>
      {/* Header & Quick Action */}
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
            Employee Directory
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Manage staff members, roles, departments, and records.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleExportCSV} className="btn btn-secondary">
            <Download size={18} /> Export CSV
          </button>
          {isAdmin && (
            <Link to="/employees/add" className="btn btn-primary">
              <UserPlus size={18} /> Add New Employee
            </Link>
          )}
        </div>
      </div>

      {/* Filter and Search Bar Card */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center' }}>
          {/* Search Input */}
          <div style={{ flex: '1 1 240px', minWidth: '220px' }}>
            <div className="input-icon-wrapper">
              <Search className="input-icon-left" size={18} />
              <input
                type="text"
                className="form-control input-with-icon-left"
                placeholder="Search by name, email, ID, or title..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          {/* Department Filter */}
          <div style={{ minWidth: '160px' }}>
            <select
              className="form-control"
              value={selectedDept}
              onChange={(e) => {
                setSelectedDept(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="ALL">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div style={{ minWidth: '140px' }}>
            <select
              className="form-control"
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="ON_LEAVE">On Leave</option>
            </select>
          </div>

          {/* Sort By */}
          <div style={{ minWidth: '150px' }}>
            <select
              className="form-control"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name-asc">Sort: Name (A-Z)</option>
              <option value="name-desc">Sort: Name (Z-A)</option>
              <option value="id-asc">Sort: Employee ID</option>
              <option value="salary-desc">Sort: Highest Salary</option>
            </select>
          </div>
        </div>
      </div>

      {/* Employees Table */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Contact</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Salary</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    Loading employees...
                  </td>
                </tr>
              ) : paginatedEmployees.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No employees found matching the filters.
                  </td>
                </tr>
              ) : (
                paginatedEmployees.map((emp) => (
                  <tr key={emp.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={emp.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.fullName)}&background=6C3BCE&color=fff`}
                          alt={emp.fullName}
                          style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-main)' }}>
                            {emp.fullName}
                          </div>
                          <span className="badge badge-purple" style={{ fontSize: '0.72rem', padding: '2px 6px' }}>
                            {emp.employeeId}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem' }}>{emp.email}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{emp.phone || '-'}</div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{emp.department}</span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.85rem' }}>{emp.designation}</span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>
                        ${emp.salary ? emp.salary.toLocaleString() : 'N/A'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${
                        emp.status === 'ACTIVE' ? 'badge-success' :
                        emp.status === 'ON_LEAVE' ? 'badge-warning' : 'badge-danger'
                      }`}>
                        {emp.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <Link
                          to={`/employees/${emp.id}`}
                          className="btn btn-secondary btn-icon"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </Link>
                        {isAdmin && (
                          <>
                            <Link
                              to={`/employees/edit/${emp.id}`}
                              className="btn btn-secondary btn-icon"
                              title="Edit Employee"
                            >
                              <Edit2 size={16} />
                            </Link>
                            <button
                              onClick={() => setDeleteTarget(emp)}
                              className="btn btn-secondary btn-icon"
                              style={{ color: 'var(--danger)' }}
                              title="Delete Employee"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredEmployees.length}
          itemsPerPage={itemsPerPage}
        />
      </div>

      {/* Confirmation Modal for Delete */}
      <Modal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Confirm Employee Deletion"
        footer={
          <>
            <button
              onClick={() => setDeleteTarget(null)}
              className="btn btn-secondary"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="btn btn-danger"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Permanently'}
            </button>
          </>
        }
      >
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'var(--danger-bg)',
            color: 'var(--danger)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <p style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-main)', margin: '0 0 6px' }}>
              Are you sure you want to delete {deleteTarget?.fullName}?
            </p>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
              This will permanently delete employee record <strong>{deleteTarget?.employeeId}</strong> from the database. This action cannot be undone.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EmployeeList;
