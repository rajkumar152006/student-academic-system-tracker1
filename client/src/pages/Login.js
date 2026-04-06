import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import '../styles/Dashboard.css';

function Login() {
  const navigate = useNavigate();
  const [roll, setRoll] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!roll) {
      alert('Please enter Roll Number');
      return;
    }
    if (!password) {
      alert('Please enter Password');
      return;
    }
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { rollNumber: roll, password });
      if (res.status === 200) {
        const studentData = res.data.student || res.data;
        localStorage.setItem('student', JSON.stringify(studentData));
        localStorage.removeItem('adminUser');
        if (res.data.message) {
          alert('✅ ' + res.data.message);
        } else {
          alert('✅ Login successful');
        }
        navigate('/dashboard');
      }
    } catch (err) {
      if (err.response?.status === 401) {
        alert('❌ Invalid password');
      } else if (err.response?.status === 400) {
        alert('❌ ' + err.response.data.error);
      } else {
        alert('❌ Login failed: ' + (err.response?.data?.error || err.message));
      }
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Student Portal</h1>
        <p className="login-subtitle">Academic Milestone Tracker</p>

        <div className="login-form-group">
          <label className="login-label">Roll Number</label>
          <input 
            type="text"
            className="login-input" 
            placeholder="Enter your Roll Number" 
            value={roll} 
            onChange={e => setRoll(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleLogin()}
          />
        </div>

        <div className="login-form-group">
          <label className="login-label">Password</label>
          <input 
            type="password" 
            className="login-input" 
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleLogin()}
          />
        </div>

        <button className="login-button" onClick={handleLogin}>
          Login
        </button>

        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <p style={{ fontSize: 12, color: '#7f8c8d', marginBottom: 10 }}>First time? Any Roll Number will auto-register a new account</p>
          <button 
            onClick={() => navigate('/admin-login')} 
            style={{ width: '100%', padding: '10px', background: '#667eea', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 14, fontWeight: 600, transition: 'all 0.2s' }}
            onMouseEnter={e => e.target.style.background = '#764ba2'}
            onMouseLeave={e => e.target.style.background = '#667eea'}
          >
            👨‍💼 Admin Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
