import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Achievements({ student }) {
  const [viewType, setViewType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', description: '', date: '', file: null });
  const [submitting, setSubmitting] = useState(false);
  const [studentData, setStudentData] = useState(student);

  // Fetch latest student data to show approved/rejected achievements
  useEffect(() => {
    if (student?._id) {
      const fetchStudent = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/api/students/${student._id}`);
          setStudentData(res.data);
        } catch (err) {
          console.error('Error fetching student:', err);
          setStudentData(student);
        }
      };
      fetchStudent();
      const interval = setInterval(fetchStudent, 5000); // Refresh every 5 seconds
      return () => clearInterval(interval);
    }
  }, [student?._id]);

  const handleFileChange = (e) => setForm({ ...form, file: e.target.files[0] });

  const submitAchievement = async (type) => {
    if (!student || !student._id) return alert('Student not loaded');
    if (!form.name) return alert('Please enter title/name');
    try {
      setSubmitting(true);
      setError('');
      let proofUrl = '';
      if (form.file) {
        const fd = new FormData();
        fd.append('file', form.file);
        const up = await axios.post('http://localhost:5000/api/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        proofUrl = up.data.url;
      }

      const item = {
        name: form.name,
        description: form.description,
        date: form.date || new Date().toISOString().slice(0, 10),
        proof: proofUrl,
        status: 'pending',
        marks: 0,
        remarks: ''
      };
      await axios.post(`http://localhost:5000/api/students/${student._id}/achievements`, { type, item });
      alert('✅ Submitted for admin approval');
      setForm({ name: '', description: '', date: '', file: null });
      setViewType(null);
      // Refresh student data
      const res = await axios.get(`http://localhost:5000/api/students/${student._id}`);
      setStudentData(res.data);
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.msg || err.message || 'Submission failed');
      alert('❌ ' + (err.response?.data?.msg || 'Submission failed'));
    } finally {
      setSubmitting(false);
    }
  };

  const sd = studentData || student;
  const approvedProjects = (sd.projectsList || []).filter(p => p.status === 'approved');
  const rejectedProjects = (sd.projectsList || []).filter(p => p.status === 'rejected');
  const pendingProjects = (sd.projectsList || []).filter(p => p.status === 'pending');

  const approvedCourses = (sd.coursesList || []).filter(p => p.status === 'approved');
  const rejectedCourses = (sd.coursesList || []).filter(p => p.status === 'rejected');
  const pendingCourses = (sd.coursesList || []).filter(p => p.status === 'pending');

  const approvedPapers = (sd.papersList || []).filter(p => p.status === 'approved');
  const rejectedPapers = (sd.papersList || []).filter(p => p.status === 'rejected');
  const pendingPapers = (sd.papersList || []).filter(p => p.status === 'pending');

  const approvedInternships = (sd.internshipsList || []).filter(p => p.status === 'approved');
  const rejectedInternships = (sd.internshipsList || []).filter(p => p.status === 'rejected');
  const pendingInternships = (sd.internshipsList || []).filter(p => p.status === 'pending');

  const approvedHackathons = (sd.hackathonsList || []).filter(p => p.status === 'approved');
  const rejectedHackathons = (sd.hackathonsList || []).filter(p => p.status === 'rejected');
  const pendingHackathons = (sd.hackathonsList || []).filter(p => p.status === 'pending');

  const achievements = [
    { icon: '🛠️', label: 'Projects', value: approvedProjects.length, type: 'projects' },
    { icon: '📖', label: 'Online Courses', value: approvedCourses.length, type: 'courses' },
    { icon: '📄', label: 'Paper Presentations', value: approvedPapers.length, type: 'papers' },
    { icon: '💼', label: 'Internships', value: approvedInternships.length, type: 'internships' },
    { icon: '🏆', label: 'Hackathons', value: approvedHackathons.length, type: 'hackathons' },
    { icon: '🎯', label: 'Placement', value: `${sd.achievements?.placement?.placementPercentage ?? 0}%`, type: 'placement' },
  ];

  const renderSubmissionCard = (item) => {
    const statusColors = {
      approved: { bg: 'rgba(16,185,129,0.15)', border: '#10b981', icon: '✅', label: 'Approved' },
      rejected: { bg: 'rgba(239,68,68,0.15)', border: '#dc2626', icon: '❌', label: 'Rejected' },
      pending: { bg: 'rgba(59,130,246,0.15)', border: '#60a5fa', icon: '⏳', label: 'Pending' }
    };
    const colors = statusColors[item.status] || statusColors.pending;

    return (
      <div key={item.name} style={{
        background: colors.bg,
        padding: 16,
        borderRadius: 8,
        border: `2px solid ${colors.border}`,
        marginBottom: 12
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
          <h4 style={{ color: '#f8fafc', margin: 0 }}>{item.name}</h4>
          <span style={{ background: colors.border, color: 'white', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>
            {colors.icon} {colors.label}
          </span>
        </div>
        <p style={{ color: '#94a3b8', margin: '8px 0', fontSize: 14 }}>{item.description}</p>
        {item.proof && <a href={item.proof} target="_blank" rel="noreferrer" style={{ color: '#60a5fa', fontSize: 12, textDecoration: 'none' }}>📎 View Proof</a>}
        {item.status === 'approved' && <div style={{ fontSize: 12, color: '#10b981', marginTop: 8, fontWeight: 600 }}>Marks: {item.marks || 0}</div>}
        {item.status === 'rejected' && (
          <div style={{ background: 'rgba(239,68,68,0.1)', padding: 10, borderRadius: 6, marginTop: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#dc2626', marginBottom: 4 }}>Admin Remarks:</div>
            <div style={{ fontSize: 13, color: '#94a3b8' }}>{item.remarks || 'No remarks provided'}</div>
          </div>
        )}
      </div>
    );
  };

  const viewConfig = {
    projects: {
      title: '🛠️ Projects',
      approved: approvedProjects,
      rejected: rejectedProjects,
      pending: pendingProjects,
      emptyText: 'No projects submitted yet.',
      submitTitle: '📤 Submit Project Proof',
      namePlaceholder: 'Project Title',
      descPlaceholder: 'Description',
      submitType: 'projects'
    },
    courses: {
      title: '📖 Online Courses',
      approved: approvedCourses,
      rejected: rejectedCourses,
      pending: pendingCourses,
      emptyText: 'No courses submitted yet.',
      submitTitle: '📤 Submit Course Proof',
      namePlaceholder: 'Course Title',
      descPlaceholder: 'Platform',
      submitType: 'courses'
    },
    internships: {
      title: '💼 Internships',
      approved: approvedInternships,
      rejected: rejectedInternships,
      pending: pendingInternships,
      emptyText: 'No internships submitted yet.',
      submitTitle: '📤 Submit Internship Proof',
      namePlaceholder: 'Company / Title',
      descPlaceholder: 'Role',
      submitType: 'internships'
    },
    hackathons: {
      title: '🏆 Hackathons',
      approved: approvedHackathons,
      rejected: rejectedHackathons,
      pending: pendingHackathons,
      emptyText: 'No hackathons submitted yet.',
      submitTitle: '📤 Submit Hackathon Proof',
      namePlaceholder: 'Hackathon Title',
      descPlaceholder: 'Role / Short Description',
      submitType: 'hackathons'
    },
    papers: {
      title: '📄 Papers',
      approved: approvedPapers,
      rejected: rejectedPapers,
      pending: pendingPapers,
      emptyText: 'No papers submitted yet.',
      submitTitle: '📤 Submit Paper Proof',
      namePlaceholder: 'Paper Title',
      descPlaceholder: 'Conference / Journal',
      submitType: 'papers'
    }
  };

  const activeConfig = viewConfig[viewType];

  return (
    <div className="achievements-container">
      {error && (
        <div style={{ background: 'rgba(220,38,38,0.1)', color: '#fca5a5', padding: 12, borderRadius: 6, marginBottom: 10, border: '1px solid rgba(220,38,38,0.3)' }}>
          ⚠️ {error}
        </div>
      )}

      {viewType === null ? (
        <>
          <h1 className="achievements-title">Achievements</h1>
          <div className="achievements-cards">
            {achievements.map((item, idx) => (
              <div
                key={idx}
                className="achievement-card"
                onClick={() => setViewType(item.type)}
                style={{ cursor: 'pointer' }}
              >
                <div className="achievement-icon">{item.icon}</div>
                <div className="achievement-label">{item.label}</div>
                <div className="achievement-value">{item.value}</div>
                <div style={{ fontSize: 12, marginTop: 8, opacity: 0.8, color: '#f8fafc' }}>Click to view →</div>
              </div>
            ))}
          </div>
        </>
      ) : activeConfig ? (
        <>
          <button
            onClick={() => setViewType(null)}
            style={{ marginBottom: 20, padding: '10px 16px', background: '#0ea5e9', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 14, fontWeight: 600, transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#0284c7'}
            onMouseLeave={e => e.currentTarget.style.background = '#0ea5e9'}
          >
            ← Back to Achievements
          </button>
          <h1 className="achievements-title">{activeConfig.title}</h1>

          {activeConfig.approved.length > 0 && (
            <div style={{ marginBottom: 30 }}>
              <h3 style={{ color: '#10b981' }}>✅ Approved ({activeConfig.approved.length})</h3>
              <div>{activeConfig.approved.map(item => renderSubmissionCard(item))}</div>
            </div>
          )}

          {activeConfig.rejected.length > 0 && (
            <div style={{ marginBottom: 30 }}>
              <h3 style={{ color: '#dc2626' }}>❌ Rejected ({activeConfig.rejected.length})</h3>
              <div>{activeConfig.rejected.map(item => renderSubmissionCard(item))}</div>
            </div>
          )}

          {activeConfig.pending.length > 0 && (
            <div style={{ marginBottom: 30 }}>
              <h3 style={{ color: '#60a5fa' }}>⏳ Pending ({activeConfig.pending.length})</h3>
              <div>{activeConfig.pending.map(item => renderSubmissionCard(item))}</div>
            </div>
          )}

          {activeConfig.approved.length === 0 && activeConfig.rejected.length === 0 && activeConfig.pending.length === 0 && (
            <div style={{ background: '#0f172a', padding: 40, borderRadius: 10, textAlign: 'center', color: '#94a3b8', marginBottom: 30, border: '1px solid rgba(255,255,255,0.06)' }}>
              {activeConfig.emptyText}
            </div>
          )}

          <div style={{ background: '#1e293b', padding: 20, borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
            <h3 style={{ marginTop: 0, color: '#f8fafc' }}>{activeConfig.submitTitle}</h3>
            <input placeholder={activeConfig.namePlaceholder} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={{ width: '100%', padding: 8, marginBottom: 8, background: '#0f172a', color: '#f8fafc', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6 }} />
            <textarea placeholder={activeConfig.descPlaceholder} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ width: '100%', padding: 8, marginBottom: 8, background: '#0f172a', color: '#f8fafc', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6 }} />
            <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} style={{ marginBottom: 8, background: '#0f172a', color: '#f8fafc', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: 8 }} />
            <input type="file" onChange={handleFileChange} style={{ marginBottom: 8, color: '#94a3b8' }} />
            <button onClick={() => submitAchievement(activeConfig.submitType)} disabled={submitting} style={{ padding: '8px 12px', background: '#10b981', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#059669'} onMouseLeave={e => e.currentTarget.style.background = '#10b981'}>
              {submitting ? '⏳ Submitting...' : '📤 Submit'}
            </button>
          </div>
        </>
      ) : (
        <>
          <button onClick={() => setViewType(null)} style={{ marginBottom: 20, padding: '10px 16px', background: '#667eea', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
            ← Back to Achievements
          </button>
          <h1 className="achievements-title">🎯 Placement Details</h1>
          <div style={{ background: 'white', padding: 20, borderRadius: 10, boxShadow: '0 4px 10px rgba(0,0,0,0.08)', border: '1px solid #e8eef5' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 15 }}>
              <div style={{ background: '#f7fafc', padding: 12, borderRadius: 6 }}>
                <div style={{ fontSize: 12, color: '#7f8c8d', marginBottom: 4 }}>Companies Attended</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#2c3e50' }}>{sd.achievements?.placement?.companiesAttended ?? 0}</div>
              </div>
              <div style={{ background: '#f7fafc', padding: 12, borderRadius: 6 }}>
                <div style={{ fontSize: 12, color: '#7f8c8d', marginBottom: 4 }}>Placement %</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#2c3e50' }}>{sd.achievements?.placement?.placementPercentage ?? 0}%</div>
              </div>
              <div style={{ background: '#f7fafc', padding: 12, borderRadius: 6 }}>
                <div style={{ fontSize: 12, color: '#7f8c8d', marginBottom: 4 }}>Assessment</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#2c3e50' }}>{sd.achievements?.placement?.assessment || 'N/A'}</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
