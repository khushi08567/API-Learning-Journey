import { HeartPulse, Users, Activity, Thermometer, ClipboardCheck } from 'lucide-react';
import StatsCard from '../../components/UI/StatsCard';

const ASSIGNED_PATIENTS = [
  { id: 1, name: 'Arjun Reddy', room: 'ICU-3', bed: 'B2', vitals: { bp: '130/85', pulse: 78, temp: '98.6°F', spo2: '97%' }, lastUpdate: '30 min ago' },
  { id: 2, name: 'Ravi Shankar', room: 'Ward-A', bed: 'B5', vitals: { bp: '145/90', pulse: 82, temp: '99.1°F', spo2: '96%' }, lastUpdate: '1 hour ago' },
  { id: 3, name: 'Mohammed Ali', room: 'ICU-1', bed: 'B1', vitals: { bp: '120/80', pulse: 72, temp: '98.4°F', spo2: '98%' }, lastUpdate: '2 hours ago' },
];

export default function NurseDashboard() {
  return (
    <div>
      <div className="page-header"><div><h1>Nurse Dashboard</h1><p style={{ color: '#718096' }}>Sita Devi — General Ward</p></div></div>

      <div className="grid grid-3" style={{ marginBottom: 24 }}>
        <div className="animate-fade-in-up delay-1"><StatsCard icon={Users} label="Assigned Patients" value={3} color="green" /></div>
        <div className="animate-fade-in-up delay-2"><StatsCard icon={ClipboardCheck} label="Tasks Completed" value={12} color="blue" /></div>
        <div className="animate-fade-in-up delay-3"><StatsCard icon={Activity} label="Vitals Recorded" value={8} color="teal" /></div>
      </div>

      <div className="card animate-fade-in-up delay-4">
        <div className="card-header"><h3><HeartPulse size={18} style={{ color: '#6EC89B', marginRight: 8 }} />Patient Vitals</h3></div>
        {ASSIGNED_PATIENTS.map((p, i) => (
          <div key={p.id} style={{ padding: 16, border: '1px solid #E2E8F0', borderRadius: 12, marginBottom: 12, background: i === 0 ? '#FFF5F5' : '#FAFFFE' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <div><span style={{ fontWeight: 600 }}>{p.name}</span><span style={{ fontSize: 12, color: '#718096', marginLeft: 8 }}>{p.room} • Bed {p.bed}</span></div>
              <span style={{ fontSize: 12, color: '#A0AEC0' }}>Updated {p.lastUpdate}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              {[{ label: 'Blood Pressure', value: p.vitals.bp, icon: '🩸' }, { label: 'Pulse', value: `${p.vitals.pulse} bpm`, icon: '💓' }, { label: 'Temperature', value: p.vitals.temp, icon: '🌡️' }, { label: 'SpO2', value: p.vitals.spo2, icon: '💨' }].map((v, j) => (
                <div key={j} style={{ padding: 10, background: '#F8FAFB', borderRadius: 8, textAlign: 'center' }}>
                  <div style={{ fontSize: 20 }}>{v.icon}</div>
                  <div style={{ fontSize: 12, color: '#718096', marginTop: 4 }}>{v.label}</div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{v.value}</div>
                </div>
              ))}
            </div>
            <button className="btn btn-outline btn-sm" style={{ marginTop: 12 }}><Thermometer size={14} /> Update Vitals</button>
          </div>
        ))}
      </div>
    </div>
  );
}
