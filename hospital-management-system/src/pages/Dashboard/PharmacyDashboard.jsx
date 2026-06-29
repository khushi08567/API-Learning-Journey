import { Pill, AlertTriangle, CheckCircle, Package, ClipboardList } from 'lucide-react';
import StatsCard from '../../components/UI/StatsCard';

const PENDING_RX = [
  { id: 'PRE-3002', patient: 'Meera Krishnan', doctor: 'Dr. Vikram Joshi', medicines: ['Betamethasone Cream 0.1%'], time: '20 min ago' },
  { id: 'PRE-3005', patient: 'Ananya Patel', doctor: 'Dr. Raman Pillai', medicines: ['Paracetamol 500mg', 'Cetirizine 10mg'], time: '1 hour ago' },
];

const LOW_STOCK = [
  { name: 'Amlodipine 5mg', stock: 45, reorder: 50, status: 'critical' },
  { name: 'Betamethasone Cream', stock: 25, reorder: 30, status: 'low' },
];

const RECENT = [
  { id: 1, patient: 'Arjun Reddy', medicines: 'Amlodipine, Aspirin', time: '2 hours ago' },
  { id: 2, patient: 'Suresh Babu', medicines: 'Diclofenac, Calcium+D', time: '4 hours ago' },
  { id: 3, patient: 'Ravi Shankar', medicines: 'Nitroglycerin, Metoprolol', time: '5 hours ago' },
];

export default function PharmacyDashboard() {
  return (
    <div>
      <div className="page-header"><div><h1>Pharmacy Dashboard</h1><p style={{ color: '#718096' }}>Pharmacist — Neha Gupta</p></div></div>

      <div className="grid grid-4" style={{ marginBottom: 24 }}>
        <div className="animate-fade-in-up delay-1"><StatsCard icon={ClipboardList} label="Pending Rx" value={2} color="blue" /></div>
        <div className="animate-fade-in-up delay-2"><StatsCard icon={CheckCircle} label="Dispensed Today" value={15} color="green" /></div>
        <div className="animate-fade-in-up delay-3"><StatsCard icon={AlertTriangle} label="Low Stock Items" value={2} color="teal" /></div>
        <div className="animate-fade-in-up delay-4"><StatsCard icon={Package} label="Total Medicines" value={248} color="mint" /></div>
      </div>

      <div className="grid grid-2">
        <div className="card animate-fade-in-up delay-5">
          <div className="card-header"><h3><ClipboardList size={18} style={{ color: '#6EC89B', marginRight: 8 }} />Pending Prescriptions</h3></div>
          {PENDING_RX.map(rx => (
            <div key={rx.id} style={{ padding: 14, border: '1px solid #E2E8F0', borderRadius: 12, marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontWeight: 600 }}>{rx.patient}</span><span className="badge badge-blue">{rx.id}</span>
              </div>
              <div style={{ fontSize: 12, color: '#718096', marginBottom: 8 }}>{rx.doctor} • {rx.time}</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                {rx.medicines.map((m, i) => <span key={i} className="badge badge-teal">{m}</span>)}
              </div>
              <button className="btn btn-primary btn-sm">Verify & Dispense</button>
            </div>
          ))}
        </div>

        <div>
          <div className="card animate-fade-in-up delay-6" style={{ marginBottom: 16 }}>
            <div className="card-header"><h3><AlertTriangle size={18} style={{ color: '#F6AD55', marginRight: 8 }} />Low Stock Alerts</h3></div>
            {LOW_STOCK.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < LOW_STOCK.length - 1 ? '1px solid #E2E8F0' : 'none' }}>
                <div><span style={{ fontWeight: 500 }}>{m.name}</span></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 13, color: m.status === 'critical' ? '#C53030' : '#F6AD55', fontWeight: 600 }}>{m.stock} left</span>
                  <button className="btn btn-outline btn-sm">Reorder</button>
                </div>
              </div>
            ))}
          </div>

          <div className="card animate-fade-in-up delay-7">
            <div className="card-header"><h3><Pill size={18} style={{ color: '#6FA8DC', marginRight: 8 }} />Recently Dispensed</h3></div>
            {RECENT.map((r, i) => (
              <div key={r.id} style={{ padding: '10px 0', borderBottom: i < RECENT.length - 1 ? '1px solid #E2E8F0' : 'none' }}>
                <div style={{ fontWeight: 500 }}>{r.patient}</div>
                <div style={{ fontSize: 12, color: '#718096' }}>{r.medicines} • {r.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
