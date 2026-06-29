import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import Header from './Header';
import AIChatWidget from '../AI/AIChatWidget';

const PAGE_TITLES = {
  '/': 'Dashboard',
  '/ai-command': 'AI Command Center',
  '/patients': 'Patients',
  '/doctors': 'Doctors',
  '/appointments': 'Appointments',
  '/book-appointment': 'Book Appointment',
  '/prescriptions': 'Prescriptions',
  '/consultation': 'Consultation',
  '/laboratory': 'Laboratory',
  '/pharmacy': 'Pharmacy',
  '/billing': 'Billing',
  '/payments': 'Payments',
  '/emergency': 'Emergency',
  '/reports': 'Reports & Analytics',
  '/departments': 'Departments',
  '/notifications': 'Notifications',
  '/settings': 'Settings',
  '/audit-logs': 'Audit Logs',
  '/staff': 'Staff Management',
  '/vitals': 'Record Vitals',
};

export default function DashboardLayout({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  if (loading) {
    return (
      <div className="spinner-overlay" style={{ minHeight: '100vh' }}>
        <div className="spinner"></div>
        <span className="spinner-text">Loading MedCare HMS...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const title = PAGE_TITLES[location.pathname] || 'Dashboard';

  return (
    <div className="dashboard-layout">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Header collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} title={title} />
        <div className="page-content">
          {children}
        </div>
      </div>
      <AIChatWidget />
    </div>
  );
}
