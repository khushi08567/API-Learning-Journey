import { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck, Calendar, Pill, FlaskConical, CreditCard, Siren, Settings as SettingsIcon } from 'lucide-react';
import { notificationsApi } from '../../services/api';

const iconMap = { appointment: Calendar, prescription: Pill, lab_report: FlaskConical, billing: CreditCard, emergency: Siren, system: SettingsIcon };
const colorMap = { appointment: '#6EC89B', prescription: '#6FA8DC', lab_report: '#F6AD55', billing: '#68D391', emergency: '#FC8181', system: '#A0AEC0' };

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState([]);
  useEffect(() => { notificationsApi.getAll().then(({ data }) => setNotifications(data)); }, []);

  const markRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));

  return (
    <div>
      <div className="page-header">
        <div><h1>Notifications</h1><p style={{ color: '#718096' }}>{notifications.filter(n => !n.isRead).length} unread</p></div>
        <button className="btn btn-outline" onClick={markAllRead}><CheckCheck size={16} /> Mark All Read</button>
      </div>

      <div className="card animate-fade-in-up">
        {notifications.map((n, i) => {
          const Icon = iconMap[n.type] || Bell;
          const color = colorMap[n.type] || '#A0AEC0';
          return (
            <div key={n.id} className={`notification-item ${!n.isRead ? 'unread' : ''}`} onClick={() => markRead(n.id)} style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="notification-icon" style={{ background: `${color}20`, color }}>
                <Icon size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: n.isRead ? 400 : 600, marginBottom: 2 }}>{n.title}</div>
                <div style={{ fontSize: 13, color: '#718096' }}>{n.message}</div>
                <div style={{ fontSize: 11, color: '#A0AEC0', marginTop: 4 }}>{n.time}</div>
              </div>
              {!n.isRead && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#6EC89B', flexShrink: 0 }}></div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
