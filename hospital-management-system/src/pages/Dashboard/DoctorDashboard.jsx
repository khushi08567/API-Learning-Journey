import { Users, CalendarCheck, FileText, FlaskConical, ClipboardList, Sparkles } from 'lucide-react';
import StatsCard from '../../components/UI/StatsCard';
import StatusBadge from '../../components/UI/StatusBadge';

const TODAYS_PATIENTS = [
  { id: 'APT-2001', patient: 'Arjun Reddy', age: 34, time: '09:00 AM', symptoms: 'Chest pain, breathlessness', status: 'confirmed' },
  { id: 'APT-2002', patient: 'Ravi Shankar', age: 60, time: '10:00 AM', symptoms: 'Follow-up BP check', status: 'in_consultation' },
  { id: 'APT-2005', patient: 'Mohammed Ali', age: 48, time: '11:00 AM', symptoms: 'Palpitations', status: 'requested' },
  { id: 'APT-2010', patient: 'Vijay Kumar', age: 52, time: '02:00 PM', symptoms: 'Routine cardiac checkup', status: 'confirmed' },
];

const RECENT_PRESCRIPTIONS = [
  { id: 'PRE-3001', patient: 'Arjun Reddy', diagnosis: 'Hypertension', date: '2026-06-20', medicines: 2 },
  { id: 'PRE-3004', patient: 'Ravi Shankar', diagnosis: 'Angina Pectoris', date: '2026-06-19', medicines: 2 },
];

export default function DoctorDashboard() {
  return (
    <div>
      <div className="page-header"><div><h1>Doctor Dashboard</h1><p style={{ color: '#718096' }}>Dr. Anil Mehta — Cardiology</p></div>
        <button className="btn btn-primary"><Sparkles size={16} /> AI Summarize</button>
      </div>

      <div className="grid grid-4" style={{ marginBottom: 24 }}>
        <div className="animate-fade-in-up delay-1"><StatsCard icon={CalendarCheck} label="Today's Patients" value={4} color="green" /></div>
        <div className="animate-fade-in-up delay-2"><StatsCard icon={Users} label="Total Patients" value={120} color="blue" /></div>
        <div className="animate-fade-in-up delay-3"><StatsCard icon={FileText} label="Prescriptions" value={48} color="teal" /></div>
        <div className="animate-fade-in-up delay-4"><StatsCard icon={FlaskConical} label="Pending Reports" value={3} color="mint" /></div>
      </div>

      <div className="grid grid-2">
        <div className="card animate-fade-in-up delay-5">
          <div className="card-header"><h3><CalendarCheck size={18} style={{ color: '#6EC89B', marginRight: 8 }} />Today's Queue</h3></div>
          {TODAYS_PATIENTS.map((p, i) => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: i < TODAYS_PATIENTS.length - 1 ? '1px solid #E2E8F0' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #A8D5BA, #A8C8E8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600, fontSize: 14 }}>
                  {p.patient.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>{p.patient}</div>
                  <div style={{ fontSize: 12, color: '#718096' }}>{p.symptoms}</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{p.time}</div>
                <StatusBadge status={p.status} />
              </div>
            </div>
          ))}
        </div>

        <div className="card animate-fade-in-up delay-6">
          <div className="card-header"><h3><ClipboardList size={18} style={{ color: '#6FA8DC', marginRight: 8 }} />Recent Prescriptions</h3></div>
          {RECENT_PRESCRIPTIONS.map((p, i) => (
            <div key={p.id} style={{ padding: '14px 0', borderBottom: i < RECENT_PRESCRIPTIONS.length - 1 ? '1px solid #E2E8F0' : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontWeight: 600 }}>{p.patient}</span>
                <span className="badge badge-green">{p.id}</span>
              </div>
              <div style={{ fontSize: 13, color: '#718096' }}>{p.diagnosis} • {p.medicines} medicines • {p.date}</div>
            </div>
          ))}
          <button className="btn btn-outline w-full" style={{ marginTop: 16 }}>View All Prescriptions</button>
        </div>
      </div>
    </div>
  );
}
