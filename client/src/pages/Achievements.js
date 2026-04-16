import React, { useState, useEffect } from 'react';
import axios from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Wrench, BookOpen, FileText, Briefcase, Award, Target, Upload, CheckCircle, XCircle, Clock, ArrowLeft, ExternalLink } from 'lucide-react';

export default function Achievements({ student }) {
  const [viewType, setViewType] = useState(null);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', description: '', date: '', file: null });
  const [submitting, setSubmitting] = useState(false);
  const [studentData, setStudentData] = useState(student);

  useEffect(() => {
    if (student?._id) {
      const fetchStudent = async () => {
        try {
          const res = await axios.get(`/api/students/${student._id}`);
          setStudentData(res.data);
        } catch (err) {
          console.error('Error fetching student:', err);
          setStudentData(student);
        }
      };
      fetchStudent();
      const interval = setInterval(fetchStudent, 5000);
      return () => clearInterval(interval);
    }
  }, [student, student?._id]);

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
        const up = await axios.post('/api/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
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
      await axios.post(`/api/students/${student._id}/achievements`, { type, item });
      alert('✅ Submitted for admin approval');
      setForm({ name: '', description: '', date: '', file: null });
      setViewType(null);
      const res = await axios.get(`/api/students/${student._id}`);
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
    { icon: <Wrench size={32} />, label: 'Projects', value: approvedProjects.length, type: 'projects' },
    { icon: <BookOpen size={32} />, label: 'Online Courses', value: approvedCourses.length, type: 'courses' },
    { icon: <FileText size={32} />, label: 'Papers', value: approvedPapers.length, type: 'papers' },
    { icon: <Briefcase size={32} />, label: 'Internships', value: approvedInternships.length, type: 'internships' },
    { icon: <Award size={32} />, label: 'Hackathons', value: approvedHackathons.length, type: 'hackathons' },
    { icon: <Target size={32} />, label: 'Placement', value: `${sd.achievements?.placement?.placementPercentage ?? 0}%`, type: 'placement' },
  ];

  const renderSubmissionCard = (item) => {
    const statusConfig = {
      approved: { bg: 'var(--success-bg)', text: 'var(--success)', icon: <CheckCircle size={14} />, label: 'Approved', border: 'rgba(16, 185, 129, 0.2)' },
      rejected: { bg: 'var(--danger-bg)', text: 'var(--danger)', icon: <XCircle size={14} />, label: 'Rejected', border: 'rgba(239, 68, 68, 0.2)' },
      pending: { bg: 'var(--primary-light)', text: 'var(--primary)', icon: <Clock size={14} />, label: 'Pending', border: 'rgba(14, 165, 233, 0.2)' }
    };
    const c = statusConfig[item.status] || statusConfig.pending;

    return (
      <div key={item.name} style={{
        background: 'var(--surface)', padding: 20, borderRadius: 12,
        border: `1px solid ${c.border}`, marginBottom: 16, boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <h4 style={{ color: 'var(--text-main)', margin: 0, fontSize: 16, fontWeight: 700 }}>{item.name}</h4>
          <span style={{ 
            background: c.bg, color: c.text, padding: '6px 12px', 
            borderRadius: 20, fontSize: 12, fontWeight: 700, 
            display: 'flex', alignItems: 'center', gap: 6 
          }}>
            {c.icon} {c.label}
          </span>
        </div>
        <p style={{ color: 'var(--text-muted)', margin: '8px 0 16px', fontSize: 14, lineHeight: 1.5 }}>{item.description}</p>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {item.proof ? (
            <a href={item.proof.startsWith('http') ? item.proof : `${axios.defaults.baseURL}${item.proof}`} target="_blank" rel="noreferrer" 
               style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--primary)', fontSize: 13, textDecoration: 'none', fontWeight: 600 }}>
              <ExternalLink size={14} /> View Document Attached
            </a>
          ) : <span></span>}
          
          {item.status === 'approved' && <div style={{ fontSize: 14, color: 'var(--success)', fontWeight: 700 }}>Awarded Marks: {item.marks || 0} / 100</div>}
        </div>

        {item.status === 'rejected' && (
          <div style={{ background: 'var(--bg-main)', padding: 12, borderRadius: 8, marginTop: 16, borderLeft: '4px solid var(--danger)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--danger)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>Reviewer Remarks:</div>
            <div style={{ fontSize: 14, color: 'var(--text-main)' }}>{item.remarks || 'No detailed remarks provided.'}</div>
          </div>
        )}
      </div>
    );
  };

  const viewConfig = {
    projects: { title: 'Development Projects', approved: approvedProjects, rejected: rejectedProjects, pending: pendingProjects, submitType: 'projects' },
    courses: { title: 'Online Certifications', approved: approvedCourses, rejected: rejectedCourses, pending: pendingCourses, submitType: 'courses' },
    internships: { title: 'Industrial Internships', approved: approvedInternships, rejected: rejectedInternships, pending: pendingInternships, submitType: 'internships' },
    hackathons: { title: 'Competitive Hackathons', approved: approvedHackathons, rejected: rejectedHackathons, pending: pendingHackathons, submitType: 'hackathons' },
    papers: { title: 'Research Publications', approved: approvedPapers, rejected: rejectedPapers, pending: pendingPapers, submitType: 'papers' }
  };

  const activeConfig = viewConfig[viewType];

  return (
    <div className="achievements-container">
      {error && (
        <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: 16, borderRadius: 8, marginBottom: 24, display: 'flex', gap: 10, alignItems: 'center', fontWeight: 600 }}>
          <XCircle size={18} /> {error}
        </div>
      )}

      <AnimatePresence mode="wait">
        {viewType === null ? (
          <motion.div key="grid" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <h1 className="achievements-title">Achievements Index</h1>
            <div className="achievements-cards">
              {achievements.map((item, idx) => (
                <div key={idx} className="achievement-card" onClick={() => setViewType(item.type)}>
                  <div className="achievement-icon" style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>{item.icon}</div>
                  <div className="achievement-label">{item.label}</div>
                  <div className="achievement-value">{item.value}</div>
                  <div style={{ fontSize: 13, marginTop: 12, opacity: 0.9, color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>Open Portfolio →</div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : activeConfig ? (
          <motion.div key="list" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <button
              onClick={() => setViewType(null)}
              style={{
                marginBottom: 32, padding: '12px 20px', background: 'var(--surface)', color: 'var(--text-main)', 
                border: '1px solid var(--border-light)', borderRadius: 10, cursor: 'pointer', fontSize: 14, 
                fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, boxShadow: 'var(--shadow-sm)'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--surface)'}
            >
              <ArrowLeft size={16} /> Portfolio Index
            </button>
            <h1 className="achievements-title" style={{ fontSize: 28 }}>{activeConfig.title}</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32 }}>
              <div>
                {activeConfig.approved.length > 0 && <div style={{ marginBottom: 32 }}><h3 style={{ color: 'var(--success)', marginBottom: 16 }}>{activeConfig.approved.length} Validated</h3>{activeConfig.approved.map(renderSubmissionCard)}</div>}
                
                {activeConfig.pending.length > 0 && <div style={{ marginBottom: 32 }}><h3 style={{ color: 'var(--primary)', marginBottom: 16 }}>{activeConfig.pending.length} Under Review</h3>{activeConfig.pending.map(renderSubmissionCard)}</div>}
                
                {activeConfig.rejected.length > 0 && <div style={{ marginBottom: 32 }}><h3 style={{ color: 'var(--danger)', marginBottom: 16 }}>{activeConfig.rejected.length} Returned</h3>{activeConfig.rejected.map(renderSubmissionCard)}</div>}

                {activeConfig.approved.length === 0 && activeConfig.rejected.length === 0 && activeConfig.pending.length === 0 && (
                  <div style={{ background: 'var(--surface)', padding: 48, borderRadius: 16, textAlign: 'center', border: '1px dashed var(--border-light)' }}>
                    <BookOpen size={48} style={{ color: 'var(--border-light)', marginBottom: 16 }} />
                    <h3 style={{ color: 'var(--text-main)', marginBottom: 8 }}>No Submissions Found</h3>
                    <p style={{ color: 'var(--text-muted)' }}>You have not uploaded any records for this category yet.</p>
                  </div>
                )}
              </div>

              <div style={{ background: 'var(--surface)', padding: 24, borderRadius: 16, border: '1px solid var(--border-light)', height: 'fit-content', boxShadow: 'var(--shadow-sm)' }}>
                <h3 style={{ marginTop: 0, color: 'var(--text-main)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Upload size={18} color="var(--primary)" /> Draft New Entry
                </h3>
                
                <input placeholder="Project/Course Title" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} 
                  style={{ width: '100%', padding: '12px 16px', marginBottom: 16, background: 'var(--bg-main)', color: 'var(--text-main)', border: '1px solid var(--border-light)', borderRadius: 8, fontSize: 14 }} />
                
                <textarea placeholder="Description or Role" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} 
                  style={{ width: '100%', padding: '12px 16px', marginBottom: 16, background: 'var(--bg-main)', color: 'var(--text-main)', border: '1px solid var(--border-light)', borderRadius: 8, fontSize: 14, minHeight: 100 }} />
                
                <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} 
                  style={{ width: '100%', marginBottom: 16, background: 'var(--bg-main)', color: 'var(--text-main)', border: '1px solid var(--border-light)', borderRadius: 8, padding: '12px 16px', fontSize: 14 }} />
                
                <div style={{ background: 'var(--bg-main)', padding: 12, borderRadius: 8, border: '1px dashed var(--border-light)', marginBottom: 24 }}>
                  <input type="file" onChange={handleFileChange} style={{ color: 'var(--text-muted)', fontSize: 13, width: '100%' }} />
                </div>

                <button onClick={() => submitAchievement(activeConfig.submitType)} disabled={submitting} 
                  style={{ width: '100%', padding: 14, background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, boxShadow: 'var(--shadow-sm)' }} 
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-hover)'} 
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--primary)'}>
                  {submitting ? 'Uploading...' : 'Submit Evidence'}
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="placement" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <button
              onClick={() => setViewType(null)}
              style={{
                marginBottom: 32, padding: '12px 20px', background: 'var(--surface)', color: 'var(--text-main)', 
                border: '1px solid var(--border-light)', borderRadius: 10, cursor: 'pointer', fontSize: 14, 
                fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, boxShadow: 'var(--shadow-sm)'
              }}
            >
              <ArrowLeft size={16} /> Returns to Index
            </button>
            <h1 className="achievements-title" style={{ fontSize: 28, display: 'flex', alignItems: 'center', gap: 12 }}><Target color="var(--primary)"/> Placement Diagnostics</h1>
            
            <div style={{ background: 'var(--surface)', padding: 32, borderRadius: 16, border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
                <div style={{ background: 'var(--bg-main)', padding: 24, borderRadius: 12, border: '1px solid var(--border-light)' }}>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase' }}>Interviews Attended</div>
                  <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--primary)' }}>{sd.achievements?.placement?.companiesAttended ?? 0}</div>
                </div>
                <div style={{ background: 'var(--bg-main)', padding: 24, borderRadius: 12, border: '1px solid var(--border-light)' }}>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase' }}>Conversion Rate</div>
                  <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--success)' }}>{sd.achievements?.placement?.placementPercentage ?? 0}%</div>
                </div>
                <div style={{ background: 'var(--bg-main)', padding: 24, borderRadius: 12, border: '1px solid var(--border-light)' }}>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase' }}>Aptitude Standing</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)' }}>{sd.achievements?.placement?.assessment || 'Not Graded'}</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
