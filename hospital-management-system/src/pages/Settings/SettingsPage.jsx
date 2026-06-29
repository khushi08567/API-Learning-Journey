import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Lock, Bell, Save } from 'lucide-react';
import { ROLE_LABELS } from '../../utils/constants';

export default function SettingsPage() {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: '9876543210', address: 'Mumbai, Maharashtra' });

  return (
    <div>
      <div className="page-header"><h1>Settings</h1></div>

      <div className="grid grid-2">
        <div className="card animate-fade-in-up delay-1">
          <div className="card-header"><h3><User size={18} style={{ color: '#6EC89B', marginRight: 8 }} />Profile Information</h3></div>
          <div className="profile-card" style={{ marginBottom: 16 }}>
            <div className="profile-avatar">{user?.avatar || 'U'}</div>
            <h3>{user?.name}</h3>
            <p style={{ color: '#718096' }}>{ROLE_LABELS[user?.role]} • {user?.department || 'N/A'}</p>
          </div>
          <div className="input-group"><label>Full Name</label><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div className="input-group"><label>Email</label><input className="input" type="email" value={form.email} disabled /></div>
          <div className="input-group"><label>Phone</label><input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          <div className="input-group"><label>Address</label><input className="input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
          <button className="btn btn-primary w-full"><Save size={16} /> Save Changes</button>
        </div>

        <div>
          <div className="card animate-fade-in-up delay-2" style={{ marginBottom: 16 }}>
            <div className="card-header"><h3><Lock size={18} style={{ color: '#6FA8DC', marginRight: 8 }} />Change Password</h3></div>
            <div className="input-group"><label>Current Password</label><input className="input" type="password" placeholder="Enter current password" /></div>
            <div className="input-group"><label>New Password</label><input className="input" type="password" placeholder="Enter new password" /></div>
            <div className="input-group"><label>Confirm New Password</label><input className="input" type="password" placeholder="Confirm new password" /></div>
            <button className="btn btn-secondary w-full"><Lock size={16} /> Update Password</button>
          </div>

          <div className="card animate-fade-in-up delay-3">
            <div className="card-header"><h3><Bell size={18} style={{ color: '#6EC89B', marginRight: 8 }} />Notification Preferences</h3></div>
            {['Appointment Reminders', 'Lab Report Notifications', 'Billing Alerts', 'Emergency Alerts', 'System Updates'].map((pref, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < 4 ? '1px solid #E2E8F0' : 'none' }}>
                <span style={{ fontSize: 14 }}>{pref}</span>
                <label style={{ position: 'relative', width: 44, height: 24, cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked={i < 4} style={{ opacity: 0, width: 0, height: 0 }} />
                  <span style={{ position: 'absolute', inset: 0, background: i < 4 ? '#6EC89B' : '#CBD5E0', borderRadius: 12, transition: '0.3s' }}>
                    <span style={{ position: 'absolute', width: 18, height: 18, background: '#fff', borderRadius: '50%', top: 3, left: i < 4 ? 23 : 3, transition: '0.3s' }}></span>
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
