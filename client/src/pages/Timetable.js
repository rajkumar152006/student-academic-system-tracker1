import React, { useEffect, useState } from 'react';
import axios from '../utils/api';
import { motion } from 'framer-motion';
import { Calendar, Clock, BookOpen, AlertCircle } from 'lucide-react';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const DAY_LABELS = { monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed', thursday: 'Thu', friday: 'Fri', saturday: 'Sat' };
const PERIOD_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#f97316', '#14b8a6'];

export default function Timetable({ student }) {
  const [timetable, setTimetable] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const today = new Date();
  const currentDay = DAYS[today.getDay() - 1]; // Monday=1

  useEffect(() => {
    fetchTimetable();
  }, [student]);

  const fetchTimetable = async () => {
    if (!student?._id) return;
    try {
      setLoading(true);
      const classesRes = await axios.get('/api/classes');
      // Find the class that has this student enrolled
      const myClass = classesRes.data.find(c =>
        c.students && c.students.some(s => (s._id || s) === student._id)
      );
      setTimetable(myClass ? myClass.timetable : null);
    } catch (err) {
      console.error('Timetable fetch error:', err);
      setError('Could not retrieve your class schedule.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>
        <Calendar size={48} style={{ opacity: 0.4, marginBottom: 16 }} />
        <p>Loading your schedule...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>
        <AlertCircle size={48} style={{ opacity: 0.4, marginBottom: 16, color: 'var(--danger)' }} />
        <p>{error}</p>
      </div>
    );
  }

  const demoTimetable = {
    monday:    [{ period: 1, startTime: '09:00', endTime: '10:00', course: { name: 'Data Structures' } }, { period: 2, startTime: '10:00', endTime: '11:00', course: { name: 'Discrete Math' } }, { period: 3, startTime: '11:15', endTime: '12:15', course: { name: 'Operating Systems' } }],
    tuesday:   [{ period: 1, startTime: '09:00', endTime: '10:00', course: { name: 'Database Systems' } }, { period: 2, startTime: '10:00', endTime: '11:00', course: { name: 'Computer Networks' } }],
    wednesday: [{ period: 1, startTime: '09:00', endTime: '10:00', course: { name: 'Data Structures' } }, { period: 2, startTime: '11:15', endTime: '12:15', course: { name: 'ML Lab' } }, { period: 3, startTime: '14:00', endTime: '15:00', course: { name: 'Algorithms' } }],
    thursday:  [{ period: 1, startTime: '09:00', endTime: '10:00', course: { name: 'Database Systems' } }, { period: 2, startTime: '10:00', endTime: '11:00', course: { name: 'Soft Skills' } }],
    friday:    [{ period: 1, startTime: '09:00', endTime: '10:00', course: { name: 'Operating Systems' } }, { period: 2, startTime: '11:15', endTime: '12:15', course: { name: 'Computer Networks' } }, { period: 3, startTime: '14:00', endTime: '16:00', course: { name: 'Project Review' } }],
    saturday:  [],
  };

  const displayTimetable = timetable || demoTimetable;
  const todaySchedule = displayTimetable[currentDay] || [];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '24px 0' }}>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: 'var(--text-main)' }}>Class Schedule</h2>
        <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)' }}>
          {!timetable && <span style={{ background: 'var(--warning-bg)', color: 'var(--warning)', padding: '2px 8px', borderRadius: 4, fontSize: 12, fontWeight: 600, marginRight: 8 }}>DEMO</span>}
          Weekly timetable for current academic term.
        </p>
      </div>

      {/* Today's Schedule Highlight */}
      {todaySchedule.length > 0 && (
        <div style={{ background: 'var(--primary)', borderRadius: 16, padding: 24, marginBottom: 32, color: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Clock size={20} />
            <span style={{ fontWeight: 800, fontSize: 16 }}>Today's Schedule</span>
            <span style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700, textTransform: 'capitalize' }}>{currentDay}</span>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {todaySchedule.map((slot, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: '10px 16px' }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{slot.course?.name || slot.course || ' Subject'}</div>
                <div style={{ fontSize: 12, opacity: 0.85, marginTop: 2 }}>{slot.startTime} - {slot.endTime}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full Weekly Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
        {DAYS.map(day => {
          const slots = displayTimetable[day] || [];
          const isToday = day === currentDay;
          return (
            <div key={day} style={{ background: 'var(--surface)', borderRadius: 14, border: isToday ? '2px solid var(--primary)' : '1px solid var(--border-light)', overflow: 'hidden', boxShadow: isToday ? '0 0 0 3px rgba(14, 165, 233, 0.1)' : 'var(--shadow-sm)' }}>
              <div style={{ padding: '14px 18px', background: isToday ? 'var(--primary)' : 'var(--bg-main)', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 800, color: isToday ? 'white' : 'var(--text-main)', textTransform: 'capitalize', fontSize: 15 }}>{day}</span>
                {isToday && <span style={{ background: 'rgba(255,255,255,0.2)', color: 'white', padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 700 }}>TODAY</span>}
                {!isToday && <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{slots.length} periods</span>}
              </div>
              <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {slots.length > 0 ? (
                  slots.map((slot, i) => (
                    <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <div style={{ width: 4, borderRadius: 2, background: PERIOD_COLORS[i % PERIOD_COLORS.length], flexShrink: 0, minHeight: 40 }} />
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)' }}>{slot.course?.name || slot.course || 'Subject'}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{slot.startTime} – {slot.endTime}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '12px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>No classes today</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
