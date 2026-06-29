import { Building2, Users, Shield, ScrollText, Server, Database, Activity } from 'lucide-react';
import StatsCard from '../../components/UI/StatsCard';

const AUDIT_LOGS = [
  { id: 1, user: 'Priya Sharma', role: 'Admin', action: 'Created doctor account', resource: 'Dr. Anjali Verma', time: '5 min ago' },
  { id: 2, user: 'Dr. Anil Mehta', role: 'Doctor', action: 'Updated prescription', resource: 'PRE-3001', time: '12 min ago' },
  { id: 3, user: 'Rahul Verma', role: 'Receptionist', action: 'Booked appointment', resource: 'APT-2008', time: '25 min ago' },
  { id: 4, user: 'Amit Patel', role: 'Lab Tech', action: 'Uploaded report', resource: 'LAB-4002', time: '1 hour ago' },
  { id: 5, user: 'Neha Gupta', role: 'Pharmacist', action: 'Dispensed medicine', resource: 'PRE-3001', time: '2 hours ago' },
  { id: 6, user: 'System', role: 'System', action: 'Low stock alert generated', resource: 'MED-5003', time: '3 hours ago' },
];

export default function SuperAdminDashboard() {
  return (
    <div>
      <div className="page-header"><div><h1>System Administration</h1><p style={{ color: '#718096' }}>Complete system overview and management</p></div></div>

      <div className="grid grid-4" style={{ marginBottom: 24 }}>
        <div className="animate-fade-in-up delay-1"><StatsCard icon={Building2} label="Departments" value={8} color="green" /></div>
        <div className="animate-fade-in-up delay-2"><StatsCard icon={Users} label="Total Users" value={320} trend="up" trendValue="+5" color="blue" /></div>
        <div className="animate-fade-in-up delay-3"><StatsCard icon={Shield} label="Active Sessions" value={45} color="teal" /></div>
        <div className="animate-fade-in-up delay-4"><StatsCard icon={Server} label="System Uptime" value={99} suffix="%" color="mint" /></div>
      </div>

      <div className="grid grid-2">
        <div className="card animate-fade-in-up delay-5">
          <div className="card-header"><h3><ScrollText size={18} style={{ color: '#6EC89B', marginRight: 8 }} />Recent Audit Logs</h3></div>
          <table className="data-table">
            <thead><tr><th>User</th><th>Action</th><th>Resource</th><th>Time</th></tr></thead>
            <tbody>
              {AUDIT_LOGS.map(log => (
                <tr key={log.id}>
                  <td><div style={{ fontWeight: 500 }}>{log.user}</div><div style={{ fontSize: 11, color: '#718096' }}>{log.role}</div></td>
                  <td>{log.action}</td>
                  <td><span className="badge badge-blue">{log.resource}</span></td>
                  <td style={{ fontSize: 12, color: '#718096' }}>{log.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card animate-fade-in-up delay-6">
          <div className="card-header"><h3><Activity size={18} style={{ color: '#6FA8DC', marginRight: 8 }} />System Health</h3></div>
          {[{ label: 'Database', status: 'Healthy', color: '#68D391' }, { label: 'API Server', status: 'Running', color: '#68D391' }, { label: 'AI Service', status: 'Active', color: '#68D391' }, { label: 'File Storage', status: '82% used', color: '#F6AD55' }, { label: 'Backup', status: 'Last: 2h ago', color: '#68D391' }].map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < 4 ? '1px solid #E2E8F0' : 'none' }}>
              <span style={{ fontWeight: 500 }}>{item.label}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: item.color }}></span>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
