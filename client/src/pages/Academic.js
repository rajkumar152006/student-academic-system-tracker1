import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Beaker, PenTool, BarChart3 } from 'lucide-react';

const renderCGPALabel = ({ cx, cy, value }) => {
  if (value === 0) return null;
  return (
    <text x={cx} y={cy} fill="var(--text-main)" textAnchor="middle" dominantBaseline="central" style={{ fontSize: 24, fontWeight: 800 }}>
      {value.toFixed(2)}
    </text>
  );
};

export default function Academic({ student }) {
  const s = student || { subjects: [], sgpa: 0, cgpa: 0 };
  const labCourses = s.labCourses || [];
  const assignments = s.assignments || [];
  const [activeTab, setActiveTab] = useState('course');

  const sgpaData = [
    { semester: 'Sem 1', sgpa: Math.max(0, (s.sgpa || 8.2) - 0.3) },
    { semester: 'Sem 2', sgpa: Math.max(0, (s.sgpa || 8.2) - 0.2) },
    { semester: 'Sem 3', sgpa: Math.max(0, (s.sgpa || 8.2) - 0.1) },
    { semester: 'Sem 4', sgpa: s.sgpa || 8.2 },
    { semester: 'Sem 5', sgpa: Math.max(0, (s.sgpa || 8.2) - 0.15) },
  ];

  const cgpaValue = s.cgpa || 7.9;
  const cgpaData = [
    { name: 'CGPA', value: cgpaValue },
    { name: 'Remaining', value: 10 - cgpaValue },
  ];

  const tabs = [
    { key: 'course', icon: <BookOpen size={20} />, label: 'Coursework' },
    { key: 'lab', icon: <Beaker size={20} />, label: 'Laboratories' },
    { key: 'assignment', icon: <PenTool size={20} />, label: 'Assignments' },
    { key: 'result', icon: <BarChart3 size={20} />, label: 'Performance Analytics' },
  ];

  const tabVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.2 } }
  };

  return (
    <div className="academic-container">
      <h1 className="academic-title">Academic Performance</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 36 }}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              background: activeTab === tab.key ? 'var(--primary)' : 'var(--bg-main)',
              color: activeTab === tab.key ? '#ffffff' : 'var(--text-muted)',
              border: activeTab === tab.key ? 'none' : '1px solid var(--border-light)',
              borderRadius: '12px',
              padding: '16px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              transition: 'all 0.25s ease',
              boxShadow: activeTab === tab.key ? '0 10px 15px -3px rgba(14, 165, 233, 0.3)' : 'none'
            }}
            onMouseEnter={e => { if (activeTab !== tab.key) e.currentTarget.style.background = 'var(--surface-hover)' }}
            onMouseLeave={e => { if (activeTab !== tab.key) e.currentTarget.style.background = 'var(--bg-main)' }}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={tabVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {activeTab === 'course' && (
            <div className="subjects-section">
              <h2 className="section-title">Subject Marks</h2>
              <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid var(--border-light)', background: 'var(--surface)' }}>
                <table className="subjects-table">
                  <thead>
                    <tr>
                      <th>Subject Name</th>
                      <th>Marks Obtained</th>
                      <th>Internal Assessment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(s.subjects || []).length > 0 ? (
                      (s.subjects || []).map((sub, idx) => (
                        <tr key={idx}>
                          <td>{sub.name}</td>
                          <td>{sub.marks} / 100</td>
                          <td>{sub.internal} / 40</td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan={3} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>No subject data recorded</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'lab' && (
            <div className="subjects-section">
              <h2 className="section-title">Lab Courses</h2>
              <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid var(--border-light)', background: 'var(--surface)' }}>
                <table className="subjects-table">
                  <thead>
                    <tr>
                      <th>Laboratory Course</th>
                      <th>Total Marks</th>
                      <th>Experiments Completed</th>
                      <th>Experiments Pending</th>
                    </tr>
                  </thead>
                  <tbody>
                    {labCourses.length > 0 ? (
                      labCourses.map((lab, idx) => (
                        <tr key={idx}>
                          <td style={{ fontWeight: 600, color: 'var(--text-main)' }}>{lab.name || '-'}</td>
                          <td>{lab.marks ?? 0}</td>
                          <td style={{ color: 'var(--success)', fontWeight: 600 }}>{lab.experimentsCompleted ?? 0}</td>
                          <td style={{ color: 'var(--warning)', fontWeight: 600 }}>{lab.experimentsPending ?? 0}</td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan={4} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>No laboratory data recorded</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'assignment' && (
            <div className="subjects-section">
              <h2 className="section-title">Assignments</h2>
              <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid var(--border-light)', background: 'var(--surface)' }}>
                <table className="subjects-table">
                  <thead>
                    <tr>
                      <th>Assignment Title</th>
                      <th>Marks Awarded</th>
                      <th>No. Completed</th>
                      <th>No. Pending</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignments.length > 0 ? (
                      assignments.map((assignment, idx) => (
                        <tr key={idx}>
                          <td style={{ fontWeight: 600, color: 'var(--text-main)' }}>{assignment.name || '-'}</td>
                          <td>{assignment.marks ?? 0}</td>
                          <td style={{ color: 'var(--success)', fontWeight: 600 }}>{assignment.completed ?? 0}</td>
                          <td style={{ color: 'var(--danger)', fontWeight: 600 }}>{assignment.pending ?? 0}</td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan={4} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>No assignment data recorded</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'result' && (
            <>
              <div className="sgpa-section">
                <h2 className="section-title">Semester-wise SGPA Progression</h2>
                <div className="sgpa-bars-container">
                  {sgpaData.map((item, idx) => (
                    <div key={idx} className="sgpa-bar-item">
                      <div className="sgpa-semester">{item.semester}</div>
                      <div className="sgpa-value">{item.sgpa.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
                
                <div style={{ background: 'var(--bg-main)', padding: '32px 24px', borderRadius: '16px', marginTop: '24px', border: '1px solid var(--border-light)' }}>
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={sgpaData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" vertical={false} />
                      <XAxis dataKey="semester" stroke="var(--text-muted)" axisLine={false} tickLine={false} dy={10} />
                      <YAxis stroke="var(--text-muted)" axisLine={false} tickLine={false} domain={[0, 10]} dx={-10} />
                      <Tooltip cursor={{ fill: 'var(--surface-hover)' }} contentStyle={{ borderRadius: 12, border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-md)', fontWeight: 600 }} />
                      <Bar dataKey="sgpa" fill="var(--primary)" radius={[8, 8, 0, 0]} maxBarSize={50} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="cgpa-section" style={{ background: 'var(--bg-main)', padding: '32px', borderRadius: 16, marginTop: 40, border: '1px solid var(--border-light)' }}>
                <h2 className="section-title" style={{ borderColor: 'var(--primary)', marginBottom: 32 }}>Cumulative GPA (CGPA)</h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) minmax(200px, 1fr)', alignItems: 'center', gap: 40 }}>
                  <div style={{ height: 280 }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie data={cgpaData} dataKey="value" innerRadius={80} outerRadius={110} startAngle={90} endAngle={-270} label={renderCGPALabel}>
                          {cgpaData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 0 ? 'var(--primary)' : 'var(--surface)'} stroke="var(--border-light)" strokeWidth={1} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => value.toFixed(2)} contentStyle={{ borderRadius: 12, border: 'none', boxShadow: 'var(--shadow-md)', fontWeight: 600 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    <div style={{ fontSize: 72, fontWeight: 800, color: 'var(--primary)', lineHeight: 1, letterSpacing: '-2px' }}>{cgpaValue.toFixed(2)}</div>
                    <div style={{ fontSize: 16, color: 'var(--text-muted)', marginBottom: 32, fontWeight: 500, marginTop: 8 }}>Out of 10.0 Maximum</div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 16, height: 16, background: 'var(--primary)', borderRadius: 4 }}></div>
                        <span style={{ fontSize: 15, color: 'var(--text-main)', fontWeight: 600 }}>CGPA Achieved</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 16, height: 16, background: 'var(--surface)', border: '1px solid var(--border-light)', borderRadius: 4 }}></div>
                        <span style={{ fontSize: 15, color: 'var(--text-muted)' }}>Room for Improvement</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
