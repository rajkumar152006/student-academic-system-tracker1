import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import '../styles/Dashboard.css';

function Login() {
  const navigate = useNavigate();
  const [roll, setRoll] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (!roll || !password) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const res = await axios.post('/api/auth/login', { rollNumber: roll, password });
      if (res.status === 200) {
        // First login returns { message, student, token }
        // Subsequent logins return the student object directly with token at top level
        const rawData = res.data.student || res.data;
        const { token, message, ...studentData } = rawData;
        localStorage.setItem('student', JSON.stringify(studentData));
        localStorage.setItem('token', res.data.token || token);
        localStorage.removeItem('adminUser');
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="login-container">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="login-card"
      >
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            style={{ 
              width: 64, height: 64, background: 'var(--primary-light)', 
              borderRadius: '20px', display: 'flex', alignItems: 'center', 
              justifyContent: 'center', margin: '0 auto 16px', color: 'var(--primary)'
            }}
          >
            <User size={32} strokeWidth={2.5} />
          </motion.div>
          <h1 className="login-title">Student Portal</h1>
          <p className="login-subtitle">Access your academic records and submissions</p>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: '12px 16px', borderRadius: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: 500 }}
            >
              <AlertCircle size={18} /> {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleLogin}>
          <div className="login-form-group">
            <label className="login-label">Roll Number</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: 14, top: 15, color: 'var(--text-muted)' }} />
              <input 
                type="text"
                className="login-input" 
                placeholder="e.g. 21CSE101" 
                value={roll} 
                onChange={e => setRoll(e.target.value)}
                style={{ paddingLeft: 42 }}
              />
            </div>
          </div>

          <div className="login-form-group">
            <label className="login-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: 14, top: 15, color: 'var(--text-muted)' }} />
              <input 
                type="password" 
                className="login-input" 
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ paddingLeft: 42 }}
              />
            </div>
          </div>

          <button type="submit" className="login-button" disabled={isLoading} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, opacity: isLoading ? 0.7 : 1 }}>
            {isLoading ? 'Authenticating...' : 'Sign In'}
            {!isLoading && <ArrowRight size={18} />}
          </button>
        </form>

        <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--border-light)' }}>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', marginBottom: 16 }}>
            First time? Your account will be created automatically.
          </p>
          <button 
            onClick={() => navigate('/admin-login')} 
            style={{ 
              width: '100%', padding: '14px', background: 'var(--bg-main)', 
              color: 'var(--text-main)', border: '1px solid var(--border-light)', 
              borderRadius: '12px', cursor: 'pointer', fontSize: 14, 
              fontWeight: 600, transition: 'all 0.2s', display: 'flex',
              alignItems: 'center', justifyContent: 'center', gap: 8
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-main)'}
          >
            <ShieldCheck size={18} style={{ color: 'var(--text-muted)' }} />
            Switch to Staff Portal
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;
