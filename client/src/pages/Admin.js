import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Dashboard.css';

export default function Admin() {
  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingSubmission, setEditingSubmission] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const admin = localStorage.getItem('adminUser');
    if (!admin) navigate('/admin-login');
  }, [navigate]);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get('http://localhost:5000/api/students');
      setStudents(res.data || []);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('Failed to load students');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/students/notifications/list');
      setNotifications(res.data || []);
      setNotificationCount(res.data?.length || 0);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setNotifications([]);
    }
  };

  const viewDetails = async (id) => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get(`http://localhost:5000/api/students/${id}`);
      if (!res.data) {
        setError('Student not found');
        return;
      }
      setSelected(res.data);
      setEditForm(JSON.parse(JSON.stringify(res.data)));
      setEditMode(false);
    } catch (err) {
      console.error('Error fetching student:', err);
      setError('Failed to load student details');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = (notification) => {
    viewDetails(notification.studentId);
  };

  const handleEditChange = (field, value) => {
    setEditForm({ ...editForm, [field]: value });
  };

  const handleAddSubject = () => {
    const updated = { ...editForm };
    updated.subjects = updated.subjects || [];
    updated.subjects.push({ name: '', marks: 0, internal: 0 });
    setEditForm(updated);
  };

  const handleSubjectChange = (idx, key, value) => {
    const updated = { ...editForm };
    updated.subjects = updated.subjects || [];
    updated.subjects[idx] = { ...updated.subjects[idx], [key]: key === 'name' ? value : parseFloat(value || 0) };
    setEditForm(updated);
  };

  const handleRemoveSubject = (idx) => {
    const updated = { ...editForm };
    updated.subjects = (updated.subjects || []).filter((_, i) => i !== idx);
    setEditForm(updated);
  };

  const handleAddLabCourse = () => {
    const updated = { ...editForm };
    updated.labCourses = updated.labCourses || [];
    updated.labCourses.push({ name: '', marks: 0, experimentsCompleted: 0, experimentsPending: 0 });
    setEditForm(updated);
  };

  const handleLabCourseChange = (idx, key, value) => {
    const updated = { ...editForm };
    updated.labCourses = updated.labCourses || [];
    updated.labCourses[idx] = { ...updated.labCourses[idx], [key]: key === 'name' ? value : parseFloat(value || 0) };
    setEditForm(updated);
  };

  const handleRemoveLabCourse = (idx) => {
    const updated = { ...editForm };
    updated.labCourses = (updated.labCourses || []).filter((_, i) => i !== idx);
    setEditForm(updated);
  };

  const handleAddAssignment = () => {
    const updated = { ...editForm };
    updated.assignments = updated.assignments || [];
    updated.assignments.push({ name: '', marks: 0, completed: 0, pending: 0 });
    setEditForm(updated);
  };

  const handleAssignmentChange = (idx, key, value) => {
    const updated = { ...editForm };
    updated.assignments = updated.assignments || [];
    updated.assignments[idx] = { ...updated.assignments[idx], [key]: key === 'name' ? value : parseFloat(value || 0) };
    setEditForm(updated);
  };

  const handleRemoveAssignment = (idx) => {
    const updated = { ...editForm };
    updated.assignments = (updated.assignments || []).filter((_, i) => i !== idx);
    setEditForm(updated);
  };

  const handleSaveEdit = async () => {
    try {
      setLoading(true);
      const res = await axios.put(`http://localhost:5000/api/students/${editForm._id}`, editForm);
      setSelected(res.data);
      setStudents(students.map(s => s._id === res.data._id ? res.data : s));
      setEditMode(false);
      setError('');
      alert('✅ Student updated successfully!');
    } catch (err) {
      console.error('Error saving:', err);
      setError(err.response?.data?.msg || err.message);
      alert('❌ Failed to update: ' + (err.response?.data?.msg || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async () => {
    if (!window.confirm(`Delete ${selected.name}?`)) return;
    try {
      setLoading(true);
      await axios.delete(`http://localhost:5000/api/students/${selected._id}`);
      setStudents(students.filter(s => s._id !== selected._id));
      setSelected(null);
      alert('✅ Student deleted');
    } catch (err) {
      alert('❌ Delete failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSubmission = async (listName, idx, field, value) => {
    try {
      const updated = JSON.parse(JSON.stringify(selected));
      if (!updated[listName]?.[idx]) {
        setError('Item not found');
        return;
      }
      updated[listName][idx][field] = value;
      const res = await axios.put(`http://localhost:5000/api/students/${selected._id}`, updated);
      setSelected(res.data);
      setStudents(students.map(s => s._id === res.data._id ? res.data : s));
      fetchNotifications();
      alert('✅ Submission updated');
    } catch (err) {
      console.error('Error updating:', err);
      setError(err.response?.data?.msg || err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    navigate('/admin-login');
  };

  const handleBackToList = () => {
    setSelected(null);
    setEditMode(false);
    setEditingSubmission({});
    setError('');
  };

  return (
    <div style={{ background: '#0f1419', minHeight: '100vh', padding: 24 }}>
      <div style={{ maxWidth: 1600, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, paddingBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <h1 style={{ color: '#f8fafc', margin: 0, fontSize: 28, fontWeight: 700, letterSpacing: '-0.5px' }}>Admin Dashboard</h1>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
                style={{
                  background: notificationCount > 0 ? '#dc2626' : '#475569',
                  color: 'white',
                  border: 'none',
                  padding: '10px 14px',
                  borderRadius: 8,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontSize: '14px'
                }}
              >
                📩 {notificationCount}
              </button>

              {showNotificationDropdown && (
                <div style={{
                  position: 'absolute',
                  top: 50,
                  right: 0,
                  background: '#1e293b',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 12,
                  boxShadow: '0 20px 25px -5px rgba(0,0,0,0.4)',
                  zIndex: 1000,
                  minWidth: 380,
                  maxHeight: 420,
                  overflowY: 'auto'
                }}>
                  {notifications.length > 0 ? (
                    <>
                      <div style={{ padding: 16, borderBottom: '1px solid rgba(255,255,255,0.08)', fontWeight: 600, color: '#f8fafc', fontSize: '14px' }}>
                        Pending Submissions ({notifications.length})
                      </div>
                      {notifications.map((notif, i) => (
                        <div
                          key={i}
                          onClick={() => { handleNotificationClick(notif); setShowNotificationDropdown(false); }}
                          style={{
                            padding: 14,
                            borderBottom: i < notifications.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                            cursor: 'pointer',
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(100,116,139,0.2)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <div style={{ fontWeight: 600, fontSize: 13, color: '#f8fafc' }}>{notif.rollNumber}</div>
                          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{notif.studentName}</div>
                          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
                            <span style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa', padding: '2px 8px', borderRadius: 4, fontSize: '11px' }}>
                              {notif.submissionType}
                            </span>
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>
                      No pending submissions
                    </div>
                  )}
                </div>
              )}
            </div>
            <button onClick={handleLogout} style={{ padding: '10px 16px', background: '#0ea5e9', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: '14px', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#0284c7'} onMouseLeave={e => e.currentTarget.style.background = '#0ea5e9'}>
              Logout
            </button>
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div style={{ background: 'rgba(220,38,38,0.1)', color: '#fca5a5', padding: 16, borderRadius: 8, marginBottom: 20, border: '1px solid rgba(220,38,38,0.3)', fontSize: '14px', fontWeight: 500 }}>
            ⚠️ {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: 32, color: '#60a5fa', fontSize: '14px', fontWeight: 500 }}>
            Loading...
          </div>
        )}

        {!loading && (
          <>
            {!selected && (
              <>
                {/* Students Table */}
                <div style={{ background: '#1e293b', borderRadius: 12, padding: 0, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)', marginBottom: 24, overflow: 'hidden' }}>
                  <div style={{ padding: 20, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <h3 style={{ color: '#f8fafc', margin: 0, fontSize: 18, fontWeight: 700, letterSpacing: '-0.3px' }}>Students ({students.length})</h3>
                  </div>

                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', background: 'transparent' }}>
                      <thead>
                        <tr style={{ background: '#0f172a', color: '#94a3b8' }}>
                          <th style={{ padding: 16, textAlign: 'left', fontWeight: 600, fontSize: 13, color: '#cbd5e1' }}>Name</th>
                          <th style={{ padding: 16, textAlign: 'left', fontWeight: 600, fontSize: 13, color: '#cbd5e1' }}>Roll Number</th>
                          <th style={{ padding: 16, textAlign: 'left', fontWeight: 600, fontSize: 13, color: '#cbd5e1' }}>Department</th>
                          <th style={{ padding: 16, textAlign: 'center', fontWeight: 600, fontSize: 13, color: '#cbd5e1' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.length > 0 ? (
                          students.map((student, idx) => (
                            <tr
                              key={student._id}
                              style={{
                                background: idx % 2 === 0 ? '#0f172a' : 'transparent',
                                borderBottom: '1px solid rgba(255,255,255,0.04)',
                                transition: 'background 0.2s'
                              }}
                              onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,130,246,0.15)'}
                              onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? '#0f172a' : 'transparent'}
                            >
                              <td style={{ padding: 16, color: '#f8fafc', fontWeight: 600, fontSize: '14px' }}>{student.name}</td>
                              <td style={{ padding: 16, color: '#94a3b8', fontSize: 13 }}>{student.rollNumber}</td>
                              <td style={{ padding: 16, color: '#94a3b8', fontSize: 13 }}>{student.department || '-'}</td>
                              <td style={{ padding: 16, textAlign: 'center' }}>
                                <button
                                  onClick={() => viewDetails(student._id)}
                                  style={{
                                    background: '#0ea5e9',
                                    color: 'white',
                                    border: 'none',
                                    padding: '8px 16px',
                                    borderRadius: 6,
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    fontSize: 13,
                                    transition: 'all 0.2s'
                                  }}
                                  onMouseEnter={e => e.currentTarget.style.background = '#0284c7'}
                                  onMouseLeave={e => e.currentTarget.style.background = '#0ea5e9'}
                                >
                                  View
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" style={{ padding: 32, textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>
                              No students found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* Detail Panel */}
            {selected && (
              <div style={{ background: '#1e293b', borderRadius: 12, padding: 24, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <h3 style={{ color: '#f8fafc', margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: '-0.3px' }}>{selected.name}</h3>
                  <button onClick={handleBackToList} style={{ background: '#334155', color: '#f8fafc', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13, transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#475569'} onMouseLeave={e => e.currentTarget.style.background = '#334155'}>
                    ← Back
                  </button>
                </div>

                {!editMode ? (
                  <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    {/* Info Table */}
                    <div style={{ marginBottom: 24 }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <tbody>
                          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                            <td style={{ padding: 14, color: '#94a3b8', fontWeight: 600, width: '20%', fontSize: 13 }}>Roll</td>
                            <td style={{ padding: 14, color: '#f8fafc', fontSize: '14px' }}>{selected.rollNumber}</td>
                            <td style={{ padding: 14, color: '#94a3b8', fontWeight: 600, fontSize: 13 }}>Email</td>
                            <td style={{ padding: 14, color: '#f8fafc', fontSize: '14px' }}>{selected.email || '-'}</td>
                          </tr>
                          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                            <td style={{ padding: 14, color: '#94a3b8', fontWeight: 600, fontSize: 13 }}>Department</td>
                            <td style={{ padding: 14, color: '#f8fafc', fontSize: '14px' }}>{selected.department || '-'}</td>
                            <td style={{ padding: 14, color: '#94a3b8', fontWeight: 600, fontSize: 13 }}>Year</td>
                            <td style={{ padding: 14, color: '#f8fafc', fontSize: '14px' }}>{selected.year || '-'}</td>
                          </tr>
                          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                            <td style={{ padding: 14, color: '#94a3b8', fontWeight: 600, fontSize: 13 }}>SGPA</td>
                            <td style={{ padding: 14, color: '#60a5fa', fontWeight: 700, fontSize: '14px' }}>{selected.sgpa?.toFixed(2) || '-'}</td>
                            <td style={{ padding: 14, color: '#94a3b8', fontWeight: 600, fontSize: 13 }}>CGPA</td>
                            <td style={{ padding: 14, color: '#60a5fa', fontWeight: 700, fontSize: '14px' }}>{selected.cgpa?.toFixed(2) || '-'}</td>
                          </tr>
                          <tr>
                            <td style={{ padding: 14, color: '#94a3b8', fontWeight: 600, fontSize: 13 }}>Fees Due</td>
                            <td style={{ padding: 14, color: selected.feesDue > 0 ? '#f87171' : '#86efac', fontWeight: 700, fontSize: '14px' }}>₹{selected.feesDue || 0}</td>
                            <td style={{ padding: 14, color: '#94a3b8', fontWeight: 600, fontSize: 13 }}>Arrears</td>
                            <td style={{ padding: 14, color: '#f8fafc', fontSize: '14px' }}>{selected.arrearCount || 0}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Subjects */}
                    <div style={{ marginBottom: 24 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, paddingBottom: 10, borderBottom: '2px solid #0ea5e9' }}>
                        <h5 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '18px', margin: 0, letterSpacing: '-0.3px' }}>Subject Marks</h5>
                      </div>
                      {selected.subjects?.length > 0 ? (
                        <table className="subjects-table">
                          <thead>
                            <tr>
                              <th>SUBJECT</th>
                              <th>MARKS</th>
                              <th>INTERNAL</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selected.subjects.map((sub, i) => (
                              <tr key={i}>
                                <td>{sub.name}</td>
                                <td>{sub.marks}</td>
                                <td>{sub.internal}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div style={{ padding: 20, textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>No subject data available</div>
                      )}
                    </div>

                    {/* Lab Courses */}
                    <div style={{ marginBottom: 24 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, paddingBottom: 10, borderBottom: '2px solid #0ea5e9' }}>
                        <h5 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '18px', margin: 0, letterSpacing: '-0.3px' }}>Lab Courses</h5>
                      </div>
                      {selected.labCourses?.length > 0 ? (
                        <table className="subjects-table">
                          <thead>
                            <tr>
                              <th>LAB COURSE</th>
                              <th>MARKS</th>
                              <th>COMPLETED</th>
                              <th>PENDING</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selected.labCourses.map((lab, i) => (
                              <tr key={i}>
                                <td>{lab.name}</td>
                                <td>{lab.marks}</td>
                                <td>{lab.experimentsCompleted}</td>
                                <td>{lab.experimentsPending}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div style={{ padding: 20, textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>No lab course data available</div>
                      )}
                    </div>

                    {/* Assignments */}
                    <div style={{ marginBottom: 24 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, paddingBottom: 10, borderBottom: '2px solid #0ea5e9' }}>
                        <h5 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '18px', margin: 0, letterSpacing: '-0.3px' }}>Assignments</h5>
                      </div>
                      {selected.assignments?.length > 0 ? (
                        <table className="subjects-table">
                          <thead>
                            <tr>
                              <th>ASSIGNMENT</th>
                              <th>MARKS</th>
                              <th>COMPLETED</th>
                              <th>PENDING</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selected.assignments.map((assign, i) => (
                              <tr key={i}>
                                <td>{assign.name}</td>
                                <td>{assign.marks}</td>
                                <td>{assign.completed}</td>
                                <td>{assign.pending}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div style={{ padding: 20, textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>No assignment data available</div>
                      )}
                    </div>

                    {/* Submissions */}
                    {((selected.projectsList?.length) || (selected.internshipsList?.length) || (selected.hackathonsList?.length)) > 0 && (
                      <div style={{ marginBottom: 24 }}>
                        <h5 style={{ color: '#f8fafc', fontWeight: 700, marginBottom: 12, fontSize: '14px', letterSpacing: '-0.2px' }}>Submissions</h5>
                        <div style={{ display: 'grid', gap: 12 }}>
                          {(selected.projectsList || []).map((item, i) => (
                            <SubmissionCard key={`proj-${i}`} item={item} listName="projectsList" idx={i} handleUpdateSubmission={handleUpdateSubmission} editingSubmission={editingSubmission} setEditingSubmission={setEditingSubmission} />
                          ))}
                          {(selected.internshipsList || []).map((item, i) => (
                            <SubmissionCard key={`int-${i}`} item={item} listName="internshipsList" idx={i} handleUpdateSubmission={handleUpdateSubmission} editingSubmission={editingSubmission} setEditingSubmission={setEditingSubmission} />
                          ))}
                          {(selected.hackathonsList || []).map((item, i) => (
                            <SubmissionCard key={`hack-${i}`} item={item} listName="hackathonsList" idx={i} handleUpdateSubmission={handleUpdateSubmission} editingSubmission={editingSubmission} setEditingSubmission={setEditingSubmission} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Buttons */}
                    <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                      <button onClick={() => setEditMode(true)} style={{ flex: 1, padding: 12, background: '#0ea5e9', color: 'white', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: '14px', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#0284c7'} onMouseLeave={e => e.currentTarget.style.background = '#0ea5e9'}>
                        ✏️ Edit
                      </button>
                      <button onClick={handleDeleteStudent} style={{ flex: 1, padding: 12, background: '#dc2626', color: 'white', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: '14px', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#991b1b'} onMouseLeave={e => e.currentTarget.style.background = '#dc2626'}>
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
                      <FormField label="Name" value={editForm.name || ''} onChange={e => handleEditChange('name', e.target.value)} />
                      <FormField label="Roll" value={editForm.rollNumber || ''} onChange={e => handleEditChange('rollNumber', e.target.value)} />
                      <FormField label="Email" value={editForm.email || ''} onChange={e => handleEditChange('email', e.target.value)} type="email" />
                      <FormField label="Department" value={editForm.department || ''} onChange={e => handleEditChange('department', e.target.value)} />
                      <FormField label="Year" value={editForm.year || 0} onChange={e => handleEditChange('year', parseInt(e.target.value))} type="number" />
                      <FormField label="Fees Due (₹)" value={editForm.feesDue || 0} onChange={e => handleEditChange('feesDue', parseFloat(e.target.value))} type="number" />
                      <FormField label="SGPA" value={editForm.sgpa || 0} onChange={e => handleEditChange('sgpa', parseFloat(e.target.value))} type="number" step="0.1" />
                      <FormField label="CGPA" value={editForm.cgpa || 0} onChange={e => handleEditChange('cgpa', parseFloat(e.target.value))} type="number" step="0.1" />
                    </div>

                    {/* Subjects */}
                    <div style={{ marginBottom: 20, marginTop: 20 }}>
                      <h5 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '18px', margin: 0, marginBottom: 10, paddingBottom: 10, borderBottom: '2px solid #0ea5e9', letterSpacing: '-0.3px' }}>Subjects</h5>
                      {(editForm.subjects || []).map((sub, i) => (
                        <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 50px', gap: 8, marginBottom: 8 }}>
                          <input value={sub.name || ''} onChange={e => handleSubjectChange(i, 'name', e.target.value)} placeholder="Subject Name" style={{ padding: 10, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, background: '#0f172a', color: '#f8fafc', fontSize: '13px' }} />
                          <input type="number" value={sub.marks || 0} onChange={e => handleSubjectChange(i, 'marks', e.target.value)} placeholder="Marks" style={{ padding: 10, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, background: '#0f172a', color: '#f8fafc', fontSize: '13px' }} />
                          <input type="number" value={sub.internal || 0} onChange={e => handleSubjectChange(i, 'internal', e.target.value)} placeholder="Internal" style={{ padding: 10, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, background: '#0f172a', color: '#f8fafc', fontSize: '13px' }} />
                          <button onClick={() => handleRemoveSubject(i)} style={{ background: '#dc2626', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: '14px', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#991b1b'} onMouseLeave={e => e.currentTarget.style.background = '#dc2626'}>✕</button>
                        </div>
                      ))}
                      <button onClick={handleAddSubject} style={{ padding: '8px 12px', background: '#0ea5e9', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: '13px', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#0284c7'} onMouseLeave={e => e.currentTarget.style.background = '#0ea5e9'}>+ Add</button>
                    </div>

                    {/* Lab Courses */}
                    <div style={{ marginBottom: 20, marginTop: 20 }}>
                      <h5 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '18px', margin: 0, marginBottom: 10, paddingBottom: 10, borderBottom: '2px solid #0ea5e9', letterSpacing: '-0.3px' }}>Lab Courses</h5>
                      {(editForm.labCourses || []).map((lab, i) => (
                        <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 50px', gap: 8, marginBottom: 8 }}>
                          <input value={lab.name || ''} onChange={e => handleLabCourseChange(i, 'name', e.target.value)} placeholder="Lab Course Name" style={{ padding: 10, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, background: '#0f172a', color: '#f8fafc', fontSize: '13px' }} />
                          <input type="number" value={lab.marks || 0} onChange={e => handleLabCourseChange(i, 'marks', e.target.value)} placeholder="Marks" style={{ padding: 10, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, background: '#0f172a', color: '#f8fafc', fontSize: '13px' }} />
                          <input type="number" value={lab.experimentsCompleted || 0} onChange={e => handleLabCourseChange(i, 'experimentsCompleted', e.target.value)} placeholder="Completed" style={{ padding: 10, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, background: '#0f172a', color: '#f8fafc', fontSize: '13px' }} />
                          <input type="number" value={lab.experimentsPending || 0} onChange={e => handleLabCourseChange(i, 'experimentsPending', e.target.value)} placeholder="Pending" style={{ padding: 10, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, background: '#0f172a', color: '#f8fafc', fontSize: '13px' }} />
                          <button onClick={() => handleRemoveLabCourse(i)} style={{ background: '#dc2626', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: '14px', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#991b1b'} onMouseLeave={e => e.currentTarget.style.background = '#dc2626'}>✕</button>
                        </div>
                      ))}
                      <button onClick={handleAddLabCourse} style={{ padding: '8px 12px', background: '#0ea5e9', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: '13px', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#0284c7'} onMouseLeave={e => e.currentTarget.style.background = '#0ea5e9'}>+ Add Lab</button>
                    </div>

                    {/* Assignments */}
                    <div style={{ marginBottom: 20, marginTop: 20 }}>
                      <h5 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '18px', margin: 0, marginBottom: 10, paddingBottom: 10, borderBottom: '2px solid #0ea5e9', letterSpacing: '-0.3px' }}>Assignments</h5>
                      {(editForm.assignments || []).map((assign, i) => (
                        <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 50px', gap: 8, marginBottom: 8 }}>
                          <input value={assign.name || ''} onChange={e => handleAssignmentChange(i, 'name', e.target.value)} placeholder="Assignment Name" style={{ padding: 10, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, background: '#0f172a', color: '#f8fafc', fontSize: '13px' }} />
                          <input type="number" value={assign.marks || 0} onChange={e => handleAssignmentChange(i, 'marks', e.target.value)} placeholder="Marks" style={{ padding: 10, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, background: '#0f172a', color: '#f8fafc', fontSize: '13px' }} />
                          <input type="number" value={assign.completed || 0} onChange={e => handleAssignmentChange(i, 'completed', e.target.value)} placeholder="Completed" style={{ padding: 10, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, background: '#0f172a', color: '#f8fafc', fontSize: '13px' }} />
                          <input type="number" value={assign.pending || 0} onChange={e => handleAssignmentChange(i, 'pending', e.target.value)} placeholder="Pending" style={{ padding: 10, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, background: '#0f172a', color: '#f8fafc', fontSize: '13px' }} />
                          <button onClick={() => handleRemoveAssignment(i)} style={{ background: '#dc2626', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: '14px', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#991b1b'} onMouseLeave={e => e.currentTarget.style.background = '#dc2626'}>✕</button>
                        </div>
                      ))}
                      <button onClick={handleAddAssignment} style={{ padding: '8px 12px', background: '#0ea5e9', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: '13px', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#0284c7'} onMouseLeave={e => e.currentTarget.style.background = '#0ea5e9'}>+ Add Assignment</button>
                    </div>

                    {/* Buttons */}
                    <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                      <button onClick={handleSaveEdit} style={{ flex: 1, padding: 12, background: '#10b981', color: 'white', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: '14px', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#059669'} onMouseLeave={e => e.currentTarget.style.background = '#10b981'}>
                        💾 Save
                      </button>
                      <button onClick={() => setEditMode(false)} style={{ flex: 1, padding: 12, background: '#64748b', color: 'white', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: '14px', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#475569'} onMouseLeave={e => e.currentTarget.style.background = '#64748b'}>
                        ✕ Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Form Field Component
function FormField({ label, value, onChange, type = 'text', step }) {
  return (
    <div>
      <label style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 600, color: '#94a3b8', letterSpacing: '-0.2px' }}>{label}</label>
      <input type={type} step={step} value={value} onChange={onChange} style={{ width: '100%', padding: 10, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, background: '#0f172a', color: '#f8fafc', fontSize: '13px', transition: 'border-color 0.2s' }} onFocus={e => e.currentTarget.style.borderColor = 'rgba(14,165,233,0.5)'} onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'} />
    </div>
  );
}

// Submission Card Component
function SubmissionCard({ item, listName, idx, handleUpdateSubmission, editingSubmission, setEditingSubmission }) {
  const editKey = `${listName}-${idx}`;
  const currentMarks = editingSubmission[editKey]?.marks !== undefined ? editingSubmission[editKey].marks : item.marks || 0;
  const currentRemarks = editingSubmission[editKey]?.remarks !== undefined ? editingSubmission[editKey].remarks : item.remarks || '';
  const currentStatus = editingSubmission[editKey]?.status !== undefined ? editingSubmission[editKey].status : item.status || 'pending';

  const statusColor = {
    pending: '#1e3a8a',
    approved: '#064e3b',
    rejected: '#7c2d12'
  };

  const statusBg = {
    pending: 'rgba(59,130,246,0.15)',
    approved: 'rgba(16,185,129,0.15)',
    rejected: 'rgba(239,68,68,0.15)'
  };

  const statusColorText = {
    pending: '#60a5fa',
    approved: '#86efac',
    rejected: '#f87171'
  };

  return (
    <div style={{ background: statusBg[currentStatus], border: `1px solid ${statusColorText[currentStatus]}`, borderRadius: 8, padding: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
        <div>
          <div style={{ color: '#f8fafc', fontWeight: 700, marginBottom: 4, fontSize: '14px' }}>{item.name}</div>
          <div style={{ color: '#94a3b8', fontSize: 12 }}>{item.description || item.role || 'N/A'}</div>
          {item.proof && <a href={item.proof} target="_blank" rel="noreferrer" style={{ color: '#60a5fa', fontSize: 12, marginTop: 4, display: 'inline-block' }}>📎 View</a>}
        </div>
        <span style={{ background: statusColor[currentStatus], color: statusColorText[currentStatus], padding: '4px 12px', borderRadius: 6, fontSize: 11, fontWeight: 700 }}>
          {currentStatus.toUpperCase()}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>Marks</label>
          <input type="number" value={currentMarks} onChange={e => setEditingSubmission({...editingSubmission, [editKey]: {...(editingSubmission[editKey] || {}), marks: parseFloat(e.target.value || 0)}})} onBlur={e => handleUpdateSubmission(listName, idx, 'marks', parseFloat(e.target.value || 0))} style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid rgba(255,255,255,0.1)', background: '#0f172a', color: '#f8fafc', fontSize: '13px' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>Status</label>
          <select value={currentStatus} onChange={e => {setEditingSubmission({...editingSubmission, [editKey]: {...(editingSubmission[editKey] || {}), status: e.target.value}}); handleUpdateSubmission(listName, idx, 'status', e.target.value);}} style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid rgba(255,255,255,0.1)', background: '#0f172a', color: '#f8fafc', fontSize: '13px' }}>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div style={{ marginTop: 10 }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>Remarks</label>
        <textarea value={currentRemarks} onChange={e => setEditingSubmission({...editingSubmission, [editKey]: {...(editingSubmission[editKey] || {}), remarks: e.target.value}})} onBlur={e => handleUpdateSubmission(listName, idx, 'remarks', e.target.value)} placeholder="Remarks..." style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid rgba(255,255,255,0.1)', background: '#0f172a', color: '#f8fafc', minHeight: 50, fontSize: 12 }} />
      </div>
    </div>
  );
}
