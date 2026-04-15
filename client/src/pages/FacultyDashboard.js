import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, BookOpen, Users, CheckSquare, BarChart, PenTool, Search, ShieldCheck, Check, X, AlertCircle } from 'lucide-react';
import '../styles/Dashboard.css';

export default function FacultyDashboard() {
  const [faculty, setFaculty] = useState(null);
  const [courses, setCourses] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // States for grading and attendance
  const [grades, setGrades] = useState({});
  const [attendance, setAttendance] = useState({});
  
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('facultyUser');
    if (!user) navigate('/faculty-login');
    else {
      setFaculty(JSON.parse(user));
      fetchFacultyData(JSON.parse(user));
    }
  }, [navigate]);

  const fetchFacultyData = async (user) => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/teachers/${user._id}`);
      setFaculty(res.data);
      if (res.data.subjectsTaught) {
        setCourses(res.data.subjectsTaught);
        if (res.data.subjectsTaught.length > 0) setSelectedCourse(res.data.subjectsTaught[0]);
      }
    } catch (err) {
      console.error('Error fetching faculty data', err);
    } finally {
      setLoading(false);
    }
  };

  const seedDemoData = async () => {
    try {
      setLoading(true);
      // Get all students to enroll them
      const stRes = await axios.get('/api/students');
      const allStudentIds = stRes.data.map(s => s._id);

      const newCourseRes = await axios.post('/api/courses', {
        name: 'Advanced Mathematics ' + Math.floor(Math.random()*100),
        code: `MTH${Math.floor(Math.random()*1000)}`,
        department: faculty?.department || 'CSE',
        credits: 4,
        term: 'Fall 2026',
        teacher: faculty._id,
        enrolledStudents: allStudentIds
      });
      
      const teacherRes = await axios.put(`/api/teachers/${faculty._id}`, {
        subjectsTaught: [...(faculty.subjectsTaught || []).map(c=>c._id), newCourseRes.data._id]
      });
      
      alert('Demo course seeded with ' + allStudentIds.length + ' students!');
      fetchFacultyData(teacherRes.data);
    } catch (err) {
      console.error('Demo seed error:', err);
      alert('Failed to seed demo data. See console.');
    } finally {
      setLoading(false);
    }
  };

  const initGrades = (course) => {
    const initial = {};
    (course.enrolledStudents || []).forEach(student => {
      const existing = (student.subjects || []).find(s => s.name === course.name);
      initial[student._id] = {
        marks: existing ? existing.marks : 0,
        internal: existing ? existing.internal : 0
      };
    });
    setGrades(initial);
  };

  const initAttendance = (course) => {
    const initial = {};
    (course.enrolledStudents || []).forEach(student => {
      initial[student._id] = 'present'; // default
    });
    setAttendance(initial);
  };

  useEffect(() => {
    if (selectedCourse) {
      if (activeTab === 'grades') initGrades(selectedCourse);
      if (activeTab === 'attendance') initAttendance(selectedCourse);
    }
  }, [selectedCourse, activeTab]);

  const saveGrades = async () => {
    if (!selectedCourse) return;
    try {
      setSaving(true);
      for (const student of selectedCourse.enrolledStudents) {
        const studentGrades = grades[student._id];
        let newSubjects = [...(student.subjects || [])];
        const idx = newSubjects.findIndex(s => s.name === selectedCourse.name);
        
        if (idx >= 0) {
          newSubjects[idx].marks = studentGrades.marks;
          newSubjects[idx].internal = studentGrades.internal;
        } else {
          newSubjects.push({ name: selectedCourse.name, marks: studentGrades.marks, internal: studentGrades.internal });
        }
        await axios.put(`/api/students/${student._id}`, { subjects: newSubjects });
      }
      alert('✅ Grades successfully synchronized to student records!');
    } catch (err) {
      console.error('Save grades error:', err);
      alert('Failed to save grades.');
    } finally {
      setSaving(false);
    }
  };

  const saveAttendance = async () => {
    if (!selectedCourse) return;
    try {
      setSaving(true);
      const today = new Date().toISOString().slice(0,10);
      for (const student of selectedCourse.enrolledStudents) {
        const status = attendance[student._id];
        let newLog = [...(student.attendanceLog || [])];
        // Ensure no duplicate for today in this very simple implementation
        newLog = newLog.filter(l => l.date !== today);
        newLog.push({ date: today, status });
        
        let totalClasses = newLog.length || 1;
        let presentCount = newLog.filter(l => l.status === 'present').length;
        let attendancePercentage = Math.round((presentCount / totalClasses) * 100);

        await axios.put(`/api/students/${student._id}`, { attendanceLog: newLog, attendance: attendancePercentage });
      }
      alert(`✅ Attendance for ${today} marked successfully!`);
    } catch (err) {
      console.error('Save attendance error:', err);
      alert('Failed to save attendance.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('facultyUser');
    navigate('/faculty-login');
  };

  const totalStudents = courses.reduce((acc, c) => acc + (c.enrolledStudents?.length || 0), 0);

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh', display: 'flex' }}>
      {/* Sidebar */}
      <div style={{ width: 280, background: 'var(--surface)', borderRight: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', zIndex: 10 }}>
        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <ShieldCheck color="var(--primary)" size={28} />
          <h2 style={{ margin: 0, fontSize: 20, color: 'var(--text-main)', fontWeight: 800 }}>Faculty Portal</h2>
        </div>

        <nav style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <SidebarButton icon={<BookOpen size={20}/>} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
          <SidebarButton icon={<CheckSquare size={20}/>} label="Mark Attendance" active={activeTab === 'attendance'} onClick={() => setActiveTab('attendance')} />
          <SidebarButton icon={<PenTool size={20}/>} label="Gradebook" active={activeTab === 'grades'} onClick={() => setActiveTab('grades')} />
          <SidebarButton icon={<BarChart size={20}/>} label="Analytics" active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
        </nav>

        <div style={{ padding: 24, borderTop: '1px solid var(--border-light)' }}>
          <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: 12, color: 'var(--text-muted)', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s', borderRadius: 8 }} onMouseEnter={e => {e.currentTarget.style.color = 'var(--danger)'; e.currentTarget.style.background = 'var(--danger-bg)'}} onMouseLeave={e => {e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'}}>
            <LogOut size={20} /> Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', maxHeight: '100vh', overflow: 'hidden' }}>
        <header style={{ padding: '24px 40px', background: 'var(--surface)', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 5 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 24, color: 'var(--text-main)', fontWeight: 800 }}>{faculty?.name || 'Loading...'}</h1>
            <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: 14 }}>{faculty?.department || 'General'} Dept • {faculty?.employeeId || 'ID'}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {activeTab !== 'overview' && activeTab !== 'analytics' && courses.length > 0 && (
              <select 
                value={selectedCourse?._id || ''} 
                onChange={e => setSelectedCourse(courses.find(c => c._id === e.target.value))}
                style={{ padding: '10px 16px', background: 'var(--bg-main)', border: '1px solid var(--border-light)', color: 'var(--text-main)', borderRadius: 10, fontWeight: 600, outline: 'none' }}
              >
                {courses.map(c => <option key={c._id} value={c._id}>{c.code} - {c.name}</option>)}
              </select>
            )}
            <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '8px 16px', borderRadius: 20, fontSize: 13, fontWeight: 700 }}>
              Term: Fall 2026
            </div>
          </div>
        </header>

        <main style={{ flex: 1, padding: 40, overflowY: 'auto' }}>
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 40 }}>
                  <StatCard icon={<BookOpen size={24} />} label="Assigned Courses" value={courses.length} color="var(--primary)" bg="var(--primary-light)" />
                  <StatCard icon={<Users size={24} />} label="Total Students" value={totalStudents} color="var(--success)" bg="var(--success-bg)" />
                  <StatCard icon={<CheckSquare size={24} />} label="Pending Grades" value={totalStudents > 0 ? "Awaiting" : "None"} color="var(--warning)" bg="rgba(245, 158, 11, 0.15)" />
                </div>

                <div style={{ background: 'var(--surface)', borderRadius: 16, border: '1px solid var(--border-light)', padding: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h3 style={{ margin: 0, color: 'var(--text-main)', fontWeight: 800 }}>My Courses</h3>
                    {courses.length === 0 && (
                      <button onClick={seedDemoData} disabled={loading} style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}>
                        {loading ? 'Seeding...' : 'Seed Demo Course'}
                      </button>
                    )}
                  </div>

                  {courses.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
                      {courses.map(course => (
                        <div key={course._id} onClick={() => { setSelectedCourse(course); setActiveTab('grades'); }} style={{ background: 'var(--bg-main)', border: '1px solid var(--border-light)', borderRadius: 12, padding: 24, transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer' }} onMouseEnter={e => {e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.borderColor = 'var(--primary)'}} onMouseLeave={e => {e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--border-light)'}}>
                          <div style={{ color: 'var(--primary)', fontWeight: 800, fontSize: 13, textTransform: 'uppercase', marginBottom: 8, letterSpacing: 0.5 }}>{course.code}</div>
                          <h4 style={{ margin: '0 0 16px 0', fontSize: 18, color: 'var(--text-main)', fontWeight: 700 }}>{course.name}</h4>
                          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: 14, fontWeight: 500, paddingTop: 16, borderTop: '1px solid var(--border-light)' }}>
                            <span>{course.credits} Credits</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Users size={16} color="var(--primary)"/> {course.enrolledStudents?.length || 0} Students</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: 64, color: 'var(--text-muted)' }}>
                      <AlertCircle size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
                      <div style={{ fontWeight: 600, fontSize: 16, color: 'var(--text-main)' }}>No Courses Assigned</div>
                      <p style={{ marginTop: 8 }}>You haven't been assigned any classes for this term. Contact administration.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'grades' && (
              <motion.div key="grades" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                {!selectedCourse ? (
                  <EmptyState text="Please select a course to view the gradebook." />
                ) : (
                  <div style={{ background: 'var(--surface)', borderRadius: 16, border: '1px solid var(--border-light)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ padding: '24px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h2 style={{ margin: 0, color: 'var(--text-main)', fontWeight: 800 }}>Gradebook: {selectedCourse.name}</h2>
                        <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: 14 }}>Enter final and internal marks for enrolled students.</p>
                      </div>
                      <button onClick={saveGrades} disabled={saving} style={{ background: 'var(--success)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 8, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s' }}>
                        {saving ? 'Syncing...' : <><CheckSquare size={18} /> Save Grades</>}
                      </button>
                    </div>
                    
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: 'var(--bg-main)' }}>
                          <tr>
                            <th style={{ padding: '16px 24px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 700, fontSize: 13, textTransform: 'uppercase' }}>Student</th>
                            <th style={{ padding: '16px 24px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 700, fontSize: 13, textTransform: 'uppercase' }}>Roll Number</th>
                            <th style={{ padding: '16px 24px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 700, fontSize: 13, textTransform: 'uppercase' }}>Final Marks (100)</th>
                            <th style={{ padding: '16px 24px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 700, fontSize: 13, textTransform: 'uppercase' }}>Internal (40)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedCourse.enrolledStudents && selectedCourse.enrolledStudents.length > 0 ? (
                            selectedCourse.enrolledStudents.map((student, i) => (
                              <tr key={student._id} style={{ borderBottom: '1px solid var(--border-light)', background: i % 2 === 0 ? 'var(--surface)' : 'var(--bg-main)' }}>
                                <td style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-main)' }}>{student.name}</td>
                                <td style={{ padding: '16px 24px', color: 'var(--text-muted)' }}>{student.rollNumber}</td>
                                <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                                  <input 
                                    type="number" 
                                    max="100" min="0"
                                    value={grades[student._id]?.marks || 0}
                                    onChange={(e) => setGrades({...grades, [student._id]: {...grades[student._id], marks: Number(e.target.value)}})}
                                    style={{ width: 80, padding: 8, textAlign: 'center', background: 'var(--surface)', border: '1px solid var(--border-light)', borderRadius: 6, color: 'var(--text-main)', fontWeight: 600, outline: 'none' }}
                                    onFocus={e => e.currentTarget.style.borderColor = 'var(--primary)'} onBlur={e => e.currentTarget.style.borderColor = 'var(--border-light)'}
                                  />
                                </td>
                                <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                                  <input 
                                    type="number" 
                                    max="40" min="0"
                                    value={grades[student._id]?.internal || 0}
                                    onChange={(e) => setGrades({...grades, [student._id]: {...grades[student._id], internal: Number(e.target.value)}})}
                                    style={{ width: 80, padding: 8, textAlign: 'center', background: 'var(--surface)', border: '1px solid var(--border-light)', borderRadius: 6, color: 'var(--text-main)', fontWeight: 600, outline: 'none' }}
                                    onFocus={e => e.currentTarget.style.borderColor = 'var(--primary)'} onBlur={e => e.currentTarget.style.borderColor = 'var(--border-light)'}
                                  />
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="4" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>No students enrolled in this course.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'attendance' && (
              <motion.div key="attendance" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                {!selectedCourse ? (
                  <EmptyState text="Please select a course to mark attendance." />
                ) : (
                  <div style={{ background: 'var(--surface)', borderRadius: 16, border: '1px solid var(--border-light)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ padding: '24px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h2 style={{ margin: 0, color: 'var(--text-main)', fontWeight: 800 }}>Daily Attendance</h2>
                        <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: 14 }}>{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} • {selectedCourse.name}</p>
                      </div>
                      <button onClick={saveAttendance} disabled={saving} style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 8, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s' }}>
                        {saving ? 'Saving...' : <><CheckSquare size={18} /> Submit Register</>}
                      </button>
                    </div>
                    
                    <div style={{ padding: 24 }}>
                      {selectedCourse.enrolledStudents && selectedCourse.enrolledStudents.length > 0 ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 16 }}>
                          {selectedCourse.enrolledStudents.map(student => (
                            <div key={student._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: 'var(--bg-main)', border: '1px solid var(--border-light)', borderRadius: 12 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16 }}>
                                  {student.name.charAt(0)}
                                </div>
                                <div>
                                  <div style={{ color: 'var(--text-main)', fontWeight: 700, fontSize: 15 }}>{student.name}</div>
                                  <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>{student.rollNumber}</div>
                                </div>
                              </div>
                              
                              <div style={{ display: 'flex', gap: 8, background: 'var(--surface)', padding: 4, borderRadius: 8, border: '1px solid var(--border-light)' }}>
                                <button 
                                  onClick={() => setAttendance({...attendance, [student._id]: 'present'})}
                                  style={{ background: attendance[student._id] === 'present' ? 'var(--success)' : 'transparent', color: attendance[student._id] === 'present' ? 'white' : 'var(--text-muted)', border: 'none', padding: '6px 16px', borderRadius: 6, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
                                >
                                  Present
                                </button>
                                <button 
                                  onClick={() => setAttendance({...attendance, [student._id]: 'absent'})}
                                  style={{ background: attendance[student._id] === 'absent' ? 'var(--danger)' : 'transparent', color: attendance[student._id] === 'absent' ? 'white' : 'var(--text-muted)', border: 'none', padding: '6px 16px', borderRadius: 6, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
                                >
                                  Absent
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <EmptyState text="No students enrolled in this course." />
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'analytics' && (
              <motion.div key="analytics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', padding: 100, color: 'var(--text-muted)' }}>
                <div style={{ fontSize: 64, marginBottom: 24 }}>🚧</div>
                <h2 style={{ color: 'var(--text-main)', margin: '0 0 12px 0' }}>Analytics Engine Processing</h2>
                <p>Course performance metrics will be available at the end of the term.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function SidebarButton({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 12, width: '100%',
        padding: '14px 20px', borderRadius: 12, border: 'none', cursor: 'pointer',
        background: active ? 'var(--primary)' : 'transparent',
        color: active ? 'white' : 'var(--text-muted)',
        fontWeight: active ? 700 : 600,
        fontSize: 15,
        transition: 'all 0.2s ease',
        boxShadow: active ? 'var(--shadow-md)' : 'none'
      }}
      onMouseEnter={e => !active && (e.currentTarget.style.background = 'var(--surface-hover)')}
      onMouseLeave={e => !active && (e.currentTarget.style.background = 'transparent')}
    >
      <div style={{ opacity: active ? 1 : 0.7 }}>{icon}</div>
      {label}
    </button>
  );
}

function StatCard({ icon, label, value, color, bg }) {
  return (
    <div style={{ background: 'var(--surface)', borderRadius: 16, border: '1px solid var(--border-light)', padding: 24, display: 'flex', alignItems: 'center', gap: 20 }}>
      <div style={{ width: 56, height: 56, borderRadius: 16, background: bg, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </div>
      <div>
        <div style={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>{label}</div>
        <div style={{ color: 'var(--text-main)', fontSize: 28, fontWeight: 800 }}>{value}</div>
      </div>
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div style={{ background: 'var(--surface)', borderRadius: 16, border: '1px solid var(--border-light)', padding: 80, textAlign: 'center', color: 'var(--text-muted)' }}>
      <AlertCircle size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
      <h3 style={{ margin: '0 0 8px 0', color: 'var(--text-main)', fontSize: 20 }}>Action Required</h3>
      <p style={{ margin: 0 }}>{text}</p>
    </div>
  );
}
