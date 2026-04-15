import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Mail, Lock, ArrowRight, User, AlertCircle } from 'lucide-react';
import '../styles/Dashboard.css';

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const res = await axios.post('/api/auth/admin', { email, password });
      if (res.status === 200) {
        localStorage.setItem('adminUser', JSON.stringify(res.data));
        localStorage.setItem('token', res.data.token);
        localStorage.removeItem('student');
        navigate('/admin');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid staff credentials');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="login-container">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="login-card"
        style={{ borderTop: '4px solid var(--primary)' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <motion.div
            initial={{ rotate: -15 }}
            animate={{ rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
            style={{ 
              width: 56, height: 56, background: 'var(--primary-light)', 
              borderRadius: '16px', display: 'inline-flex', alignItems: 'center', 
              justifyContent: 'center', margin: '0 auto 16px', color: 'var(--primary)'
            }}
          >
            <ShieldCheck size={28} strokeWidth={2.5} />
          </motion.div>
          <h1 className="login-title" style={{ fontSize: 26 }}>Staff / Admin Login</h1>
          <p className="login-subtitle" style={{ marginBottom: 24 }}>School Management System Access</p>
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
            <label className="login-label">Official Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: 14, top: 15, color: 'var(--text-muted)' }} />
              <input 
                type="email"
                className="login-input" 
                placeholder="admin@school.com" 
                value={email} 
                onChange={e => setEmail(e.target.value)}
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
            {isLoading ? 'Verifying...' : 'Authorize'}
            {!isLoading && <ArrowRight size={18} />}
          </button>
        </form>

        <div style={{ marginTop: 24, paddingTop: 20 }}>
          <button 
            type="button"
            onClick={() => navigate('/')} 
            style={{ 
              width: '100%', padding: '12px', background: 'transparent', 
              color: 'var(--text-muted)', border: 'none', 
              cursor: 'pointer', fontSize: 14, fontWeight: 500, 
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
            }}
          >
            <User size={16} /> Returns to Student Portal
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default AdminLogin;
