export const API_BASE_URL = '/api';

export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  HOSPITAL_ADMIN: 'hospital_admin',
  DOCTOR: 'doctor',
  NURSE: 'nurse',
  RECEPTIONIST: 'receptionist',
  LAB_TECHNICIAN: 'lab_technician',
  PHARMACIST: 'pharmacist',
  BILLING_EXECUTIVE: 'billing_executive',
  PATIENT: 'patient',
};

export const ROLE_LABELS = {
  super_admin: 'Super Admin',
  hospital_admin: 'Hospital Admin',
  doctor: 'Doctor',
  nurse: 'Nurse',
  receptionist: 'Receptionist',
  lab_technician: 'Lab Technician',
  pharmacist: 'Pharmacist',
  billing_executive: 'Billing Executive',
  patient: 'Patient',
};

export const APPOINTMENT_STATUSES = {
  REQUESTED: 'requested',
  CONFIRMED: 'confirmed',
  IN_CONSULTATION: 'in_consultation',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const STATUS_COLORS = {
  requested: { bg: '#E3F2FD', color: '#1565C0' },
  confirmed: { bg: '#E8F5E9', color: '#2E7D32' },
  in_consultation: { bg: '#FFF3E0', color: '#E65100' },
  completed: { bg: '#E8F5E9', color: '#1B5E20' },
  cancelled: { bg: '#FFF5F5', color: '#C62828' },
  pending: { bg: '#FFF8E1', color: '#F57F17' },
  active: { bg: '#E8F5E9', color: '#2E7D32' },
  ordered: { bg: '#E3F2FD', color: '#1565C0' },
  sample_collected: { bg: '#FFF3E0', color: '#E65100' },
  testing: { bg: '#FFF8E1', color: '#F57F17' },
  report_generated: { bg: '#E8F5E9', color: '#2E7D32' },
  reviewed: { bg: '#E0F2F1', color: '#00695C' },
};

export const TEST_TYPES = [
  { value: 'blood_test', label: 'Blood Test' },
  { value: 'xray', label: 'X-Ray' },
  { value: 'mri', label: 'MRI' },
  { value: 'ct_scan', label: 'CT Scan' },
  { value: 'urine_test', label: 'Urine Test' },
  { value: 'ecg', label: 'ECG' },
  { value: 'other', label: 'Other' },
];

export const MEDICINE_CATEGORIES = [
  { value: 'tablet', label: 'Tablet' },
  { value: 'capsule', label: 'Capsule' },
  { value: 'syrup', label: 'Syrup' },
  { value: 'injection', label: 'Injection' },
  { value: 'ointment', label: 'Ointment' },
  { value: 'drops', label: 'Drops' },
  { value: 'inhaler', label: 'Inhaler' },
  { value: 'other', label: 'Other' },
];

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const DEPARTMENTS = [
  { id: 'dept-1', name: 'Cardiology', description: 'Heart and cardiovascular care' },
  { id: 'dept-2', name: 'Neurology', description: 'Brain and nervous system' },
  { id: 'dept-3', name: 'Orthopedics', description: 'Bones and joints' },
  { id: 'dept-4', name: 'Pediatrics', description: 'Children healthcare' },
  { id: 'dept-5', name: 'Dermatology', description: 'Skin care' },
  { id: 'dept-6', name: 'Ophthalmology', description: 'Eye care' },
  { id: 'dept-7', name: 'General Medicine', description: 'General health consultations' },
  { id: 'dept-8', name: 'Emergency', description: '24/7 emergency services' },
];

export const PAYMENT_METHODS = [
  { value: 'upi', label: 'UPI' },
  { value: 'card', label: 'Card' },
  { value: 'cash', label: 'Cash' },
  { value: 'insurance', label: 'Insurance' },
];

export const TIME_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
];

