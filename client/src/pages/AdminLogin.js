import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/Dashboard.css';

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    // Simple admin login validation
    if (email === 'admin@school.com' && password === 'admin123') {
      localStorage.setItem('adminUser', JSON.stringify({
        email: email,
        role: 'admin',
        loginTime: new Date().toISOString()
      }));
      navigate('/admin');
    } else {
      setError('Invalid admin credentials');
      setTimeout(() => setError(''), 3000);
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Admin Portal</h1>
        <p className="login-subtitle">Student Academic Milestone Tracker</p>

        {error && <div style={{ background: '#fee', color: '#c33', padding: 10, borderRadius: 6, marginBottom: 15, fontSize: 14 }}>⚠️ {error}</div>}

        <div className="login-form-group">
          <label className="login-label">Email</label>
          <input 
            type="email"
            className="login-input" 
            placeholder="admin@school.com" 
            value={email} 
            onChange={e => setEmail(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleLogin()}
          />
        </div>

        <div className="login-form-group">
          <label className="login-label">Password</label>
          <input 
            type="password" 
            className="login-input" 
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleLogin()}
          />
        </div>

        <button className="login-button" onClick={handleLogin}>
          Admin Login
        </button>

        <p style={{ marginTop: 20, textAlign: 'center', fontSize: 12, color: '#7f8c8d' }}>
          Demo: admin@school.com / admin123
        </p>

        <button 
          onClick={() => navigate('/')} 
          style={{ width: '100%', marginTop: 10, padding: '10px', background: 'white', border: '1px solid #667eea', color: '#667eea', borderRadius: 6, cursor: 'pointer', fontSize: 14, fontWeight: 600, transition: 'all 0.2s' }}
          onMouseEnter={e => e.target.style.background = '#f0f2f5'}
          onMouseLeave={e => e.target.style.background = 'white'}
        >
          ← Student Login
        </button>
      </div>
    </div>
  );
}

export default AdminLogin;
