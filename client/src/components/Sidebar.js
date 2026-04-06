import React from 'react';

export default function Sidebar({ view, setView }) {
  const items = [
    { key: 'profile', label: 'Profile', icon: '👤' },
    { key: 'academic', label: 'Academic', icon: '📚' },
    { key: 'achievements', label: 'Achievements', icon: '🏆' },
  ];

  return (
    <aside className="dashboard-sidebar" aria-label="Main navigation">
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
    </aside>
  );
}