export const NAV_ITEMS = {
  super_admin: [
    { section: 'Overview', items: [
      { path: '/', label: 'Dashboard', icon: 'LayoutDashboard' },
      { path: '/ai-command', label: 'AI Command Center', icon: 'Sparkles' },
    ]},
    { section: 'Management', items: [
      { path: '/departments', label: 'Departments', icon: 'Building2' },
      { path: '/patients', label: 'Patients', icon: 'Users' },
      { path: '/doctors', label: 'Doctors', icon: 'Stethoscope' },
      { path: '/staff', label: 'All Staff', icon: 'UserCog' },
    ]},
    { section: 'System', items: [
      { path: '/audit-logs', label: 'Audit Logs', icon: 'ScrollText' },
      { path: '/reports', label: 'Reports', icon: 'BarChart3' },
      { path: '/settings', label: 'Settings', icon: 'Settings' },
    ]},
  ],
  hospital_admin: [
    { section: 'Overview', items: [
      { path: '/', label: 'Dashboard', icon: 'LayoutDashboard' },
      { path: '/ai-command', label: 'AI Command Center', icon: 'Sparkles' },
    ]},
    { section: 'Management', items: [
      { path: '/departments', label: 'Departments', icon: 'Building2' },
      { path: '/doctors', label: 'Doctors', icon: 'Stethoscope' },
      { path: '/patients', label: 'Patients', icon: 'Users' },
      { path: '/appointments', label: 'Appointments', icon: 'Calendar' },
    ]},
    { section: 'Operations', items: [
      { path: '/billing', label: 'Billing', icon: 'CreditCard' },
      { path: '/pharmacy', label: 'Pharmacy', icon: 'Pill' },
      { path: '/laboratory', label: 'Laboratory', icon: 'FlaskConical' },
      { path: '/reports', label: 'Reports', icon: 'BarChart3' },
      { path: '/emergency', label: 'Emergency', icon: 'Siren' },
    ]},
    { section: 'System', items: [
      { path: '/notifications', label: 'Notifications', icon: 'Bell' },
      { path: '/settings', label: 'Settings', icon: 'Settings' },
    ]},
  ],
  doctor: [
    { section: 'Overview', items: [
      { path: '/', label: 'Dashboard', icon: 'LayoutDashboard' },
      { path: '/ai-command', label: 'AI Command Center', icon: 'Sparkles' },
    ]},
    { section: 'Clinical', items: [
      { path: '/appointments', label: 'Appointments', icon: 'Calendar' },
      { path: '/patients', label: 'My Patients', icon: 'Users' },
      { path: '/consultation', label: 'Consultation', icon: 'ClipboardPlus' },
      { path: '/prescriptions', label: 'Prescriptions', icon: 'FileText' },
    ]},
    { section: 'Diagnostics', items: [
      { path: '/laboratory', label: 'Lab Tests', icon: 'FlaskConical' },
      { path: '/notifications', label: 'Notifications', icon: 'Bell' },
    ]},
  ],
  nurse: [
    { section: 'Overview', items: [
      { path: '/', label: 'Dashboard', icon: 'LayoutDashboard' },
    ]},
    { section: 'Patient Care', items: [
      { path: '/patients', label: 'Assigned Patients', icon: 'Users' },
      { path: '/vitals', label: 'Record Vitals', icon: 'HeartPulse' },
      { path: '/notifications', label: 'Notifications', icon: 'Bell' },
    ]},
  ],
  receptionist: [
    { section: 'Overview', items: [
      { path: '/', label: 'Dashboard', icon: 'LayoutDashboard' },
    ]},
    { section: 'Front Desk', items: [
      { path: '/appointments', label: 'Appointments', icon: 'Calendar' },
      { path: '/patients', label: 'Patients', icon: 'Users' },
      { path: '/doctors', label: 'Doctor Availability', icon: 'Stethoscope' },
      { path: '/notifications', label: 'Notifications', icon: 'Bell' },
    ]},
  ],
  lab_technician: [
    { section: 'Overview', items: [
      { path: '/', label: 'Dashboard', icon: 'LayoutDashboard' },
    ]},
    { section: 'Laboratory', items: [
      { path: '/laboratory', label: 'Test Requests', icon: 'FlaskConical' },
      { path: '/reports', label: 'Reports', icon: 'FileText' },
      { path: '/notifications', label: 'Notifications', icon: 'Bell' },
    ]},
  ],
  pharmacist: [
    { section: 'Overview', items: [
      { path: '/', label: 'Dashboard', icon: 'LayoutDashboard' },
    ]},
    { section: 'Pharmacy', items: [
      { path: '/pharmacy', label: 'Inventory', icon: 'Pill' },
      { path: '/prescriptions', label: 'Prescription Queue', icon: 'ClipboardList' },
      { path: '/notifications', label: 'Notifications', icon: 'Bell' },
    ]},
  ],
  billing_executive: [
    { section: 'Overview', items: [
      { path: '/', label: 'Dashboard', icon: 'LayoutDashboard' },
    ]},
    { section: 'Billing', items: [
      { path: '/billing', label: 'Invoices', icon: 'Receipt' },
      { path: '/payments', label: 'Payments', icon: 'CreditCard' },
      { path: '/notifications', label: 'Notifications', icon: 'Bell' },
    ]},
  ],
  patient: [
    { section: 'Overview', items: [
      { path: '/', label: 'Dashboard', icon: 'LayoutDashboard' },
    ]},
    { section: 'Health', items: [
      { path: '/appointments', label: 'Appointments', icon: 'Calendar' },
      { path: '/book-appointment', label: 'Book Appointment', icon: 'CalendarPlus' },
      { path: '/prescriptions', label: 'Prescriptions', icon: 'FileText' },
      { path: '/reports', label: 'Reports', icon: 'ClipboardList' },
    ]},
    { section: 'Account', items: [
      { path: '/billing', label: 'Billing', icon: 'CreditCard' },
      { path: '/notifications', label: 'Notifications', icon: 'Bell' },
      { path: '/settings', label: 'Profile', icon: 'Settings' },
    ]},
  ],
};

export const DEMO_CREDENTIALS = [
  { email: 'super_admin@hospital.com', role: 'Super Admin' },
  { email: 'admin@hospital.com', role: 'Hospital Admin' },
  { email: 'doctor@hospital.com', role: 'Doctor' },
  { email: 'nurse@hospital.com', role: 'Nurse' },
  { email: 'receptionist@hospital.com', role: 'Receptionist' },
  { email: 'lab@hospital.com', role: 'Lab Technician' },
  { email: 'pharmacist@hospital.com', role: 'Pharmacist' },
  { email: 'billing@hospital.com', role: 'Billing Executive' },
  { email: 'patient@hospital.com', role: 'Patient' },
];
