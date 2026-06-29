import { useState, useEffect } from 'react';
import { Users, Search, Plus, Eye, Edit } from 'lucide-react';
import { patientsApi } from '../../services/api';
import StatusBadge from '../../components/UI/StatusBadge';

export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => { patientsApi.getAll().then(({ data }) => setPatients(data)); }, []);

  const filtered = patients.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.id.includes(search));

  return (
    <div>
      <div className="page-header">
        <div><h1>Patient Management</h1><p style={{ color: '#718096' }}>{patients.length} registered patients</p></div>
        <button className="btn btn-primary"><Plus size={16} /> Add Patient</button>
      </div>

      <div className="card animate-fade-in-up">
        <div className="data-table-header" style={{ border: 'none', padding: 0, marginBottom: 16 }}>
          <div className="header-search" style={{ maxWidth: 400, margin: 0 }}>
            <Search size={18} />
            <input type="text" placeholder="Search patients by name or ID..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr><th>Patient ID</th><th>Name</th><th>Age</th><th>Gender</th><th>Blood Group</th><th>Department</th><th>Last Visit</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td><span className="badge badge-green">{p.id}</span></td>
                  <td style={{ fontWeight: 500 }}>{p.name}</td>
                  <td>{p.age}</td>
                  <td>{p.gender}</td>
                  <td><span className="badge badge-blue">{p.bloodGroup}</span></td>
                  <td>{p.department}</td>
                  <td style={{ color: '#718096' }}>{p.lastVisit}</td>
                  <td>
                    <div className="flex gap-sm">
                      <button className="btn btn-ghost btn-icon" title="View"><Eye size={16} /></button>
                      <button className="btn btn-ghost btn-icon" title="Edit"><Edit size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
