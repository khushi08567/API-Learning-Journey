import { CalendarCheck, Users, UserPlus, Stethoscope, Search, Clock } from 'lucide-react';
import StatsCard from '../../components/UI/StatsCard';
import StatusBadge from '../../components/UI/StatusBadge';

const SCHEDULE = [
  { time: '09:00 AM', patient: 'Arjun Reddy', doctor: 'Dr. Anil Mehta', dept: 'Cardiology', status: 'confirmed' },
  { time: '09:30 AM', patient: 'Meera Krishnan', doctor: 'Dr. Vikram Joshi', dept: 'Dermatology', status: 'in_consultation' },
  { time: '10:00 AM', patient: 'Suresh Babu', doctor: 'Dr. Priya Nair', dept: 'Orthopedics', status: 'requested' },
  { time: '10:30 AM', patient: 'Lakshmi Iyer', doctor: 'Dr. Sanjay Gupta', dept: 'Neurology', status: 'confirmed' },
  { time: '11:00 AM', patient: 'Ravi Shankar', doctor: 'Dr. Anil Mehta', dept: 'Cardiology', status: 'confirmed' },
];

const DOCTORS = [
  { name: 'Dr. Anil Mehta', dept: 'Cardiology', available: true, patients: 3 },
  { name: 'Dr. Sanjay Gupta', dept: 'Neurology', available: true, patients: 2 },
  { name: 'Dr. Priya Nair', dept: 'Orthopedics', available: true, patients: 1 },
  { name: 'Dr. Vikram Joshi', dept: 'Dermatology', available: false, patients: 0 },
  { name: 'Dr. Rekha Sharma', dept: 'Pediatrics', available: true, patients: 4 },
];

export default function ReceptionistDashboard() {
  return (
    <div>
      <div className="page-header"><div><h1>Reception Dashboard</h1><p style={{ color: '#718096' }}>Front Desk — Rahul Verma</p></div>
        <div className="flex gap-sm"><button className="btn btn-outline"><UserPlus size={16} /> Register Patient</button><button className="btn btn-primary"><CalendarCheck size={16} /> New Appointment</button></div>
      </div>

      <div className="grid grid-3" style={{ marginBottom: 24 }}>
        <div className="animate-fade-in-up delay-1"><StatsCard icon={CalendarCheck} label="Today's Appointments" value={48} color="green" /></div>
        <div className="animate-fade-in-up delay-2"><StatsCard icon={Users} label="Walk-ins Today" value={12} color="blue" /></div>
        <div className="animate-fade-in-up delay-3"><StatsCard icon={Clock} label="Avg Wait Time" value={18} suffix=" min" color="teal" /></div>
      </div>

      <div className="grid grid-2">
        <div className="card animate-fade-in-up delay-4">
          <div className="card-header"><h3><CalendarCheck size={18} style={{ color: '#6EC89B', marginRight: 8 }} />Today's Schedule</h3></div>
          <table className="data-table">
            <thead><tr><th>Time</th><th>Patient</th><th>Doctor</th><th>Status</th></tr></thead>
            <tbody>
              {SCHEDULE.map((s, i) => (
                <tr key={i}><td style={{ fontWeight: 500 }}>{s.time}</td><td>{s.patient}</td><td>{s.doctor}</td><td><StatusBadge status={s.status} /></td></tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card animate-fade-in-up delay-5">
          <div className="card-header"><h3><Stethoscope size={18} style={{ color: '#6FA8DC', marginRight: 8 }} />Doctor Availability</h3></div>
          {DOCTORS.map((d, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < DOCTORS.length - 1 ? '1px solid #E2E8F0' : 'none' }}>
              <div><div style={{ fontWeight: 500 }}>{d.name}</div><div style={{ fontSize: 12, color: '#718096' }}>{d.dept}</div></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="badge badge-gray">{d.patients} patients</span>
                <span className={`badge ${d.available ? 'badge-green' : 'badge-red'}`}>{d.available ? 'Available' : 'Busy'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
