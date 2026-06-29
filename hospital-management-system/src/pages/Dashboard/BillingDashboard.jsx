import { Receipt, IndianRupee, CreditCard, Clock, CheckCircle } from 'lucide-react';
import StatsCard from '../../components/UI/StatsCard';
import StatusBadge from '../../components/UI/StatusBadge';

const INVOICES = [
  { id: 'INV-6001', patient: 'Arjun Reddy', total: 2100, method: 'UPI', status: 'completed', date: 'June 20' },
  { id: 'INV-6002', patient: 'Meera Krishnan', total: 1450, method: 'Card', status: 'completed', date: 'June 22' },
  { id: 'INV-6003', patient: 'Suresh Babu', total: 2450, method: 'Insurance', status: 'pending', date: 'June 18' },
  { id: 'INV-6004', patient: 'Ravi Shankar', total: 3300, method: 'Cash', status: 'completed', date: 'June 19' },
  { id: 'INV-6005', patient: 'Ananya Patel', total: 950, method: 'UPI', status: 'pending', date: 'June 23' },
];

export default function BillingDashboard() {
  return (
    <div>
      <div className="page-header"><div><h1>Billing Dashboard</h1><p style={{ color: '#718096' }}>Billing Executive — Vikram Singh</p></div>
        <button className="btn btn-primary"><Receipt size={16} /> New Invoice</button>
      </div>

      <div className="grid grid-4" style={{ marginBottom: 24 }}>
        <div className="animate-fade-in-up delay-1"><StatsCard icon={IndianRupee} label="Today's Collections" value={185000} prefix="₹" color="green" /></div>
        <div className="animate-fade-in-up delay-2"><StatsCard icon={Clock} label="Pending Invoices" value={12} color="blue" /></div>
        <div className="animate-fade-in-up delay-3"><StatsCard icon={CheckCircle} label="Completed Today" value={28} color="teal" /></div>
        <div className="animate-fade-in-up delay-4"><StatsCard icon={CreditCard} label="Monthly Revenue" value={2456000} prefix="₹" color="mint" /></div>
      </div>

      <div className="card animate-fade-in-up delay-5">
        <div className="card-header"><h3><Receipt size={18} style={{ color: '#6EC89B', marginRight: 8 }} />Recent Invoices</h3></div>
        <table className="data-table">
          <thead><tr><th>Invoice ID</th><th>Patient</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th></tr></thead>
          <tbody>
            {INVOICES.map(inv => (
              <tr key={inv.id}>
                <td><span className="badge badge-blue">{inv.id}</span></td>
                <td style={{ fontWeight: 500 }}>{inv.patient}</td>
                <td style={{ fontWeight: 600 }}>₹{inv.total.toLocaleString('en-IN')}</td>
                <td>{inv.method}</td>
                <td><StatusBadge status={inv.status} /></td>
                <td style={{ color: '#718096' }}>{inv.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
