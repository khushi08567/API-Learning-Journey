import { useState, useEffect } from 'react';
import { Stethoscope, Search, Star, MapPin } from 'lucide-react';
import { doctorsApi } from '../../services/api';

export default function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => { doctorsApi.getAll().then(({ data }) => setDoctors(data)); }, []);

  const filtered = doctors.filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.department.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="page-header">
        <div><h1>Doctors</h1><p style={{ color: '#718096' }}>{doctors.length} doctors across all departments</p></div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <div className="header-search" style={{ maxWidth: 400, margin: 0 }}>
          <Search size={18} />
          <input type="text" placeholder="Search by name, department..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-auto">
        {filtered.map((d, i) => (
          <div key={d.id} className="card animate-fade-in-up" style={{ animationDelay: `${i * 0.08}s`, textAlign: 'center', padding: 24 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #A8D5BA, #A8C8E8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 24, fontWeight: 700, margin: '0 auto 12px' }}>
              {d.name.split(' ').slice(1).map(n => n[0]).join('')}
            </div>
            <h4 style={{ marginBottom: 4 }}>{d.name}</h4>
            <p style={{ fontSize: 13, color: '#6EC89B', fontWeight: 500, marginBottom: 4 }}>{d.specialization}</p>
            <p style={{ fontSize: 12, color: '#718096', marginBottom: 12 }}><MapPin size={12} style={{ verticalAlign: 'middle' }} /> {d.department}</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 12, fontSize: 13 }}>
              <span>{d.experience} yrs exp</span>
              <span><Star size={13} style={{ color: '#F6AD55', verticalAlign: 'middle' }} /> {d.rating}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, padding: '8px 0', borderTop: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: 13, color: '#718096' }}>Fee: <strong>₹{d.fee}</strong></span>
              <span className={`badge ${d.available ? 'badge-green' : 'badge-red'}`}>{d.available ? 'Available' : 'Busy'}</span>
            </div>
            <button className="btn btn-outline btn-sm w-full">View Schedule</button>
          </div>
        ))}
      </div>
    </div>
  );
}
