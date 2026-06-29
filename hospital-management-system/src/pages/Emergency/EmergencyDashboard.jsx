import { useState, useEffect, useRef } from 'react';
import { Siren, AlertTriangle, Clock, UserPlus, Stethoscope, Compass, Navigation } from 'lucide-react';
import StatsCard from '../../components/UI/StatsCard';

export default function EmergencyDashboard() {
  // --- Live Ambulance ETAs ---
  const [ambulances, setAmbulances] = useState([
    { id: 'AMB-01', complaint: 'Cardiac Arrest', eta: 180, distance: '2.4 km', priority: 'critical', lat: 30, lon: 30 },
    { id: 'AMB-02', complaint: 'Trauma / Fall', eta: 320, distance: '4.8 km', priority: 'urgent', lat: 10, lon: 70 },
  ]);

  // --- Trauma Bay Allocation ---
  const [bays, setBays] = useState([
    { id: 'Bay 1', patient: 'Unknown Male', age: '~40', complaint: 'Severe chest pain, respiratory distress', doctor: 'Dr. Sunita Agarwal', status: 'occupied', priority: 'critical' },
    { id: 'Bay 2', patient: 'Kavitha Rao', age: '30', complaint: 'Multiple compound fractures', doctor: 'Dr. Priya Nair', status: 'occupied', priority: 'critical' },
    { id: 'Bay 3', patient: 'Child (Unidentified)', age: '~8', complaint: 'High fever, convulsions', doctor: 'Dr. Rekha Sharma', status: 'occupied', priority: 'urgent' },
    { id: 'Bay 4', patient: 'Empty', age: '', complaint: '', doctor: 'Unassigned', status: 'vacant', priority: 'stable' },
  ]);

  // Timer loop for ETAs
  useEffect(() => {
    const timer = setInterval(() => {
      setAmbulances(prev => prev.map(a => {
        if (a.eta > 0) {
          const nextEta = a.eta - 1;
          const nextDist = (nextEta * 0.015).toFixed(1) + ' km';
          // Move coordinate closer to center (50, 50)
          const latDiff = (50 - a.lat) * 0.01;
          const lonDiff = (50 - a.lon) * 0.01;
          return { ...a, eta: nextEta, distance: nextDist, lat: a.lat + latDiff, lon: a.lon + lonDiff };
        } else {
          return { ...a, eta: 300, distance: '5.0 km', lat: Math.random() * 100, lon: Math.random() * 100 }; // Reset
        }
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

  const handleClearBay = (bayId) => {
    setBays(prev => prev.map(b => b.id === bayId ? { ...b, patient: 'Empty', age: '', complaint: '', doctor: 'Unassigned', status: 'vacant', priority: 'stable' } : b));
  };

  const handleAssignBay = (bayId) => {
    setBays(prev => prev.map(b => b.id === bayId ? { ...b, patient: 'Patient from AMB-01', age: '52', complaint: 'Cardiac Arrest', doctor: 'Dr. Sunita Agarwal', status: 'occupied', priority: 'critical' } : b));
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Siren size={28} style={{ color: '#FC8181', animation: 'pulse 1.5s infinite' }} /> Emergency Command Center
          </h1>
          <p style={{ color: '#718096' }}>Real-time GPS ambulance tracking, ER trauma bays, and dispatch control</p>
        </div>
        <button className="btn btn-danger" onClick={() => handleAssignBay('Bay 4')}>
          <UserPlus size={16} /> Force ER Admission
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-3" style={{ marginBottom: 24 }}>
        <StatsCard icon={Siren} label="Active Trauma Cases" value={bays.filter(b => b.status === 'occupied').length} color="blue" />
        <StatsCard icon={Navigation} label="En-Route Ambulances" value={ambulances.length} color="green" />
        <StatsCard icon={Clock} label="Average ER Wait" value={3} suffix=" min" color="teal" />
      </div>

      <div className="grid grid-2" style={{ marginBottom: 24 }}>
        {/* Radar Ambulance Tracker */}
        <div className="card">
          <div className="card-header">
            <h3><Compass size={18} style={{ color: '#6EC89B', marginRight: 8 }} />Live Ambulance Dispatch Map</h3>
          </div>
          
          <div style={{ position: 'relative', width: '100%', height: 260, background: '#FAFFFE', border: '1px solid #E2E8F0', borderRadius: 12, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Radar concentric circles */}
            <div style={{ position: 'absolute', width: 220, height: 220, borderRadius: '50%', border: '1px dashed #CBD5E0' }}></div>
            <div style={{ position: 'absolute', width: 140, height: 140, borderRadius: '50%', border: '1px dashed #CBD5E0' }}></div>
            <div style={{ position: 'absolute', width: 60, height: 60, borderRadius: '50%', border: '1px dashed #CBD5E0' }}></div>
            {/* Center Hospital marker */}
            <div style={{ position: 'absolute', width: 14, height: 14, background: '#FC8181', borderRadius: '50%', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
              <span style={{ color: '#fff', fontSize: 8, fontWeight: 'bold' }}>H</span>
            </div>

            {/* Approaching Ambulances */}
            {ambulances.map(a => (
              <div key={a.id} style={{
                position: 'absolute', top: `${a.lat}%`, left: `${a.lon}%`,
                transition: 'top 1s linear, left 1s linear', zIndex: 5
              }}>
                <div style={{ width: 10, height: 10, background: a.priority === 'critical' ? '#E53E3E' : '#DD6B20', borderRadius: '50%', boxShadow: '0 0 10px rgba(229,62,62,0.8)', animation: 'ping 1s infinite' }}></div>
                <span style={{ position: 'absolute', top: 12, left: -20, background: '#fff', border: '1px solid #CBD5E0', padding: '2px 4px', borderRadius: 4, fontSize: 9, whiteSpace: 'nowrap', fontWeight: 'bold' }}>
                  {a.id} ({formatTime(a.eta)})
                </span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 16 }}>
            {ambulances.map(a => (
              <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F0F4F8' }}>
                <div>
                  <span style={{ fontWeight: 700 }}>{a.id}</span>
                  <span className="badge badge-red" style={{ marginLeft: 8, fontSize: 9 }}>{a.priority}</span>
                  <div style={{ fontSize: 11, color: '#718096', marginTop: 2 }}>Complaint: {a.complaint}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 600, color: '#FC8181' }}>{formatTime(a.eta)}</div>
                  <div style={{ fontSize: 11, color: '#A0AEC0' }}>{a.distance} away</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trauma Bay Board */}
        <div className="card">
          <div className="card-header">
            <h3><AlertTriangle size={18} style={{ color: '#F6AD55', marginRight: 8 }} />Trauma Bay Allocation</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {bays.map(b => {
              const bgColors = { critical: '#FFF5F5', urgent: '#FFFDF5', stable: '#F0FFF4' };
              const borderColors = { critical: '#FC8181', urgent: '#F6AD55', stable: '#68D391' };
              return (
                <div key={b.id} style={{
                  padding: 12, background: b.status === 'vacant' ? '#F8FAFB' : bgColors[b.priority],
                  border: `1px solid ${b.status === 'vacant' ? '#E2E8F0' : borderColors[b.priority]}`,
                  borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontWeight: 700, fontSize: 14 }}>{b.id}: {b.patient}</span>
                      {b.age && <span className="badge badge-gray" style={{ fontSize: 9 }}>Age: {b.age}</span>}
                    </div>
                    {b.complaint && <div style={{ fontSize: 12, color: '#718096', marginTop: 2 }}>{b.complaint}</div>}
                    <div style={{ fontSize: 11, color: '#A0AEC0', marginTop: 4 }}>Doctor assigned: {b.doctor}</div>
                  </div>

                  <div>
                    {b.status === 'occupied' ? (
                      <button className="btn btn-outline btn-sm" style={{ padding: '4px 8px', fontSize: 11 }} onClick={() => handleClearBay(b.id)}>Clear Bay</button>
                    ) : (
                      <button className="btn btn-primary btn-sm" style={{ padding: '4px 8px', fontSize: 11 }} onClick={() => handleAssignBay(b.id)}>Assign</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
