import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/api';
import { motion } from 'framer-motion';
import { BookOpen, UserCheck, Lock } from 'lucide-react';
import '../styles/Dashboard.css';

export default function FacultyLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('/api/auth/teacher/login', { email, password });
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('facultyUser', JSON.stringify(res.data));
        navigate('/faculty');
      } else {
        setError('Login failed - no token received');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid Credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-main)' }}>
      {/* Left side design */}
      <div style={{ flex: 1, background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', padding: 40, position: 'relative', overflow: 'hidden' }}>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
          <BookOpen size={80} style={{ marginBottom: 24, dropShadow: '0 10px 15px rgba(0,0,0,0.2)' }} />
        </motion.div>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <h1 style={{ fontSize: 48, fontWeight: 800, margin: '0 0 16px 0', letterSpacing: '-1px' }}>Faculty Portal</h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.8)', textAlign: 'center', maxWidth: 400, margin: 0, lineHeight: 1.6 }}>
            Manage attendance, grade assignments, and monitor student academic progression.
          </p>
        </motion.div>
        
        {/* Decorative glass elements */}
        <div style={{ position: 'absolute', top: '10%', left: '10%', width: 200, height: 200, background: 'rgba(255,255,255,0.1)', borderRadius: '50%', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: 300, height: 300, background: 'rgba(255,255,255,0.15)', borderRadius: '50%', filter: 'blur(60px)' }} />
      </div>

      {/* Right side form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} style={{ width: '100%', maxWidth: 420 }}>
          <div style={{ marginBottom: 40, textAlign: 'center' }}>
            <h2 style={{ fontSize: 28, color: 'var(--text-main)', margin: '0 0 8px 0', fontWeight: 800 }}>Welcome Back, Instructor</h2>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>Please enter your credentials to continue</p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: 16, borderRadius: 12, marginBottom: 24, fontSize: 14, fontWeight: 600, border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              ⚠️ {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', marginBottom: 8, color: 'var(--text-main)', fontWeight: 600, fontSize: 14 }}>Academic Email</label>
              <div style={{ position: 'relative' }}>
                <UserCheck size={20} color="var(--text-muted)" style={{ position: 'absolute', left: 16, top: 14 }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="faculty@school.edu"
                  required
                  style={{ width: '100%', padding: '14px 16px 14px 48px', border: '1px solid var(--border-light)', borderRadius: 12, fontSize: 15, background: 'var(--surface)', color: 'var(--text-main)', outline: 'none', transition: 'border 0.2s' }}
                  onFocus={e => e.currentTarget.style.border = '1px solid var(--primary)'}
                  onBlur={e => e.currentTarget.style.border = '1px solid var(--border-light)'}
                />
              </div>
            </div>

            <div style={{ marginBottom: 32 }}>
              <label style={{ display: 'block', marginBottom: 8, color: 'var(--text-main)', fontWeight: 600, fontSize: 14 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={20} color="var(--text-muted)" style={{ position: 'absolute', left: 16, top: 14 }} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{ width: '100%', padding: '14px 16px 14px 48px', border: '1px solid var(--border-light)', borderRadius: 12, fontSize: 15, background: 'var(--surface)', color: 'var(--text-main)', outline: 'none', transition: 'border 0.2s' }}
                  onFocus={e => e.currentTarget.style.border = '1px solid var(--primary)'}
                  onBlur={e => e.currentTarget.style.border = '1px solid var(--border-light)'}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: 16, background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(14, 165, 233, 0.25)', opacity: loading ? 0.7 : 1 }}
              onMouseEnter={e => !loading && (e.currentTarget.style.background = 'var(--primary-hover)')}
              onMouseLeave={e => !loading && (e.currentTarget.style.background = 'var(--primary)')}
            >
              {loading ? 'Authenticating...' : 'Sign In as Faculty'}
            </button>
          </form>

          <div style={{ marginTop: 40, textAlign: 'center' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>Not an instructor? </span>
            <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: 14, fontWeight: 700, cursor: 'pointer', padding: 0 }} onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'} onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}>
              Student Login →
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
