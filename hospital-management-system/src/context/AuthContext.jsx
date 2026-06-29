import { createContext, useContext, useState, useEffect } from 'react';
import { ROLES } from '../utils/constants';

const AuthContext = createContext(null);

const DEMO_USERS = {
  'super_admin@hospital.com': { id: 'u1', name: 'Dr. Rajesh Kumar', email: 'super_admin@hospital.com', role: 'super_admin', department: 'Administration', avatar: 'RK' },
  'admin@hospital.com': { id: 'u2', name: 'Priya Sharma', email: 'admin@hospital.com', role: 'hospital_admin', department: 'Administration', avatar: 'PS' },
  'doctor@hospital.com': { id: 'u3', name: 'Dr. Anil Mehta', email: 'doctor@hospital.com', role: 'doctor', department: 'Cardiology', avatar: 'AM' },
  'nurse@hospital.com': { id: 'u4', name: 'Sita Devi', email: 'nurse@hospital.com', role: 'nurse', department: 'General Ward', avatar: 'SD' },
  'receptionist@hospital.com': { id: 'u5', name: 'Rahul Verma', email: 'receptionist@hospital.com', role: 'receptionist', department: 'Front Desk', avatar: 'RV' },
  'lab@hospital.com': { id: 'u6', name: 'Amit Patel', email: 'lab@hospital.com', role: 'lab_technician', department: 'Laboratory', avatar: 'AP' },
  'pharmacist@hospital.com': { id: 'u7', name: 'Neha Gupta', email: 'pharmacist@hospital.com', role: 'pharmacist', department: 'Pharmacy', avatar: 'NG' },
  'billing@hospital.com': { id: 'u8', name: 'Vikram Singh', email: 'billing@hospital.com', role: 'billing_executive', department: 'Billing', avatar: 'VS' },
  'patient@hospital.com': { id: 'u9', name: 'Arjun Reddy', email: 'patient@hospital.com', role: 'patient', department: null, avatar: 'AR' },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('hms_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { localStorage.removeItem('hms_user'); }
    } else {
      // Auto-login as hospital admin by default for handling everything via the Admin Dashboard
      const defaultAdmin = DEMO_USERS['admin@hospital.com'];
      localStorage.setItem('hms_token', 'demo_token_admin');
      localStorage.setItem('hms_user', JSON.stringify(defaultAdmin));
      setUser(defaultAdmin);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Demo mode: check demo accounts
    const demoUser = DEMO_USERS[email.toLowerCase()];
    if (demoUser) {
      const token = 'demo_token_' + Date.now();
      localStorage.setItem('hms_token', token);
      localStorage.setItem('hms_user', JSON.stringify(demoUser));
      setUser(demoUser);
      return { success: true, user: demoUser };
    }

    // Try real API
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('hms_token', data.token);
        localStorage.setItem('hms_user', JSON.stringify(data.user));
        setUser(data.user);
        return { success: true, user: data.user };
      }
      return { success: false, error: data.message || 'Login failed' };
    } catch {
      // If API not available, only demo accounts work
      return { success: false, error: 'Invalid credentials. Use a demo email with any password.' };
    }
  };

  const register = async (userData) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('hms_token', data.token);
        localStorage.setItem('hms_user', JSON.stringify(data.user));
        setUser(data.user);
        return { success: true };
      }
      return { success: false, error: data.message };
    } catch {
      // Demo mode registration
      const newUser = {
        id: 'u' + Date.now(),
        name: userData.name,
        email: userData.email,
        role: 'patient',
        department: null,
        avatar: userData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
      };
      localStorage.setItem('hms_token', 'demo_token_' + Date.now());
      localStorage.setItem('hms_user', JSON.stringify(newUser));
      setUser(newUser);
      return { success: true };
    }
  };

  const logout = () => {
    localStorage.removeItem('hms_token');
    localStorage.removeItem('hms_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

export default AuthContext;
