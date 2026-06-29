import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import DashboardLayout from './components/Layout/DashboardLayout';
import Login from './pages/Login';
import Register from './pages/Register';

// Dashboards
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import SuperAdminDashboard from './pages/Dashboard/SuperAdminDashboard';
import DoctorDashboard from './pages/Dashboard/DoctorDashboard';
import NurseDashboard from './pages/Dashboard/NurseDashboard';
import PatientDashboard from './pages/Dashboard/PatientDashboard';
import ReceptionistDashboard from './pages/Dashboard/ReceptionistDashboard';
import LabDashboard from './pages/Dashboard/LabDashboard';
import PharmacyDashboard from './pages/Dashboard/PharmacyDashboard';
import BillingDashboard from './pages/Dashboard/BillingDashboard';

// Pages
import PatientList from './pages/Patients/PatientList';
import AppointmentCalendar from './pages/Appointments/AppointmentCalendar';
import BookAppointment from './pages/Appointments/BookAppointment';
import DoctorList from './pages/Doctors/DoctorList';
import PharmacyInventory from './pages/Pharmacy/PharmacyInventory';
import InvoiceList from './pages/Billing/InvoiceList';
import EmergencyDashboard from './pages/Emergency/EmergencyDashboard';
import AnalyticsDashboard from './pages/Reports/AnalyticsDashboard';
import NotificationCenter from './pages/Notifications/NotificationCenter';
import SettingsPage from './pages/Settings/SettingsPage';
import AICommandCenter from './pages/AI/AICommandCenter';

const DASHBOARD_MAP = {
  super_admin: SuperAdminDashboard,
  hospital_admin: AdminDashboard,
  doctor: DoctorDashboard,
  nurse: NurseDashboard,
  receptionist: ReceptionistDashboard,
  lab_technician: LabDashboard,
  pharmacist: PharmacyDashboard,
  billing_executive: BillingDashboard,
  patient: PatientDashboard,
};

function DashboardRouter() {
  const { user } = useAuth();
  const Dashboard = DASHBOARD_MAP[user?.role] || AdminDashboard;
  return <Dashboard />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<DashboardLayout><DashboardRouter /></DashboardLayout>} />
      <Route path="/ai-command" element={<DashboardLayout><AICommandCenter /></DashboardLayout>} />
      <Route path="/patients" element={<DashboardLayout><PatientList /></DashboardLayout>} />
      <Route path="/doctors" element={<DashboardLayout><DoctorList /></DashboardLayout>} />
      <Route path="/appointments" element={<DashboardLayout><AppointmentCalendar /></DashboardLayout>} />
      <Route path="/book-appointment" element={<DashboardLayout><BookAppointment /></DashboardLayout>} />
      <Route path="/prescriptions" element={<DashboardLayout><AppointmentCalendar /></DashboardLayout>} />
      <Route path="/consultation" element={<DashboardLayout><DoctorDashboard /></DashboardLayout>} />
      <Route path="/laboratory" element={<DashboardLayout><LabDashboard /></DashboardLayout>} />
      <Route path="/pharmacy" element={<DashboardLayout><PharmacyInventory /></DashboardLayout>} />
      <Route path="/billing" element={<DashboardLayout><InvoiceList /></DashboardLayout>} />
      <Route path="/payments" element={<DashboardLayout><InvoiceList /></DashboardLayout>} />
      <Route path="/emergency" element={<DashboardLayout><EmergencyDashboard /></DashboardLayout>} />
      <Route path="/reports" element={<DashboardLayout><AnalyticsDashboard /></DashboardLayout>} />
      <Route path="/departments" element={<DashboardLayout><AnalyticsDashboard /></DashboardLayout>} />
      <Route path="/notifications" element={<DashboardLayout><NotificationCenter /></DashboardLayout>} />
      <Route path="/settings" element={<DashboardLayout><SettingsPage /></DashboardLayout>} />
      <Route path="/audit-logs" element={<DashboardLayout><SuperAdminDashboard /></DashboardLayout>} />
      <Route path="/staff" element={<DashboardLayout><PatientList /></DashboardLayout>} />
      <Route path="/vitals" element={<DashboardLayout><NurseDashboard /></DashboardLayout>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}
