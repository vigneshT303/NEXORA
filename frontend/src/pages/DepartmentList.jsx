import React, { useState, useEffect } from 'react';
import { Building2, Plus, Edit2, Trash2, Users, Search, AlertCircle, Eye } from 'lucide-react';
import { departmentApi } from '../api/departmentApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Modal from '../components/Modal';

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Add / Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [formData, setFormData] = useState({ name: '', code: '', description: '', managerName: '' });
  const [modalLoading, setModalLoading] = useState(false);

  // View employees modal state
  const [viewDeptDetails, setViewDeptDetails] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { isAdmin } = useAuth();
  const { success, error } = useToast();

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const res = await departmentApi.getAll();
      if (res?.data) {
        setDepartments(res.data);
      }
    } catch (err) {
      error(err.message || 'Failed to fetch departments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleOpenAdd = () => {
    setEditingDept(null);
    setFormData({ name: '', code: '', description: '', managerName: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (dept) => {
    setEditingDept(dept);
    setFormData({
      name: dept.name,
      code: dept.code || '',
      description: dept.description || '',
      managerName: dept.managerName || '',
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      error('Department name is required');
      return;
    }

    setModalLoading(true);
    try {
      if (editingDept) {
        await departmentApi.update(editingDept.id, formData);
        success('Department updated successfully');
      } else {
        await departmentApi.create(formData);
        success('Department created successfully');
      }
      setIsModalOpen(false);
      fetchDepartments();
    } catch (err) {
      error(err.message || 'Operation failed');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await departmentApi.delete(deleteTarget.id);
      success('Department deleted successfully');
      setDeleteTarget(null);
      fetchDepartments();
    } catch (err) {
      error(err.message || 'Failed to delete department');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleViewEmployees = async (dept) => {
    setViewLoading(true);
    try {
      const res = await departmentApi.getById(dept.id);
      if (res?.data) {
        setViewDeptDetails(res.data);
      }
    } catch (err) {
      error(err.message || 'Failed to fetch department employees');
    } finally {
      setViewLoading(false);
    }
  };

  const filtered = departments.filter((d) =>
    d.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.code?.toLowerCase().includes(search.toLowerCase()) ||
    d.managerName?.toLowerCase().includes(search.toLowerCase())
  );

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
            Department Management
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Organize business units, team managers, and functional divisions.
          </p>
        </div>

        {isAdmin && (
          <button onClick={handleOpenAdd} className="btn btn-primary">
            <Plus size={18} /> Add Department
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '24px' }}>
        <div className="input-icon-wrapper" style={{ maxWidth: '360px' }}>
          <Search className="input-icon-left" size={18} />
          <input
            type="text"
            className="form-control input-with-icon-left"
            placeholder="Search departments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Department Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px'
      }}>
        {loading ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
            Loading departments...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            No departments found.
          </div>
        ) : (
          filtered.map((dept) => (
            <div key={dept.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--primary-light)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                  }}>
                    <Building2 size={22} />
                  </div>
                  {dept.code && (
                    <span className="badge badge-purple" style={{ fontSize: '0.78rem', letterSpacing: '1px' }}>
                      {dept.code}
                    </span>
                  )}
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                  {dept.name}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: '16px' }}>
                  {dept.description || 'No description provided.'}
                </p>

                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Lead / Manager: <strong style={{ color: 'var(--text-main)' }}>{dept.managerName || 'Unassigned'}</strong>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '16px',
                marginTop: '16px',
                borderTop: '1px solid var(--border-color)'
              }}>
                <button
                  onClick={() => handleViewEmployees(dept)}
                  className="btn btn-secondary btn-sm"
                  style={{ gap: '6px' }}
                >
                  <Users size={15} /> Employees
                </button>

                {isAdmin && (
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => handleOpenEdit(dept)}
                      className="btn btn-secondary btn-icon"
                      title="Edit Department"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(dept)}
                      className="btn btn-secondary btn-icon"
                      style={{ color: 'var(--danger)' }}
                      title="Delete Department"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDept ? 'Edit Department' : 'Create Department'}
      >
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">Department Name *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Engineering, Marketing"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Department Code</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. ENG, MKT, HR"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Department Manager / Lead</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Sarah Connor"
              value={formData.managerName}
              onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Scope of work and responsibilities..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={modalLoading}>
              {modalLoading ? 'Saving...' : editingDept ? 'Update Department' : 'Save Department'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Confirm Department Deletion"
        footer={
          <>
            <button onClick={() => setDeleteTarget(null)} className="btn btn-secondary" disabled={deleteLoading}>
              Cancel
            </button>
            <button onClick={handleDelete} className="btn btn-danger" disabled={deleteLoading}>
              {deleteLoading ? 'Deleting...' : 'Delete Department'}
            </button>
          </>
        }
      >
        <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
          Are you sure you want to delete the <strong>{deleteTarget?.name}</strong> department?
          Note: If active employees are assigned to this department, deletion will be blocked to maintain data integrity.
        </p>
      </Modal>

      {/* Department Employees Viewer Modal */}
      <Modal
        isOpen={Boolean(viewDeptDetails)}
        onClose={() => setViewDeptDetails(null)}
        title={`Department: ${viewDeptDetails?.department?.name || ''} (${viewDeptDetails?.employeeCount || 0} Staff)`}
      >
        <div>
          {viewDeptDetails?.employees?.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>
              No employees currently assigned to this department.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '350px', overflowY: 'auto' }}>
              {viewDeptDetails?.employees?.map((emp) => (
                <div
                  key={emp.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: '#FAF9FE',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img
                      src={emp.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.fullName)}&background=6C3BCE&color=fff`}
                      alt={emp.fullName}
                      style={{ width: '32px', height: '32px', borderRadius: '50%' }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{emp.fullName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{emp.designation}</div>
                    </div>
                  </div>

                  <span className="badge badge-purple">{emp.employeeId}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default DepartmentList;
