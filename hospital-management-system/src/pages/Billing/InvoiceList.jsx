import { useState, useEffect } from 'react';
import { Receipt, Plus, IndianRupee } from 'lucide-react';
import { billingApi } from '../../services/api';
import StatusBadge from '../../components/UI/StatusBadge';

export default function InvoiceList() {
  const [invoices, setInvoices] = useState([]);
  useEffect(() => { billingApi.getInvoices().then(({ data }) => setInvoices(data)); }, []);

  return (
    <div>
      <div className="page-header">
        <div><h1>Billing & Invoices</h1><p style={{ color: '#718096' }}>{invoices.length} invoices</p></div>
        <button className="btn btn-primary"><Plus size={16} /> New Invoice</button>
      </div>

      <div className="card animate-fade-in-up">
        <div className="data-table-container">
          <table className="data-table">
            <thead><tr><th>Invoice ID</th><th>Patient</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv.id}>
                  <td><span className="badge badge-blue">{inv.id}</span></td>
                  <td style={{ fontWeight: 500 }}>{inv.patientName}</td>
                  <td>{inv.items.length} items</td>
                  <td style={{ fontWeight: 600, color: '#2D3748' }}><IndianRupee size={13} style={{ verticalAlign: 'middle' }} />{inv.total.toLocaleString('en-IN')}</td>
                  <td><span className="badge badge-gray">{inv.paymentMethod.toUpperCase()}</span></td>
                  <td><StatusBadge status={inv.paymentStatus} /></td>
                  <td style={{ color: '#718096' }}>{inv.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
