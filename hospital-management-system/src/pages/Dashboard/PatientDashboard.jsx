import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, FileText, Download, CalendarPlus, Sparkles, Pill, FlaskConical, HeartPulse, Check, Clock, AlertTriangle } from 'lucide-react';

const UPCOMING = [
  { id: 1, doctor: 'Dr. Anil Mehta', dept: 'Cardiology', date: 'June 26, 2026', time: '09:00 AM', status: 'confirmed' },
  { id: 2, doctor: 'Dr. Raman Pillai', dept: 'General Medicine', date: 'July 2, 2026', time: '10:30 AM', status: 'requested' },
];

const PRESCRIPTIONS = [
  { id: 'PRE-3001', doctor: 'Dr. Anil Mehta', diagnosis: 'Hypertension', date: 'June 20', medicines: ['Amlodipine 5mg', 'Aspirin 75mg'] },
];

const REPORTS = [
  { id: 1, name: 'Complete Blood Count', date: 'June 20', type: 'Lab Report', status: 'Ready' },
  { id: 2, name: 'ECG Report', date: 'June 19', type: 'Cardiology', status: 'Ready' },
];

const BODY_SECTORS = [
  { id: 'head', name: 'Head & Brain', icon: '🧠', symptoms: ['Chronic migraines', 'Dizziness', 'Frontal headaches'], dept: 'Neurology', doctor: 'Dr. Sanjay Gupta' },
  { id: 'chest', name: 'Chest & Heart', icon: '🫁', symptoms: ['Angina / Chest Pain', 'Palpitations', 'Shortness of breath'], dept: 'Cardiology', doctor: 'Dr. Anil Mehta' },
  { id: 'abdomen', name: 'Abdomen & Stomach', icon: '🍕', symptoms: ['Acute abdominal pain', 'Nausea / vomiting', 'Acid reflux'], dept: 'General Medicine', doctor: 'Dr. Raman Pillai' },
  { id: 'joints', name: 'Joints & Bones', icon: '🦴', symptoms: ['Joint stiffness', 'Distal fractures', 'Knee arthritis'], dept: 'Orthopedics', doctor: 'Dr. Priya Nair' }
];

