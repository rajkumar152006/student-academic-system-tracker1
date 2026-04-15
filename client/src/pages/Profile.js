import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { User, Mail, GraduationCap, Calendar, CreditCard, AlertTriangle, Fingerprint } from 'lucide-react';
import { motion } from 'framer-motion';

const COLORS = ['#0ea5e9', '#e2e8f0'];

const renderCustomLabel = ({ cx, cy, value }) => {
  if(value === 0) return null;
  return (
    <text x={cx} y={cy} fill="#0f172a" textAnchor="middle" dominantBaseline="central" style={{ fontSize: 24, fontWeight: 800 }}>
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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="profile-container">
      <motion.div variants={item} className="profile-header">
        <h1 className="profile-title">Personal Overview</h1>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32 }}>
        <div className="profile-grid" style={{ marginBottom: 0 }}>
          <motion.div variants={item} className="profile-field">
            <div className="profile-field-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><User size={14}/> Full Name</div>
            <div className="profile-field-value">{s.name}</div>
          </motion.div>
          <motion.div variants={item} className="profile-field">
            <div className="profile-field-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Fingerprint size={14}/> Roll Number</div>
            <div className="profile-field-value">{s.rollNumber}</div>
          </motion.div>
          <motion.div variants={item} className="profile-field">
            <div className="profile-field-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><GraduationCap size={14}/> Department</div>
            <div className="profile-field-value">{s.department || '-'}</div>
          </motion.div>
          <motion.div variants={item} className="profile-field">
            <div className="profile-field-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Calendar size={14}/> Current Year</div>
            <div className="profile-field-value">{s.year || '-'}</div>
          </motion.div>
          <motion.div variants={item} className="profile-field">
            <div className="profile-field-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Mail size={14}/> Email Address</div>
            <div className="profile-field-value">{s.email || '-'}</div>
          </motion.div>
          <motion.div variants={item} className="profile-field">
            <div className="profile-field-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><CreditCard size={14}/> Fees Due</div>
            <div className="profile-field-value" style={{ color: s.feesDue > 0 ? 'var(--danger)' : 'var(--success)' }}>
              ₹{s.feesDue ?? 0}
            </div>
          </motion.div>
          <motion.div variants={item} className="profile-field" style={{ gridColumn: '1 / -1' }}>
            <div className="profile-field-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><AlertTriangle size={14}/> Standing Arrears</div>
            <div className="profile-field-value">{s.arrearCount ?? 0}</div>
          </motion.div>
        </div>

        <motion.div variants={item} className="attendance-section" style={{ marginTop: 0 }}>
          <div style={{ background: 'var(--bg-main)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-light)', height: '100%' }}>
            <h2 className="profile-field-label" style={{ marginBottom: 24, textAlign: 'center' }}>Attendance Register</h2>
            <div className="attendance-chart" style={{ padding: 0, height: 220, border: 'none', background: 'transparent', flexDirection: 'column' }}>
              <div style={{ width: '100%', height: 200 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" innerRadius={65} outerRadius={90} startAngle={90} endAngle={-270} label={renderCustomLabel}>
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border-light)' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--primary)' }}>{s.attendance}%</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Present</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-muted)' }}>{100 - (s.attendance || 0)}%</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Absent</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Profile;
