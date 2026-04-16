import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Clock, Plus } from 'lucide-react';
import '../styles/Dashboard.css';

export default function AdminTimetables() {
  const navigate = useNavigate();

  useEffect(() => {
    const admin = localStorage.getItem('adminUser');
    if (!admin) navigate('/admin-login');
  }, [navigate]);

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border-light)', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100, boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Shield color="var(--primary)" size={28} />
          <h1 style={{ color: 'var(--text-main)', margin: 0, fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px' }}>Staff Portal</h1>
          <div style={{ display: 'flex', gap: 20, marginLeft: 40 }}>
            <span onClick={() => navigate('/admin')} style={{ color: 'var(--text-muted)', fontWeight: 600, cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'var(--text-main)'} onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>Student Registry</span>
            <span onClick={() => navigate('/admin/fees')} style={{ color: 'var(--text-muted)', fontWeight: 600, cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'var(--text-main)'} onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>Fee Operations</span>
            <span style={{ color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', borderBottom: '2px solid var(--primary)', paddingBottom: 4 }}>Timetables</span>
          </div>
        </div>
      </header>

      <main style={{ flex: 1, padding: 40, maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h2 style={{ fontSize: 28, margin: '0 0 8px 0', color: 'var(--text-main)', fontWeight: 800 }}>Master Timetable Configurator</h2>
            <p style={{ margin: 0, color: 'var(--text-muted)' }}>Define class periods, assign courses to faculty, and visualize conflicts.</p>
          </div>
          
          <button style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: 10, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'background 0.2s' }}>
            <Plus size={18} /> New Schedule
          </button>
        </div>

        <div style={{ background: 'var(--surface)', borderRadius: 16, border: '1px solid var(--border-light)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', textAlign: 'center', padding: 80, color: 'var(--text-muted)' }}>
          <Clock size={64} style={{ opacity: 0.3, marginBottom: 24, color: 'var(--primary)' }} />
          <h3 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', margin: '0 0 12px 0' }}>Under Construction</h3>
          <p style={{ fontSize: 16, margin: 0, maxWidth: 500, margin: '0 auto' }}>
            The class scheduling and timetable assignment module is slated for Phase 4 of the architectural upgrade. The database schemas are already provisioned.
          </p>
        </div>
      </main>
    </div>
  );
}
