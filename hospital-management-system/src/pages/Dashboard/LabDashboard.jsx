import { FlaskConical, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import StatsCard from '../../components/UI/StatsCard';
import StatusBadge from '../../components/UI/StatusBadge';

const TESTS = [
  { id: 'LAB-4005', patient: 'Vijay Kumar', test: 'Lipid Profile', type: 'blood_test', status: 'ordered', priority: 'routine', doctor: 'Dr. Raman Pillai' },
  { id: 'LAB-4007', patient: 'Priyanka Das', test: 'CT Scan - Spine', type: 'ct_scan', status: 'ordered', priority: 'routine', doctor: 'Dr. Priya Nair' },
  { id: 'LAB-4006', patient: 'Mohammed Ali', test: 'Cardiac Markers', type: 'blood_test', status: 'sample_collected', priority: 'urgent', doctor: 'Dr. Anil Mehta' },
  { id: 'LAB-4003', patient: 'Lakshmi Iyer', test: 'Brain MRI', type: 'mri', status: 'testing', priority: 'urgent', doctor: 'Dr. Sanjay Gupta' },
  { id: 'LAB-4001', patient: 'Arjun Reddy', test: 'CBC', type: 'blood_test', status: 'report_generated', priority: 'routine', doctor: 'Dr. Anil Mehta' },
  { id: 'LAB-4002', patient: 'Suresh Babu', test: 'Knee X-Ray', type: 'xray', status: 'reviewed', priority: 'routine', doctor: 'Dr. Priya Nair' },
];

const COLUMNS = [
  { title: 'Ordered', status: 'ordered', color: '#6FA8DC' },
  { title: 'Sample Collected', status: 'sample_collected', color: '#F6AD55' },
  { title: 'Testing', status: 'testing', color: '#6EC89B' },
  { title: 'Report Generated', status: 'report_generated', color: '#68D391' },
];

export default function LabDashboard() {
  return (
    <div>
      <div className="page-header"><div><h1>Laboratory Dashboard</h1><p style={{ color: '#718096' }}>Lab Technician — Amit Patel</p></div></div>

      <div className="grid grid-4" style={{ marginBottom: 24 }}>
        <div className="animate-fade-in-up delay-1"><StatsCard icon={AlertCircle} label="Pending" value={2} color="blue" /></div>
        <div className="animate-fade-in-up delay-2"><StatsCard icon={Clock} label="In Progress" value={2} color="teal" /></div>
        <div className="animate-fade-in-up delay-3"><StatsCard icon={CheckCircle} label="Completed Today" value={8} color="green" /></div>
        <div className="animate-fade-in-up delay-4"><StatsCard icon={FlaskConical} label="Total Tests" value={156} color="mint" /></div>
      </div>

      <div className="card animate-fade-in-up delay-5">
        <div className="card-header"><h3>Test Workflow</h3></div>
        <div className="kanban-board">
          {COLUMNS.map(col => {
            const items = TESTS.filter(t => t.status === col.status);
            return (
              <div className="kanban-column" key={col.status}>
                <div className="kanban-column-header">
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: col.color }}></span>
                    {col.title}
                  </h4>
                  <span className="kanban-column-count">{items.length}</span>
                </div>
                {items.map(test => (
                  <div key={test.id} className={`kanban-card priority-${test.priority === 'urgent' ? 'high' : 'low'}`}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontWeight: 600, fontSize: 13 }}>{test.test}</span>
                      <span className="badge badge-gray" style={{ fontSize: 10 }}>{test.id}</span>
                    </div>
                    <div style={{ fontSize: 12, color: '#718096' }}>{test.patient}</div>
                    <div style={{ fontSize: 11, color: '#A0AEC0', marginTop: 4 }}>{test.doctor}</div>
                    {test.priority === 'urgent' && <span className="badge badge-red" style={{ marginTop: 6 }}>Urgent</span>}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
