import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { NAV_ITEMS, ROLE_LABELS } from '../../utils/constants';
import {
  LayoutDashboard, Building2, Users, Stethoscope, UserCog, ScrollText, BarChart3,
  Settings, Calendar, CreditCard, Pill, FlaskConical, Siren, Bell, ClipboardPlus,
  FileText, HeartPulse, ClipboardList, Receipt, CalendarPlus, ChevronLeft, ChevronRight,
  Cross, LogOut
} from 'lucide-react';

const iconMap = {
  LayoutDashboard, Building2, Users, Stethoscope, UserCog, ScrollText, BarChart3,
  Settings, Calendar, CreditCard, Pill, FlaskConical, Siren, Bell, ClipboardPlus,
  FileText, HeartPulse, ClipboardList, Receipt, CalendarPlus,
};

export default function Sidebar({ collapsed, onToggle }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navSections = NAV_ITEMS[user?.role] || NAV_ITEMS.patient;

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Cross size={22} />
        </div>
        {!collapsed && (
          <div>
            <h2>MedCare</h2>
            <span className="subtitle">Hospital Management</span>
          </div>
        )}
      </div>

      <nav className="sidebar-nav">
        {navSections.map((section, si) => (
          <div key={si}>
            {!collapsed && <div className="sidebar-section-title">{section.section}</div>}
            {section.items.map((item) => {
              const Icon = iconMap[item.icon] || LayoutDashboard;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `sidebar-link ${isActive && location.pathname === item.path ? 'active' : ''}`
                  }
                  end={item.path === '/'}
                >
                  <Icon size={20} />
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="sidebar-user">
        <div className="sidebar-user-avatar">
          {user?.avatar || 'U'}
        </div>
        {!collapsed && (
          <>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.name}</div>
              <div className="sidebar-user-role">{ROLE_LABELS[user?.role]}</div>
            </div>
            <button
              className="btn btn-ghost btn-icon"
              onClick={logout}
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </>
        )}
      </div>
    </aside>
  );
}
