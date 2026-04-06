import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#0ea5e9', '#10b981'];

const renderCustomLabel = ({ cx, cy, value }) => {
  return (
    <text x={cx} y={cy} fill="white" textAnchor="middle" dominantBaseline="central" style={{ fontSize: 20, fontWeight: 700 }}>
      {value}%
    </text>
  );
};

function Profile({ student }) {
  const s = student || { name: 'Student', rollNumber: 'N/A', department: '-', year: '-', attendance: 0, email: '-', feesDue: 0, arrearCount: 0 };
  const pieData = [
    { name: 'Present', value: s.attendance || 0 },
    { name: 'Absent', value: 100 - (s.attendance || 0) },
  ];

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1 className="profile-title">My Profile</h1>
      </div>

      <div className="profile-grid">
        <div className="profile-field">
          <div className="profile-field-label">Name</div>
          <div className="profile-field-value">{s.name}</div>
        </div>
        <div className="profile-field">
          <div className="profile-field-label">Roll Number</div>
          <div className="profile-field-value">{s.rollNumber}</div>
        </div>
        <div className="profile-field">
          <div className="profile-field-label">Department</div>
          <div className="profile-field-value">{s.department}</div>
        </div>
        <div className="profile-field">
          <div className="profile-field-label">Year</div>
          <div className="profile-field-value">{s.year}</div>
        </div>
        <div className="profile-field">
          <div className="profile-field-label">Email</div>
          <div className="profile-field-value">{s.email || '-'}</div>
        </div>
        <div className="profile-field">
          <div className="profile-field-label">Fees Due</div>
          <div className="profile-field-value">₹{s.feesDue ?? 0}</div>
        </div>
        <div className="profile-field">
          <div className="profile-field-label">Arrear Count</div>
          <div className="profile-field-value">{s.arrearCount ?? 0}</div>
        </div>
      </div>

      <div className="attendance-section">
        <h2 className="attendance-title">Attendance Percentage</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 40, width: '100%' }}>
          <div className="attendance-chart" style={{ width: 300, height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pieData} dataKey="value" innerRadius={60} outerRadius={100} startAngle={90} endAngle={-270} label={renderCustomLabel}>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div>
            <div style={{ fontSize: 48, fontWeight: 700, color: '#0ea5e9', marginBottom: 10 }}>{s.attendance}%</div>
            <div style={{ fontSize: 14, color: '#94a3b8' }}>Present Days</div>
            <div style={{ fontSize: 14, color: '#94a3b8', marginTop: 20 }}>{100 - s.attendance}%</div>
            <div style={{ fontSize: 14, color: '#94a3b8' }}>Absent Days</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
