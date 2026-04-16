import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, LogOut, Search, Trash2, Edit3, Save, X, Eye, Shield, Users, Inbox, LayoutDashboard, Clock, FileText, CheckCircle, XCircle } from 'lucide-react';
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
  const [searchTerm, setSearchTerm] = useState('');
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
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get('/api/students');
      setStudents(res.data || []);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('Failed to load student registry');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/api/students/notifications/list');
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
      const res = await axios.get(`/api/students/${id}`);
      if (!res.data) {
        setError('Student profile not found');
        return;
      }
      setSelected(res.data);
      setEditForm(JSON.parse(JSON.stringify(res.data)));
      setEditMode(false);
      setShowNotificationDropdown(false);
    } catch (err) {
      console.error('Error fetching student:', err);
      setError('Failed to load detailed profile');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = (notification) => {
    viewDetails(notification.studentId);
  };

  // Field Array Logic (unchanged mapped to new design)
  const handleEditChange = (field, value) => setEditForm({ ...editForm, [field]: value });
  
  const handlePlacementChange = (field, value) => {
    const updated = { ...editForm };
    if (!updated.achievements) updated.achievements = {};
    if (!updated.achievements.placement) updated.achievements.placement = { companiesAttended: 0, placementPercentage: 0, assessment: '' };
    updated.achievements.placement[field] = value;
    setEditForm(updated);
  };

  const handleArrayAdd = (key, defaultObj) => {
    const updated = { ...editForm };
    updated[key] = updated[key] || [];
    updated[key].push(defaultObj);
    setEditForm(updated);
  };

  const handleArrayChange = (idx, key, field, value) => {
    const updated = { ...editForm };
    updated[key] = updated[key] || [];
    updated[key][idx] = { ...updated[key][idx], [field]: field === 'name' || field === 'assessment' ? value : parseFloat(value || 0) };
    setEditForm(updated);
  };

  const handleArrayRemove = (idx, key) => {
    const updated = { ...editForm };
    updated[key] = (updated[key] || []).filter((_, i) => i !== idx);
    setEditForm(updated);
  };

  const handleSaveEdit = async () => {
    try {
      setLoading(true);
      const res = await axios.put(`/api/students/${editForm._id}`, editForm);
      setSelected(res.data);
      setStudents(students.map(s => s._id === res.data._id ? res.data : s));
      setEditMode(false);
      setError('');
      alert('✅ Profile updated successfully!');
    } catch (err) {
      console.error('Error saving:', err);
      setError(err.response?.data?.msg || err.message);
      alert('❌ Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async () => {
    if (!window.confirm(`Permanently delete ${selected.name}'s profile and all records?`)) return;
    try {
      setLoading(true);
      await axios.delete(`/api/students/${selected._id}`);
      setStudents(students.filter(s => s._id !== selected._id));
      setSelected(null);
      alert('✅ Student record archived');
    } catch (err) {
      alert('❌ Delete failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSubmission = async (listName, idx, field, value) => {
    try {
      const res = await axios.put(`/api/students/${selected._id}/achievements/${listName}/${idx}`, { field, value });
      setSelected(res.data);
      setStudents(students.map(s => s._id === res.data._id ? res.data : s));
      fetchNotifications();
    } catch (err) {
      console.error('Error updating submission:', err);
      setError(err.response?.data?.msg || err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    navigate('/admin-login');
  };

  const filteredStudents = students.filter(s => 
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh' }}>
      {/* Top Navbar */}
      <header style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border-light)', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100, boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Shield color="var(--primary)" size={28} />
          <h1 style={{ color: 'var(--text-main)', margin: 0, fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px' }}>Staff Portal</h1>
          <div style={{ display: 'flex', gap: 20, marginLeft: 40 }}>
            <span style={{ color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', borderBottom: '2px solid var(--primary)', paddingBottom: 4 }}>Student Registry</span>
            <span onClick={() => navigate('/admin/fees')} style={{ color: 'var(--text-muted)', fontWeight: 600, cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'var(--text-main)'} onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>Fee Operations</span>
            <span onClick={() => navigate('/admin/timetables')} style={{ color: 'var(--text-muted)', fontWeight: 600, cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'var(--text-main)'} onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>Timetables</span>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          {/* Notifications */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
              style={{
                background: notificationCount > 0 ? 'var(--danger-bg)' : 'var(--bg-main)',
                color: notificationCount > 0 ? 'var(--danger)' : 'var(--text-muted)',
                border: notificationCount > 0 ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid var(--border-light)',
                padding: '10px 16px',
                borderRadius: 12,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 14
              }}
            >
              <Bell size={18} />
              {notificationCount > 0 && <span>{notificationCount} Pending</span>}
            </button>

            <AnimatePresence>
              {showNotificationDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  style={{
                    position: 'absolute', top: '100%', right: 0, marginTop: 12,
                    background: 'var(--surface)', border: '1px solid var(--border-light)',
                    borderRadius: 16, boxShadow: 'var(--shadow-lg)', zIndex: 1000,
                    width: 360, maxHeight: 480, overflowY: 'auto'
                  }}
                >
                  {notifications.length > 0 ? (
                    <>
                      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-light)', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Inbox size={18} color="var(--primary)" /> Action Center
                      </div>
                      {notifications.map((notif, i) => (
                        <div
                          key={i}
                          onClick={() => handleNotificationClick(notif)}
                          style={{
                            padding: '14px 20px', borderBottom: '1px solid var(--border-light)',
                            cursor: 'pointer', transition: 'background 0.2s', display: 'flex', flexDirection: 'column'
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-hover)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                            <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-main)' }}>{notif.studentName}</div>
                            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{notif.rollNumber}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                            <span style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '4px 10px', borderRadius: 6, fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>
                              {notif.submissionType.replace('List','')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
                      <CheckCircle size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                      <div style={{ fontWeight: 600 }}>All caught up!</div>
                      <div style={{ fontSize: 13 }}>No pending approvals</div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <span style={{ width: 1, height: 24, background: 'var(--border-light)' }}></span>
          
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'transparent', color: 'var(--text-muted)', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '14px', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--text-main)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
            <LogOut size={18} /> Exit
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div style={{ maxWidth: 1600, margin: '0 auto', padding: '32px' }}>
        {error && (
          <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: 16, borderRadius: 12, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10, fontWeight: 600 }}>
            <XCircle size={18} /> {error}
          </div>
        )}

        {loading && !selected && (
          <div style={{ textAlign: 'center', padding: 64, color: 'var(--text-muted)', fontWeight: 600, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
             <Clock size={32} style={{ animation: 'spin 2s linear infinite' }} /> Syncing Student Records...
          </div>
        )}

        {!loading && !selected && (
          <div style={{ background: 'var(--surface)', borderRadius: 16, border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
            <div style={{ padding: 24, borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Users color="var(--primary)" size={24} />
                <h3 style={{ margin: 0, fontSize: 20, color: 'var(--text-main)', fontWeight: 700 }}>Student Registry</h3>
                <span style={{ background: 'var(--bg-main)', color: 'var(--text-muted)', padding: '4px 10px', borderRadius: 20, fontSize: 13, fontWeight: 600, border: '1px solid var(--border-light)' }}>{students.length} Total</span>
              </div>
              <div style={{ position: 'relative', width: 320 }}>
                <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: 12 }} />
                <input type="text" placeholder="Search by name or roll..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '10px 16px 10px 40px', background: 'var(--bg-main)', border: '1px solid var(--border-light)', borderRadius: 10, color: 'var(--text-main)', fontSize: 14, outline: 'none' }} onFocus={e => e.currentTarget.style.borderColor = 'var(--primary)'} onBlur={e => e.currentTarget.style.borderColor = 'var(--border-light)'}/>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: 'var(--bg-main)' }}>
                  <tr>
                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Student Name</th>
                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Roll Number</th>
                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Department</th>
                    <th style={{ padding: '16px 24px', textAlign: 'center', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Overview</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student, idx) => (
                      <tr key={student._id} style={{ borderBottom: '1px solid var(--border-light)', transition: 'background 0.2s', background: idx % 2 === 0 ? 'var(--surface)' : 'var(--bg-main)' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-hover)'} onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? 'var(--surface)' : 'var(--bg-main)'}>
                        <td style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-main)', fontSize: 14 }}>{student.name || 'Unknown'}</td>
                        <td style={{ padding: '16px 24px', color: 'var(--text-muted)', fontSize: 14 }}>{student.rollNumber}</td>
                        <td style={{ padding: '16px 24px', color: 'var(--text-muted)', fontSize: 14 }}>{student.department || '-'}</td>
                        <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                          <button onClick={() => viewDetails(student._id)} style={{ padding: '8px 16px', background: 'var(--primary-light)', color: 'var(--primary)', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 12, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, transition: 'all 0.2s' }} onMouseEnter={e => {e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = 'white'}} onMouseLeave={e => {e.currentTarget.style.background = 'var(--primary-light)'; e.currentTarget.style.color = 'var(--primary)'}}>
                            <Eye size={14} /> Open Profile
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>
                        <LayoutDashboard size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
                        <div style={{ fontWeight: 600 }}>No results found</div>
                        <div style={{ fontSize: 13, marginTop: 4 }}>Try adjusting your search query</div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Selected Student Detail View */}
        {selected && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'var(--surface)', borderRadius: 16, border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-md)', overflow: 'hidden' }}>
            <div style={{ background: 'var(--bg-main)', padding: '24px 32px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 48, height: 48, background: 'var(--primary-light)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 800, fontSize: 20 }}>
                  {selected.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: 22, color: 'var(--text-main)', fontWeight: 800 }}>{selected.name}</h2>
                  <div style={{ color: 'var(--text-muted)', fontSize: 14, fontWeight: 500, marginTop: 2 }}>{selected.rollNumber} • {selected.department || 'No Dept'}</div>
                </div>
              </div>
              <button onClick={() => { setSelected(null); setEditMode(false); }} style={{ padding: '10px 16px', background: 'var(--surface)', color: 'var(--text-main)', border: '1px solid var(--border-light)', borderRadius: 10, cursor: 'pointer', fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s', boxShadow: 'var(--shadow-sm)' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-hover)'} onMouseLeave={e => e.currentTarget.style.background = 'var(--surface)'}>
                <X size={16} /> Close Profile
              </button>
            </div>

            <div style={{ padding: 32 }}>
              {!editMode ? (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 32 }}>
                    <SummaryCard label="Email" value={selected.email || 'Not Provided'} />
                    <SummaryCard label="Academic Year" value={selected.year || 'N/A'} />
                    <SummaryCard label="CGPA" value={selected.cgpa?.toFixed(2) || '0.00'} highlight />
                    <SummaryCard label="SGPA" value={selected.sgpa?.toFixed(2) || '0.00'} />
                    <SummaryCard label="Fees Due" value={`₹${selected.feesDue || 0}`} color={selected.feesDue > 0 ? 'var(--danger)' : 'var(--success)'} />
                    <SummaryCard label="Arrears" value={selected.arrearCount || 0} color={selected.arrearCount > 0 ? 'var(--warning)' : 'var(--text-main)'} />
                  </div>

                  <hr style={{ border: 0, borderTop: '1px solid var(--border-light)', margin: '32px 0' }} />

                  {((selected.projectsList?.length > 0) || (selected.internshipsList?.length > 0) || (selected.hackathonsList?.length > 0) || (selected.papersList?.length > 0) || (selected.coursesList?.length > 0)) && (
                    <div style={{ marginBottom: 40 }}>
                      <h3 style={{ color: 'var(--text-main)', fontWeight: 800, marginBottom: 20, fontSize: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FileText size={20} color="var(--primary)" /> Pending & Processed Submissions
                      </h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {(selected.projectsList || []).map((item, i) => <SubmissionCard key={`proj-${i}`} item={item} listName="projectsList" idx={i} handleUpdateSubmission={handleUpdateSubmission} editingSubmission={editingSubmission} setEditingSubmission={setEditingSubmission} />)}
                        {(selected.internshipsList || []).map((item, i) => <SubmissionCard key={`int-${i}`} item={item} listName="internshipsList" idx={i} handleUpdateSubmission={handleUpdateSubmission} editingSubmission={editingSubmission} setEditingSubmission={setEditingSubmission} />)}
                        {(selected.hackathonsList || []).map((item, i) => <SubmissionCard key={`hack-${i}`} item={item} listName="hackathonsList" idx={i} handleUpdateSubmission={handleUpdateSubmission} editingSubmission={editingSubmission} setEditingSubmission={setEditingSubmission} />)}
                        {(selected.papersList || []).map((item, i) => <SubmissionCard key={`paper-${i}`} item={item} listName="papersList" idx={i} handleUpdateSubmission={handleUpdateSubmission} editingSubmission={editingSubmission} setEditingSubmission={setEditingSubmission} />)}
                        {(selected.coursesList || []).map((item, i) => <SubmissionCard key={`course-${i}`} item={item} listName="coursesList" idx={i} handleUpdateSubmission={handleUpdateSubmission} editingSubmission={editingSubmission} setEditingSubmission={setEditingSubmission} />)}
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: 16 }}>
                    <button onClick={() => setEditMode(true)} style={{ flex: 1, padding: 14, background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 10, fontWeight: 600, cursor: 'pointer', fontSize: 14, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, transition: 'all 0.2s', boxShadow: 'var(--shadow-sm)' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-hover)'} onMouseLeave={e => e.currentTarget.style.background = 'var(--primary)'}>
                      <Edit3 size={18} /> Edit Core Records
                    </button>
                    <button onClick={handleDeleteStudent} style={{ padding: 14, background: 'var(--surface)', color: 'var(--danger)', border: '1px solid var(--danger)', borderRadius: 10, fontWeight: 600, cursor: 'pointer', fontSize: 14, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, transition: 'all 0.2s' }} onMouseEnter={e => {e.currentTarget.style.background = 'var(--danger)'; e.currentTarget.style.color = 'white'}} onMouseLeave={e => {e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.color = 'var(--danger)'}}>
                      <Trash2 size={18} /> Archive
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ background: 'var(--bg-main)', padding: 24, borderRadius: 12, border: '1px solid var(--border-light)' }}>
                  <h3 style={{ marginTop: 0, marginBottom: 24, color: 'var(--text-main)', borderBottom: '1px solid var(--border-light)', paddingBottom: 12 }}>Edit Biodata & Academics</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 32 }}>
                    <FormField label="Full Name" value={editForm.name || ''} onChange={e => handleEditChange('name', e.target.value)} />
                    <FormField label="Roll Number" value={editForm.rollNumber || ''} onChange={e => handleEditChange('rollNumber', e.target.value)} />
                    <FormField label="Official Email" value={editForm.email || ''} onChange={e => handleEditChange('email', e.target.value)} type="email" />
                    <FormField label="Department" value={editForm.department || ''} onChange={e => handleEditChange('department', e.target.value)} />
                    <FormField label="Academic Year" value={editForm.year || 0} onChange={e => handleEditChange('year', parseInt(e.target.value))} type="number" />
                    <FormField label="CGPA" value={editForm.cgpa || 0} onChange={e => handleEditChange('cgpa', parseFloat(e.target.value))} type="number" step="0.1" />
                    <FormField label="SGPA" value={editForm.sgpa || 0} onChange={e => handleEditChange('sgpa', parseFloat(e.target.value))} type="number" step="0.1" />
                    <FormField label="Outstanding Fees (₹)" value={editForm.feesDue || 0} onChange={e => handleEditChange('feesDue', parseFloat(e.target.value))} type="number" />
                    <FormField label="Arrear History" value={editForm.arrearCount || 0} onChange={e => handleEditChange('arrearCount', parseFloat(e.target.value))} type="number" />
                  </div>

                  <h3 style={{ marginTop: 32, marginBottom: 16, color: 'var(--text-main)', borderBottom: '1px solid var(--border-light)', paddingBottom: 12 }}>Parent / Guardian Information</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20, marginBottom: 32 }}>
                    <FormField label="Father's Name" value={editForm.parentDetails?.fatherName || ''} onChange={e => setEditForm({...editForm, parentDetails: {...(editForm.parentDetails || {}), fatherName: e.target.value}})} />
                    <FormField label="Mother's Name" value={editForm.parentDetails?.motherName || ''} onChange={e => setEditForm({...editForm, parentDetails: {...(editForm.parentDetails || {}), motherName: e.target.value}})} />
                    <FormField label="Parent Contact Number" value={editForm.parentDetails?.contactNumber || ''} onChange={e => setEditForm({...editForm, parentDetails: {...(editForm.parentDetails || {}), contactNumber: e.target.value}})} />
                    <FormField label="Parent Email" value={editForm.parentDetails?.email || ''} onChange={e => setEditForm({...editForm, parentDetails: {...(editForm.parentDetails || {}), email: e.target.value}})} type="email" />
                  </div>

                  <EditTable title="Core Subjects" data={editForm.subjects} handleAdd={() => handleArrayAdd('subjects', {name: '', marks: 0, internal: 0})} handleChange={(i,f,v) => handleArrayChange(i, 'subjects', f, v)} handleRemove={(i) => handleArrayRemove(i, 'subjects')} fields={[{k:'name', p:'Subject'}, {k:'marks', p:'Marks', type:'number'}, {k:'internal', p:'Internal', type:'number'}]} />
                  <EditTable title="Laboratories" data={editForm.labCourses} handleAdd={() => handleArrayAdd('labCourses', {name: '', marks: 0, experimentsCompleted: 0, experimentsPending: 0})} handleChange={(i,f,v) => handleArrayChange(i, 'labCourses', f, v)} handleRemove={(i) => handleArrayRemove(i, 'labCourses')} fields={[{k:'name', p:'Lab'}, {k:'marks', p:'Marks', type:'number'}, {k:'experimentsCompleted', p:'Done', type:'number'}, {k:'experimentsPending', p:'Pending', type:'number'}]} />

                  <h3 style={{ marginTop: 32, marginBottom: 16, color: 'var(--text-main)', borderBottom: '1px solid var(--border-light)', paddingBottom: 12 }}>Corporate / Placements</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
                    <FormField label="Interviews Attended" value={editForm.achievements?.placement?.companiesAttended || 0} onChange={e => handlePlacementChange('companiesAttended', parseInt(e.target.value || 0))} type="number" />
                    <FormField label="Conversion / Placement %" value={editForm.achievements?.placement?.placementPercentage || 0} onChange={e => handlePlacementChange('placementPercentage', parseFloat(e.target.value || 0))} type="number" />
                    <FormField label="Aptitude / Skill Grade" value={editForm.achievements?.placement?.assessment || ''} onChange={e => handlePlacementChange('assessment', e.target.value)} type="text" />
                  </div>

                  <div style={{ display: 'flex', gap: 16, marginTop: 40, paddingTop: 24, borderTop: '1px solid var(--border-light)' }}>
                    <button onClick={handleSaveEdit} style={{ flex: 1, padding: 14, background: 'var(--success)', color: 'white', border: 'none', borderRadius: 10, fontWeight: 600, cursor: 'pointer', fontSize: 14, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, transition: 'all 0.2s', boxShadow: 'var(--shadow-sm)' }} onMouseEnter={e => e.currentTarget.style.background = '#059669'} onMouseLeave={e => e.currentTarget.style.background = 'var(--success)'}>
                      <Save size={18} /> Commit Changes
                    </button>
                    <button onClick={() => setEditMode(false)} style={{ padding: '14px 24px', background: 'var(--surface)', color: 'var(--text-muted)', border: '1px solid var(--border-light)', borderRadius: 10, fontWeight: 600, cursor: 'pointer', fontSize: 14, transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-hover)'} onMouseLeave={e => e.currentTarget.style.background = 'var(--surface)'}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ label, value, color = 'var(--text-main)', highlight = false }) {
  return (
    <div style={{ background: highlight ? 'var(--primary-light)' : 'var(--bg-main)', padding: 20, borderRadius: 12, border: `1px solid ${highlight ? 'rgba(14, 165, 233, 0.2)' : 'var(--border-light)'}` }}>
      <div style={{ fontSize: 13, color: highlight ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 800, color: highlight ? 'var(--primary-hover)' : color }}>{value}</div>
    </div>
  );
}

function FormField({ label, value, onChange, type = 'text', step }) {
  return (
    <div>
      <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: 'var(--text-muted)' }}>{label}</label>
      <input type={type} step={step} value={value} onChange={onChange} style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-light)', borderRadius: 8, background: 'var(--surface)', color: 'var(--text-main)', fontSize: 14, outline: 'none', transition: 'border 0.2s' }} onFocus={e => e.currentTarget.style.borderColor = 'var(--primary)'} onBlur={e => e.currentTarget.style.borderColor = 'var(--border-light)'} />
    </div>
  );
}

function EditTable({ title, data = [], handleAdd, handleChange, handleRemove, fields }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h4 style={{ color: 'var(--text-main)', fontWeight: 700, margin: '0 0 12px 0', fontSize: 15 }}>{title}</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {data.map((row, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {fields.map(f => (
              <input key={f.k} type={f.type || 'text'} value={row[f.k] || ''} onChange={e => handleChange(i, f.k, e.target.value)} placeholder={f.p} style={{ flex: 1, padding: '10px 12px', border: '1px solid var(--border-light)', borderRadius: 8, background: 'var(--surface)', color: 'var(--text-main)', fontSize: 13, outline: 'none' }} onFocus={e => e.currentTarget.style.borderColor = 'var(--primary)'} onBlur={e => e.currentTarget.style.borderColor = 'var(--border-light)'} />
            ))}
            <button onClick={() => handleRemove(i)} style={{ background: 'var(--danger-bg)', color: 'var(--danger)', border: 'none', borderRadius: 8, padding: '10px 14px', cursor: 'pointer', fontWeight: 700 }} title="Remove Entry"><Trash2 size={16}/></button>
          </div>
        ))}
      </div>
      <button onClick={handleAdd} style={{ marginTop: 12, padding: '8px 16px', background: 'var(--surface)', color: 'var(--primary)', border: '1px dashed var(--primary)', borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-light)'} onMouseLeave={e => e.currentTarget.style.background = 'var(--surface)'}>+ Add Record</button>
    </div>
  );
}

function SubmissionCard({ item, listName, idx, handleUpdateSubmission, editingSubmission, setEditingSubmission }) {
  const editKey = `${listName}-${idx}`;
  const currentMarks = editingSubmission[editKey]?.marks !== undefined ? editingSubmission[editKey].marks : item.marks || 0;
  const currentRemarks = editingSubmission[editKey]?.remarks !== undefined ? editingSubmission[editKey].remarks : item.remarks || '';
  const currentStatus = editingSubmission[editKey]?.status !== undefined ? editingSubmission[editKey].status : item.status || 'pending';

  const sConf = {
    pending: { bg: 'var(--primary-light)', text: 'var(--primary)', border: 'var(--primary-light)' },
    approved: { bg: 'var(--success-bg)', text: 'var(--success)', border: 'var(--success-bg)' },
    rejected: { bg: 'var(--danger-bg)', text: 'var(--danger)', border: 'var(--danger-bg)' }
  };
  const c = sConf[currentStatus] || sConf.pending;

  return (
    <div style={{ background: 'var(--surface)', border: `1px solid var(--border-light)`, borderLeft: `4px solid ${c.text}`, borderRadius: 12, padding: 20, boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <div style={{ color: 'var(--text-main)', fontWeight: 800, marginBottom: 4, fontSize: 16 }}>{item.name}</div>
          <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>{item.description || item.role || 'No description provided'}</div>
          {item.proof && <a href={item.proof.startsWith('http') ? item.proof : `${axios.defaults.baseURL}${item.proof}`} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontSize: 13, marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 4, fontWeight: 600, textDecoration: 'none' }}><Search size={14}/> View Document</a>}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, 1fr) minmax(120px, 1fr) 2fr', gap: 20, background: 'var(--bg-main)', padding: 16, borderRadius: 10, border: '1px dashed var(--border-light)' }}>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase' }}>Modify Marks</label>
          <input type="number" value={currentMarks} onChange={e => setEditingSubmission({...editingSubmission, [editKey]: {...(editingSubmission[editKey] || {}), marks: parseFloat(e.target.value || 0)}})} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border-light)', background: 'var(--surface)', color: 'var(--text-main)', fontSize: 14, outline: 'none' }} onFocus={e=>e.currentTarget.style.borderColor='var(--primary)'} onBlur={e=>{e.currentTarget.style.borderColor='var(--border-light)'; handleUpdateSubmission(listName, idx, 'marks', parseFloat(e.target.value || 0))}} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase' }}>Change Status</label>
          <select value={currentStatus} onChange={e => {setEditingSubmission({...editingSubmission, [editKey]: {...(editingSubmission[editKey] || {}), status: e.target.value}}); handleUpdateSubmission(listName, idx, 'status', e.target.value);}} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border-light)', background: 'white', color: 'var(--text-main)', fontSize: 14, outline: 'none', cursor: 'pointer' }}>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase' }}>Reviewer Remarks</label>
          <textarea value={currentRemarks} onChange={e => setEditingSubmission({...editingSubmission, [editKey]: {...(editingSubmission[editKey] || {}), remarks: e.target.value}})} placeholder="Type reasons for rejection or comments..." style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border-light)', background: 'var(--surface)', color: 'var(--text-main)', minHeight: 40, fontSize: 13, resize: 'vertical', outline: 'none' }} onFocus={e=>e.currentTarget.style.borderColor='var(--primary)'} onBlur={e=>{e.currentTarget.style.borderColor='var(--border-light)'; handleUpdateSubmission(listName, idx, 'remarks', e.target.value)}} />
        </div>
      </div>
    </div>
  );
}
