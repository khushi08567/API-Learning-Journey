import { useState, useEffect } from 'react';
import { Calendar, Search, Plus, Clock, Filter } from 'lucide-react';
import { appointmentsApi } from '../../services/api';
import StatusBadge from '../../components/UI/StatusBadge';

export default function AppointmentCalendar() {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => { appointmentsApi.getAll().then(({ data }) => setAppointments(data)); }, []);

  const filtered = filter === 'all' ? appointments : appointments.filter(a => a.status === filter);

  return (
    <div>
      <div className="page-header">
        <div><h1>Appointments</h1><p style={{ color: '#718096' }}>{appointments.length} total appointments</p></div>
        <button className="btn btn-primary"><Plus size={16} /> New Appointment</button>
      </div>

      <div className="card animate-fade-in-up" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          {['all', 'requested', 'confirmed', 'in_consultation', 'completed', 'cancelled'].map(s => (
            <button key={s} className={`btn ${filter === s ? 'btn-primary' : 'btn-outline'} btn-sm`} onClick={() => setFilter(s)}>
              {s === 'all' ? 'All' : s.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead><tr><th>ID</th><th>Patient</th><th>Doctor</th><th>Department</th><th>Date</th><th>Time</th><th>Type</th><th>Status</th></tr></thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id}>
                  <td><span className="badge badge-blue">{a.id}</span></td>
                  <td style={{ fontWeight: 500 }}>{a.patientName}</td>
                  <td>{a.doctorName}</td>
                  <td>{a.department}</td>
                  <td>{a.date}</td>
                  <td><Clock size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />{a.time}</td>
                  <td><span className="badge badge-gray">{a.type}</span></td>
                  <td><StatusBadge status={a.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
