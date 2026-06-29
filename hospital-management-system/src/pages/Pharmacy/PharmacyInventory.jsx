import { useState, useEffect } from 'react';
import { Pill, Search, Plus, AlertTriangle, Package } from 'lucide-react';
import { pharmacyApi } from '../../services/api';

export default function PharmacyInventory() {
  const [medicines, setMedicines] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => { pharmacyApi.getMedicines().then(({ data }) => setMedicines(data)); }, []);

  const filtered = medicines.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="page-header">
        <div><h1>Pharmacy Inventory</h1><p style={{ color: '#718096' }}>{medicines.length} medicines in stock</p></div>
        <button className="btn btn-primary"><Plus size={16} /> Add Medicine</button>
      </div>

      <div className="card animate-fade-in-up">
        <div style={{ marginBottom: 16 }}>
          <div className="header-search" style={{ maxWidth: 400, margin: 0 }}>
            <Search size={18} />
            <input type="text" placeholder="Search medicines..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="data-table-container">
          <table className="data-table">
            <thead><tr><th>ID</th><th>Name</th><th>Category</th><th>Stock</th><th>Price</th><th>Expiry</th><th>Manufacturer</th><th>Status</th></tr></thead>
            <tbody>
              {filtered.map(m => (
                <tr key={m.id}>
                  <td><span className="badge badge-blue">{m.id}</span></td>
                  <td><div style={{ fontWeight: 500 }}>{m.name}</div><div style={{ fontSize: 11, color: '#718096' }}>{m.genericName}</div></td>
                  <td><span className="badge badge-gray">{m.category}</span></td>
                  <td style={{ fontWeight: 600, color: m.stock <= m.reorderLevel ? '#C53030' : '#2D3748' }}>
                    {m.stock <= m.reorderLevel && <AlertTriangle size={14} style={{ color: '#F6AD55', marginRight: 4, verticalAlign: 'middle' }} />}
                    {m.stock}
                  </td>
                  <td>₹{m.price}</td>
                  <td style={{ color: new Date(m.expiryDate) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) ? '#C53030' : '#718096' }}>{m.expiryDate}</td>
                  <td>{m.manufacturer}</td>
                  <td><span className={`badge ${m.stock <= m.reorderLevel ? 'badge-red' : 'badge-green'}`}>{m.stock <= m.reorderLevel ? 'Low Stock' : 'In Stock'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