export default function PatientDashboard() {
  const navigate = useNavigate();

  // --- Symptom Body Map ---
  const [selectedBodyPart, setSelectedBodyPart] = useState(BODY_SECTORS[0]);

  // --- Smart Pill Checklist ---
  const [pills, setPills] = useState([
    { id: 1, name: 'Amlodipine (5mg)', time: 'Morning (08:00 AM)', status: 'taken' },
    { id: 2, name: 'Aspirin (75mg)', time: 'Afternoon (01:00 PM)', status: 'taken' },
    { id: 3, name: 'Metformin (500mg)', time: 'Evening (08:00 PM)', status: 'pending' }
  ]);

  const togglePill = (id) => {
    setPills(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, status: p.status === 'taken' ? 'pending' : 'taken' };
      }
      return p;
    }));
  };

  const takenCount = pills.filter(p => p.status === 'taken').length;
  const complianceScore = Math.round((takenCount / pills.length) * 100);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>My Health Dashboard</h1>
          <p style={{ color: '#718096', marginTop: 4 }}>Welcome back, Arjun Reddy! Here is your health profile overview.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/book-appointment')}>
          <CalendarPlus size={16} /> Book Appointment
        </button>
      </div>

      {/* Grid: Upcoming Appointments & AI Wait-Time */}
      <div className="grid grid-2" style={{ marginBottom: 24 }}>
        <div className="card animate-fade-in-up delay-1">
          <div className="card-header">
            <h3><Calendar size={18} style={{ color: '#6EC89B', marginRight: 8 }} />Upcoming Appointments</h3>
          </div>
          {UPCOMING.map((apt, i) => (
            <div key={apt.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: i < UPCOMING.length - 1 ? '1px solid #E2E8F0' : 'none' }}>
              <div>
                <div style={{ fontWeight: 600 }}>{apt.doctor}</div>
                <div style={{ fontSize: 12, color: '#718096' }}>{apt.dept} • {apt.date} • {apt.time}</div>
              </div>
              <span className={`status-badge status-${apt.status}`}>{apt.status}</span>
            </div>
          ))}
        </div>

        <div className="card animate-fade-in-up delay-2" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}><Clock size={18} style={{ color: '#6FA8DC' }} /> AI Queue Wait-Time</h3>
            <p style={{ fontSize: 13, color: '#718096', margin: '8px 0 12px' }}>
              Current outpatient queue wait-time at cardiology is **18 minutes**. There are **3 patients** ahead of you.
            </p>
            <div style={{ background: '#FFFDF5', padding: '8px 12px', borderRadius: 8, border: '1px solid #FEEBC8', display: 'flex', gap: 6, alignItems: 'center' }}>
              <AlertTriangle size={14} style={{ color: '#DD6B20', flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: '#744210' }}>Normal patient traffic conditions.</span>
            </div>
          </div>
          <div style={{ width: 100, height: 100, borderRadius: '50%', border: '6px solid #E2E8F0', borderTopColor: '#6EC89B', borderRightColor: '#6FA8DC', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginLeft: 16 }}>
            <span style={{ fontSize: 20, fontWeight: 700 }}>18m</span>
            <span style={{ fontSize: 9, color: '#A0AEC0' }}>Wait</span>
          </div>
        </div>
      </div>

      {/* Grid: Anatomy Symptom Locator & Pill Compliance */}
      <div className="grid grid-2" style={{ marginBottom: 24 }}>
        {/* Anatomy Locator */}
        <div className="card animate-fade-in-up delay-3">
          <div className="card-header">
            <h3>🤖 Interactive Symptom Body Map</h3>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ position: 'relative', width: 100, height: 200, background: '#F8FAFB', border: '1px solid #E2E8F0', borderRadius: 12, display: 'flex', justifyContent: 'center', padding: '10px 0' }}>
              <svg viewBox="0 0 100 220" width="100%" height="100%">
                <circle cx="50" cy="25" r="15" fill={selectedBodyPart.id === 'head' ? '#A8D5BA' : '#CBD5E0'} stroke="#718096" strokeWidth="1.5" style={{ cursor: 'pointer' }} onClick={() => setSelectedBodyPart(BODY_SECTORS[0])} />
                <rect x="47" y="40" width="6" height="10" fill="#CBD5E0" />
                <rect x="35" y="50" width="30" height="50" rx="5" fill={selectedBodyPart.id === 'chest' ? '#A8C8E8' : '#CBD5E0'} stroke="#718096" strokeWidth="1.5" style={{ cursor: 'pointer' }} onClick={() => setSelectedBodyPart(BODY_SECTORS[1])} />
                <rect x="35" y="100" width="30" height="35" rx="3" fill={selectedBodyPart.id === 'abdomen' ? '#FFE0B2' : '#CBD5E0'} stroke="#718096" strokeWidth="1.5" style={{ cursor: 'pointer' }} onClick={() => setSelectedBodyPart(BODY_SECTORS[2])} />
                <path d="M 30,52 L 15,110" stroke="#718096" strokeWidth="8" strokeLinecap="round" fill="none" />
                <path d="M 70,52 L 85,110" stroke="#718096" strokeWidth="8" strokeLinecap="round" fill="none" />
                <path d="M 40,135 L 40,200" stroke={selectedBodyPart.id === 'joints' ? '#E8D5E8' : '#718096'} strokeWidth="10" strokeLinecap="round" fill="none" style={{ cursor: 'pointer' }} onClick={() => setSelectedBodyPart(BODY_SECTORS[3])} />
                <path d="M 60,135 L 60,200" stroke={selectedBodyPart.id === 'joints' ? '#E8D5E8' : '#718096'} strokeWidth="10" strokeLinecap="round" fill="none" style={{ cursor: 'pointer' }} onClick={() => setSelectedBodyPart(BODY_SECTORS[3])} />
              </svg>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '0 0 6px' }}>
                  <span style={{ fontSize: 20 }}>{selectedBodyPart.icon}</span> {selectedBodyPart.name} Symptoms
                </h4>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 12 }}>
                  {selectedBodyPart.symptoms.map((s, idx) => (
                    <span key={idx} className="badge badge-gray" style={{ fontSize: 10 }}>{s}</span>
                  ))}
                </div>
                <div style={{ background: '#FAFFFE', padding: '8px 10px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: '0.8rem' }}>
                  <div>Recommended: <strong>{selectedBodyPart.dept}</strong></div>
                  <div>Consult: {selectedBodyPart.doctor}</div>
                </div>
              </div>
              <button className="btn btn-outline btn-sm w-full" onClick={() => navigate('/book-appointment')}>
                Book Clinic Referral
              </button>
            </div>
          </div>
        </div>

        {/* Pill Checklist */}
        <div className="card animate-fade-in-up delay-4" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="card-header">
              <h3><Pill size={18} style={{ color: '#6FA8DC', marginRight: 8 }} />Smart Pill Tracker</h3>
              <span className="badge badge-green">Taken: {complianceScore}%</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
              {pills.map(p => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', border: '1px solid #E2E8F0', borderRadius: 8, background: p.status === 'taken' ? '#F0FFF4' : '#fff' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13, textDecoration: p.status === 'taken' ? 'line-through' : 'none', color: p.status === 'taken' ? '#718096' : '#2D3748' }}>{p.name}</div>
                    <div style={{ fontSize: 10, color: '#A0AEC0' }}>{p.time}</div>
                  </div>
                  <button className={`btn btn-sm ${p.status === 'taken' ? 'btn-primary' : 'btn-outline'}`} style={{ padding: '2px 6px', fontSize: 10 }} onClick={() => togglePill(p.id)}>
                    {p.status === 'taken' ? <Check size={10} /> : 'Mark Taken'}
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <div style={{ width: '100%', height: 6, background: '#E2E8F0', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: `${complianceScore}%`, height: '100%', background: '#6EC89B', transition: 'width 0.3s' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Prescriptions & Reports */}
      <div className="grid grid-2" style={{ marginBottom: 24 }}>
        <div className="card animate-fade-in-up delay-5">
          <div className="card-header"><h3><Pill size={18} style={{ color: '#6FA8DC', marginRight: 8 }} />Recent Prescriptions</h3></div>
          {PRESCRIPTIONS.map(p => (
            <div key={p.id} style={{ padding: '10px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontWeight: 600 }}>{p.diagnosis}</span><span className="badge badge-green">{p.id}</span>
              </div>
              <div style={{ fontSize: 12, color: '#718096' }}>{p.doctor} • {p.date}</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                {p.medicines.map((m, i) => <span key={i} className="badge badge-blue">{m}</span>)}
              </div>
            </div>
          ))}
        </div>

        <div className="card animate-fade-in-up delay-6">
          <div className="card-header"><h3><FlaskConical size={18} style={{ color: '#6EC89B', marginRight: 8 }} />My Reports</h3></div>
          <table className="data-table">
            <thead><tr><th>Report</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {REPORTS.map(r => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 500 }}>{r.name}</td>
                  <td>{r.date}</td>
                  <td><span className="badge badge-green">Ready</span></td>
                  <td><button className="btn btn-outline btn-sm"><Download size={14} /> Download</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
