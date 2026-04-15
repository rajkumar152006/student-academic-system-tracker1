import React from 'react';
import { User, BookOpen, Trophy, Calendar } from 'lucide-react';

export default function Sidebar({ view, setView }) {
  const items = [
    { key: 'profile', label: 'Student Profile', icon: <User size={20} /> },
    { key: 'academic', label: 'Academics & Grades', icon: <BookOpen size={20} /> },
    { key: 'achievements', label: 'Submissions', icon: <Trophy size={20} /> },
    { key: 'timetable', label: 'My Timetable', icon: <Calendar size={20} /> },
  ];

  return (
    <aside className="dashboard-sidebar" aria-label="Main navigation">
      <div style={{ padding: '0 8px', marginBottom: '40px', marginTop: '10px' }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.5px' }}>Edu<span style={{ color: 'var(--text-main)' }}>Track</span></h2>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {items.map(i => (
          <div 
            key={i.key} 
            onClick={() => setView(i.key)} 
            role="button"
            tabIndex={0}
            onKeyPress={(e)=>{ if(e.key === 'Enter') setView(i.key); }}
            className={`sidebar-item ${view === i.key ? 'active' : ''}`}
          >
            <span className="sidebar-icon" aria-hidden>{i.icon}</span>
            <span>{i.label}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}
