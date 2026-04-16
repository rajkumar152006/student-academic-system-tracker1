import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/api';
import { Shield, Search, CreditCard, CheckCircle } from 'lucide-react';
import '../styles/Dashboard.css';

export default function AdminFees() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const admin = localStorage.getItem('adminUser');
    if (!admin) navigate('/admin-login');
    else fetchStudents();
  }, [navigate]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/students');
      setStudents(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearDues = async (id, currentFees) => {
    if (currentFees <= 0) return;
    if (!window.confirm("Confirm payment receipt? This will clear the student's dues to ₹0.")) return;
    
    try {
      const res = await axios.put(`/api/students/${id}`, { feesDue: 0 });
      setStudents(students.map(s => s._id === id ? res.data : s));
      alert('Payment processed successfully');
    } catch (err) {
      console.error(err);
      alert('Failed to clear dues.');
    }
  };

  const filteredStudents = students.filter(s => 
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalOutstanding = students.reduce((acc, s) => acc + (s.feesDue || 0), 0);

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border-light)', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100, boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Shield color="var(--primary)" size={28} />
          <h1 style={{ color: 'var(--text-main)', margin: 0, fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px' }}>Staff Portal</h1>
          <div style={{ display: 'flex', gap: 20, marginLeft: 40 }}>
            <span onClick={() => navigate('/admin')} style={{ color: 'var(--text-muted)', fontWeight: 600, cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'var(--text-main)'} onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>Student Registry</span>
            <span style={{ color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', borderBottom: '2px solid var(--primary)', paddingBottom: 4 }}>Fee Operations</span>
            <span onClick={() => navigate('/admin/timetables')} style={{ color: 'var(--text-muted)', fontWeight: 600, cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'var(--text-main)'} onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>Timetables</span>
          </div>
        </div>
      </header>

      <main style={{ flex: 1, padding: 40, maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h2 style={{ fontSize: 28, margin: '0 0 8px 0', color: 'var(--text-main)', fontWeight: 800 }}>Fee Operations Desk</h2>
            <p style={{ margin: 0, color: 'var(--text-muted)' }}>Manage student outstanding balances and record cash receipts.</p>
          </div>
          
          <div style={{ background: 'var(--danger-bg)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '16px 24px', borderRadius: 12, textAlign: 'right' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--danger)', textTransform: 'uppercase', marginBottom: 4 }}>Total Outstanding Campus Dues</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--danger)' }}>₹{totalOutstanding.toLocaleString()}</div>
          </div>
        </div>

        <div style={{ background: 'var(--surface)', borderRadius: 16, border: '1px solid var(--border-light)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ padding: 24, borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: 350 }}>
              <Search style={{ position: 'absolute', left: 16, top: 12, color: 'var(--text-muted)' }} size={20} />
              <input 
                type="text" 
                placeholder="Search by student or roll number..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '12px 16px 12px 48px', border: '1px solid var(--border-light)', borderRadius: 10, background: 'var(--bg-main)', color: 'var(--text-main)', fontSize: 15, outline: 'none' }}
              />
            </div>
          </div>

          {loading ? (
            <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>Loading records...</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ background: 'var(--bg-main)' }}>
                <tr>
                  <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontSize: 13, textTransform: 'uppercase', fontWeight: 700 }}>Student</th>
                  <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontSize: 13, textTransform: 'uppercase', fontWeight: 700 }}>Roll No</th>
                  <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontSize: 13, textTransform: 'uppercase', fontWeight: 700 }}>Department / Year</th>
                  <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontSize: 13, textTransform: 'uppercase', fontWeight: 700 }}>Outstanding Balance</th>
                  <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontSize: 13, textTransform: 'uppercase', fontWeight: 700, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((s, i) => (
                  <tr key={s._id} style={{ borderBottom: '1px solid var(--border-light)', background: i % 2 === 0 ? 'var(--surface)' : 'var(--bg-main)' }}>
                    <td style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-main)' }}>{s.name}</td>
                    <td style={{ padding: '16px 24px', color: 'var(--text-muted)' }}>{s.rollNumber}</td>
                    <td style={{ padding: '16px 24px', color: 'var(--text-muted)' }}>{s.department} - Y{s.year}</td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{ 
                        background: s.feesDue > 0 ? 'var(--warning-bg)' : 'var(--success-bg)', 
                        color: s.feesDue > 0 ? 'var(--warning)' : 'var(--success)', 
                        padding: '6px 12px', borderRadius: 20, fontWeight: 800, fontSize: 14 
                      }}>
                        ₹{s.feesDue || 0}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      {s.feesDue > 0 ? (
                        <button 
                          onClick={() => handleClearDues(s._id, s.feesDue)}
                          style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: 8, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'background 0.2s', marginLeft: 'auto' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-hover)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'var(--primary)'}
                        >
                          <CreditCard size={16} /> Collect
                        </button>
                      ) : (
                        <button disabled style={{ background: 'transparent', color: 'var(--success)', border: 'none', padding: '8px 16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
                          <CheckCircle size={18} /> Cleared
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>No student records match your search.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
