import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, PieChart, Pie, Cell } from 'recharts';

const renderCGPALabel = ({ cx, cy, value }) => {
  return (
    <text x={cx} y={cy} fill="white" textAnchor="middle" dominantBaseline="central" style={{ fontSize: 18, fontWeight: 700 }}>
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
    { semester: 'Sem 1', sgpa: (s.sgpa || 8.2) - 0.3 },
    { semester: 'Sem 2', sgpa: (s.sgpa || 8.2) - 0.2 },
    { semester: 'Sem 3', sgpa: (s.sgpa || 8.2) - 0.1 },
    { semester: 'Sem 4', sgpa: s.sgpa || 8.2 },
    { semester: 'Sem 5', sgpa: (s.sgpa || 8.2) - 0.15 },
  ];

  const cgpaValue = s.cgpa || 7.9;
  const cgpaData = [
    { name: 'CGPA', value: cgpaValue },
    { name: 'Remaining', value: 10 - cgpaValue },
  ];

  const tabs = [
    { key: 'course', icon: '📘', label: 'Course' },
    { key: 'lab', icon: '🧪', label: 'Lab' },
    { key: 'assignment', icon: '📝', label: 'Assignment' },
    { key: 'result', icon: '📊', label: 'Result' },
  ];

  return (
    <div className="academic-container">
      <h1 className="academic-title">Academic Performance</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(140px, 1fr))', gap: 14, marginBottom: 24 }}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              background: activeTab === tab.key ? 'linear-gradient(90deg, #0ea5e9, #10b981)' : '#0f172a',
              color: activeTab === tab.key ? '#071024' : '#f8fafc',
              border: activeTab === tab.key ? 'none' : '1px solid rgba(255,255,255,0.08)',
              borderRadius: 10,
              padding: '14px 12px',
              cursor: 'pointer',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'all 0.2s ease'
            }}
          >
            <span style={{ fontSize: 18 }}>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {activeTab === 'course' && (
        <div className="subjects-section">
          <h2 className="section-title">Subject Marks</h2>
          <table className="subjects-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Marks</th>
                <th>Internal</th>
              </tr>
            </thead>
            <tbody>
              {(s.subjects || []).length > 0 ? (
                (s.subjects || []).map((sub, idx) => (
                  <tr key={idx}>
                    <td>{sub.name}</td>
                    <td>{sub.marks}</td>
                    <td>{sub.internal}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3}>No subject data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'lab' && (
        <div className="subjects-section">
          <h2 className="section-title">Lab Courses</h2>
          <table className="subjects-table">
            <thead>
              <tr>
                <th>Lab Course</th>
                <th>Marks</th>
                <th>No. of Experiments Completed</th>
                <th>No. of Experiments Pending</th>
              </tr>
            </thead>
            <tbody>
              {labCourses.length > 0 ? (
                labCourses.map((lab, idx) => (
                  <tr key={idx}>
                    <td>{lab.name || '-'}</td>
                    <td>{lab.marks ?? 0}</td>
                    <td>{lab.experimentsCompleted ?? 0}</td>
                    <td>{lab.experimentsPending ?? 0}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4}>No lab course data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'assignment' && (
        <div className="subjects-section">
          <h2 className="section-title">Assignments</h2>
          <table className="subjects-table">
            <thead>
              <tr>
                <th>Assignment</th>
                <th>Marks</th>
                <th>No. Completed</th>
                <th>No. Pending</th>
              </tr>
            </thead>
            <tbody>
              {assignments.length > 0 ? (
                assignments.map((assignment, idx) => (
                  <tr key={idx}>
                    <td>{assignment.name || '-'}</td>
                    <td>{assignment.marks ?? 0}</td>
                    <td>{assignment.completed ?? 0}</td>
                    <td>{assignment.pending ?? 0}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4}>No assignment data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'result' && (
        <>
          <div className="sgpa-section">
            <h2 className="section-title">Semester-wise SGPA</h2>

            <div className="sgpa-bars-container">
              {sgpaData.map((item, idx) => (
                <div key={idx} className="sgpa-bar-item">
                  <div className="sgpa-semester">{item.semester}</div>
                  <div className="sgpa-value">{item.sgpa.toFixed(2)}</div>
                </div>
              ))}
            </div>

            <div className="sgpa-chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sgpaData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="semester" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sgpa" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="cgpa-section">
            <h2 className="section-title" style={{ color: '#f8fafc', borderColor: '#0ea5e9', marginBottom: 20 }}>Cumulative GPA (CGPA)</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 40, justifyContent: 'space-around', flexWrap: 'wrap' }}>
              <div style={{ width: 300, height: 300 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={cgpaData} dataKey="value" innerRadius={60} outerRadius={100} startAngle={90} endAngle={-270} label={renderCGPALabel}>
                      {cgpaData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#0ea5e9' : '#0f172a'} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => value.toFixed(2)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 56, fontWeight: 700, color: '#0ea5e9', marginBottom: 5 }}>{cgpaValue.toFixed(2)}</div>
                <div style={{ fontSize: 14, color: '#94a3b8', marginBottom: 30 }}>Out of 10.0</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
                  <div style={{ width: 12, height: 12, background: '#0ea5e9', borderRadius: 2 }}></div>
                  <span style={{ fontSize: 14, color: '#f8fafc' }}>CGPA Achieved</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', marginTop: 10 }}>
                  <div style={{ width: 12, height: 12, background: '#0f172a', borderRadius: 2 }}></div>
                  <span style={{ fontSize: 14, color: '#94a3b8' }}>Remaining</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
