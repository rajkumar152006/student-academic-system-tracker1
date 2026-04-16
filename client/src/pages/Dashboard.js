import React, { useState } from 'react';
import '../styles/Dashboard.css';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Profile from './Profile';
import Academic from './Academic';
import Achievements from './Achievements';
import Timetable from './Timetable';

import { LogOut } from 'lucide-react';

// ... other imports stay the same below
export default function Dashboard() {
  const [view, setView] = useState('profile');
  const navigate = useNavigate();
  const student = JSON.parse(localStorage.getItem('student') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('student');
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <Sidebar view={view} setView={setView} />
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Welcome, {student.name}</h1>
          <button className="btn-logout" onClick={handleLogout}>
            <LogOut size={16} /> Logout
          </button>
        </div>
        {view === 'profile' && <Profile student={student} />}
        {view === 'academic' && <Academic student={student} />}
        {view === 'achievements' && <Achievements student={student} />}
        {view === 'timetable' && <Timetable student={student} />}
      </div>
    </div>
  );
}
