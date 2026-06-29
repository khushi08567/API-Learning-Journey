import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Search, Bell, ChevronDown, LogOut, User, Settings } from 'lucide-react';

export default function Header({ collapsed, onToggle, title }) {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [unreadCount] = useState(3);

  return (
    <header className={`header ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="header-left">
        <button className="header-toggle" onClick={onToggle}>
          {collapsed ? '☰' : '☰'}
        </button>
        <h1 className="header-title">{title || 'Dashboard'}</h1>
      </div>

      <div className="header-search">
        <Search size={18} />
        <input type="text" placeholder="Search patients, doctors, records..." />
      </div>

      <div className="header-right">
        <button className="header-notification">
          <Bell size={20} />
          {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
        </button>

        <div style={{ position: 'relative' }}>
          <div className="header-user" onClick={() => setShowUserMenu(!showUserMenu)}>
            <div className="header-user-avatar">{user?.avatar || 'U'}</div>
            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#4A5568' }}>{user?.name?.split(' ')[0]}</span>
            <ChevronDown size={16} style={{ color: '#A0AEC0' }} />
          </div>

          {showUserMenu && (
            <div style={{
              position: 'absolute', top: '100%', right: 0, marginTop: 8,
              background: '#fff', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              border: '1px solid #E2E8F0', minWidth: 200, zIndex: 200, overflow: 'hidden',
              animation: 'fadeInDown 0.2s ease'
            }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #E2E8F0' }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{user?.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#718096' }}>{user?.email}</div>
              </div>
              <button className="sidebar-link" style={{ width: '100%', borderRadius: 0 }}>
                <User size={18} /> Profile
              </button>
              <button className="sidebar-link" style={{ width: '100%', borderRadius: 0 }}>
                <Settings size={18} /> Settings
              </button>
              <button className="sidebar-link" style={{ width: '100%', borderRadius: 0, color: '#E53E3E' }}
                onClick={logout}>
                <LogOut size={18} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
