import { useAuth } from '../context/AuthContext';

const API_BASE = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('hms_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const request = async (method, path, body = null) => {
  try {
    const options = { method, headers: getHeaders() };
    if (body) options.body = JSON.stringify(body);
    const res = await fetch(`${API_BASE}${path}`, options);
    const data = await res.json();
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

// ── Mock Data Generators ──────────────────────────
const MOCK_PATIENTS = [
  { id: 'PAT-1001', name: 'Arjun Reddy', age: 34, gender: 'Male', bloodGroup: 'O+', phone: '9876543210', department: 'Cardiology', lastVisit: '2026-06-20', status: 'active' },
  { id: 'PAT-1002', name: 'Meera Krishnan', age: 28, gender: 'Female', bloodGroup: 'A+', phone: '9876543211', department: 'Dermatology', lastVisit: '2026-06-22', status: 'active' },
  { id: 'PAT-1003', name: 'Suresh Babu', age: 55, gender: 'Male', bloodGroup: 'B+', phone: '9876543212', department: 'Orthopedics', lastVisit: '2026-06-18', status: 'active' },
  { id: 'PAT-1004', name: 'Lakshmi Iyer', age: 42, gender: 'Female', bloodGroup: 'AB-', phone: '9876543213', department: 'Neurology', lastVisit: '2026-06-21', status: 'active' },
  { id: 'PAT-1005', name: 'Ravi Shankar', age: 60, gender: 'Male', bloodGroup: 'O-', phone: '9876543214', department: 'Cardiology', lastVisit: '2026-06-19', status: 'active' },
  { id: 'PAT-1006', name: 'Ananya Patel', age: 22, gender: 'Female', bloodGroup: 'A-', phone: '9876543215', department: 'General Medicine', lastVisit: '2026-06-23', status: 'active' },
  { id: 'PAT-1007', name: 'Deepak Nair', age: 45, gender: 'Male', bloodGroup: 'B-', phone: '9876543216', department: 'Ophthalmology', lastVisit: '2026-06-17', status: 'active' },
  { id: 'PAT-1008', name: 'Fatima Khan', age: 38, gender: 'Female', bloodGroup: 'AB+', phone: '9876543217', department: 'Pediatrics', lastVisit: '2026-06-22', status: 'active' },
  { id: 'PAT-1009', name: 'Vijay Kumar', age: 52, gender: 'Male', bloodGroup: 'O+', phone: '9876543218', department: 'General Medicine', lastVisit: '2026-06-20', status: 'active' },
  { id: 'PAT-1010', name: 'Kavitha Rao', age: 30, gender: 'Female', bloodGroup: 'A+', phone: '9876543219', department: 'Dermatology', lastVisit: '2026-06-24', status: 'active' },
  { id: 'PAT-1011', name: 'Mohammed Ali', age: 48, gender: 'Male', bloodGroup: 'B+', phone: '9876543220', department: 'Cardiology', lastVisit: '2026-06-16', status: 'active' },
  { id: 'PAT-1012', name: 'Priyanka Das', age: 26, gender: 'Female', bloodGroup: 'O+', phone: '9876543221', department: 'Orthopedics', lastVisit: '2026-06-21', status: 'active' },
];

const MOCK_DOCTORS = [
  { id: 'DOC-101', name: 'Dr. Anil Mehta', specialization: 'Cardiologist', department: 'Cardiology', experience: 15, fee: 1500, available: true, patients: 120, rating: 4.8 },
  { id: 'DOC-102', name: 'Dr. Sanjay Gupta', specialization: 'Neurologist', department: 'Neurology', experience: 12, fee: 1800, available: true, patients: 95, rating: 4.7 },
  { id: 'DOC-103', name: 'Dr. Priya Nair', specialization: 'Orthopedic Surgeon', department: 'Orthopedics', experience: 10, fee: 1200, available: true, patients: 88, rating: 4.6 },
  { id: 'DOC-104', name: 'Dr. Rekha Sharma', specialization: 'Pediatrician', department: 'Pediatrics', experience: 8, fee: 1000, available: true, patients: 150, rating: 4.9 },
  { id: 'DOC-105', name: 'Dr. Vikram Joshi', specialization: 'Dermatologist', department: 'Dermatology', experience: 7, fee: 1100, available: false, patients: 72, rating: 4.5 },
  { id: 'DOC-106', name: 'Dr. Anjali Verma', specialization: 'Ophthalmologist', department: 'Ophthalmology', experience: 9, fee: 1300, available: true, patients: 65, rating: 4.7 },
  { id: 'DOC-107', name: 'Dr. Raman Pillai', specialization: 'General Physician', department: 'General Medicine', experience: 20, fee: 800, available: true, patients: 200, rating: 4.8 },
  { id: 'DOC-108', name: 'Dr. Sunita Agarwal', specialization: 'Emergency Medicine', department: 'Emergency', experience: 14, fee: 2000, available: true, patients: 180, rating: 4.6 },
];

const MOCK_APPOINTMENTS = [
  { id: 'APT-2001', patientName: 'Arjun Reddy', patientId: 'PAT-1001', doctorName: 'Dr. Anil Mehta', department: 'Cardiology', date: '2026-06-24', time: '09:00 AM', status: 'confirmed', type: 'regular' },
  { id: 'APT-2002', patientName: 'Meera Krishnan', patientId: 'PAT-1002', doctorName: 'Dr. Vikram Joshi', department: 'Dermatology', date: '2026-06-24', time: '09:30 AM', status: 'in_consultation', type: 'follow_up' },
  { id: 'APT-2003', patientName: 'Suresh Babu', patientId: 'PAT-1003', doctorName: 'Dr. Priya Nair', department: 'Orthopedics', date: '2026-06-24', time: '10:00 AM', status: 'requested', type: 'regular' },
  { id: 'APT-2004', patientName: 'Lakshmi Iyer', patientId: 'PAT-1004', doctorName: 'Dr. Sanjay Gupta', department: 'Neurology', date: '2026-06-24', time: '10:30 AM', status: 'completed', type: 'regular' },
  { id: 'APT-2005', patientName: 'Ravi Shankar', patientId: 'PAT-1005', doctorName: 'Dr. Anil Mehta', department: 'Cardiology', date: '2026-06-24', time: '11:00 AM', status: 'confirmed', type: 'emergency' },
  { id: 'APT-2006', patientName: 'Ananya Patel', patientId: 'PAT-1006', doctorName: 'Dr. Raman Pillai', department: 'General Medicine', date: '2026-06-24', time: '11:30 AM', status: 'requested', type: 'regular' },
  { id: 'APT-2007', patientName: 'Deepak Nair', patientId: 'PAT-1007', doctorName: 'Dr. Anjali Verma', department: 'Ophthalmology', date: '2026-06-25', time: '09:00 AM', status: 'confirmed', type: 'regular' },
  { id: 'APT-2008', patientName: 'Fatima Khan', patientId: 'PAT-1008', doctorName: 'Dr. Rekha Sharma', department: 'Pediatrics', date: '2026-06-25', time: '10:00 AM', status: 'requested', type: 'regular' },
  { id: 'APT-2009', patientName: 'Kavitha Rao', patientId: 'PAT-1010', doctorName: 'Dr. Vikram Joshi', department: 'Dermatology', date: '2026-06-25', time: '02:00 PM', status: 'confirmed', type: 'follow_up' },
  { id: 'APT-2010', patientName: 'Mohammed Ali', patientId: 'PAT-1011', doctorName: 'Dr. Anil Mehta', department: 'Cardiology', date: '2026-06-26', time: '09:30 AM', status: 'requested', type: 'regular' },
];

const MOCK_PRESCRIPTIONS = [
  { id: 'PRE-3001', patientName: 'Arjun Reddy', doctorName: 'Dr. Anil Mehta', date: '2026-06-20', diagnosis: 'Hypertension', medicines: [{ name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily', duration: '30 days' }, { name: 'Aspirin', dosage: '75mg', frequency: 'Once daily', duration: '30 days' }], isDispensed: true },
  { id: 'PRE-3002', patientName: 'Meera Krishnan', doctorName: 'Dr. Vikram Joshi', date: '2026-06-22', diagnosis: 'Eczema', medicines: [{ name: 'Betamethasone Cream', dosage: '0.1%', frequency: 'Twice daily', duration: '14 days' }], isDispensed: false },
  { id: 'PRE-3003', patientName: 'Suresh Babu', doctorName: 'Dr. Priya Nair', date: '2026-06-18', diagnosis: 'Knee Osteoarthritis', medicines: [{ name: 'Diclofenac', dosage: '50mg', frequency: 'Twice daily', duration: '7 days' }, { name: 'Calcium + Vitamin D', dosage: '500mg', frequency: 'Once daily', duration: '90 days' }], isDispensed: true },
  { id: 'PRE-3004', patientName: 'Ravi Shankar', doctorName: 'Dr. Anil Mehta', date: '2026-06-19', diagnosis: 'Angina Pectoris', medicines: [{ name: 'Nitroglycerin', dosage: '0.5mg', frequency: 'As needed', duration: '30 days' }, { name: 'Metoprolol', dosage: '25mg', frequency: 'Twice daily', duration: '30 days' }], isDispensed: true },
  { id: 'PRE-3005', patientName: 'Ananya Patel', doctorName: 'Dr. Raman Pillai', date: '2026-06-23', diagnosis: 'Viral Fever', medicines: [{ name: 'Paracetamol', dosage: '500mg', frequency: 'Three times daily', duration: '5 days' }, { name: 'Cetirizine', dosage: '10mg', frequency: 'Once daily', duration: '5 days' }], isDispensed: false },
];

const MOCK_LAB_TESTS = [
  { id: 'LAB-4001', patientName: 'Arjun Reddy', doctorName: 'Dr. Anil Mehta', testType: 'blood_test', testName: 'Complete Blood Count', status: 'report_generated', priority: 'routine', date: '2026-06-20' },
  { id: 'LAB-4002', patientName: 'Suresh Babu', doctorName: 'Dr. Priya Nair', testType: 'xray', testName: 'Knee X-Ray', status: 'reviewed', priority: 'routine', date: '2026-06-18' },
  { id: 'LAB-4003', patientName: 'Lakshmi Iyer', doctorName: 'Dr. Sanjay Gupta', testType: 'mri', testName: 'Brain MRI', status: 'testing', priority: 'urgent', date: '2026-06-22' },
  { id: 'LAB-4004', patientName: 'Ravi Shankar', doctorName: 'Dr. Anil Mehta', testType: 'ecg', testName: 'ECG', status: 'completed', priority: 'emergency', date: '2026-06-19' },
  { id: 'LAB-4005', patientName: 'Vijay Kumar', doctorName: 'Dr. Raman Pillai', testType: 'blood_test', testName: 'Lipid Profile', status: 'ordered', priority: 'routine', date: '2026-06-24' },
  { id: 'LAB-4006', patientName: 'Mohammed Ali', doctorName: 'Dr. Anil Mehta', testType: 'blood_test', testName: 'Cardiac Markers', status: 'sample_collected', priority: 'urgent', date: '2026-06-23' },
  { id: 'LAB-4007', patientName: 'Priyanka Das', doctorName: 'Dr. Priya Nair', testType: 'ct_scan', testName: 'CT Scan - Spine', status: 'ordered', priority: 'routine', date: '2026-06-24' },
];

const MOCK_MEDICINES = [
  { id: 'MED-5001', name: 'Paracetamol 500mg', genericName: 'Acetaminophen', category: 'tablet', stock: 1500, reorderLevel: 200, price: 2.5, expiryDate: '2027-06-15', manufacturer: 'Sun Pharma' },
  { id: 'MED-5002', name: 'Amoxicillin 250mg', genericName: 'Amoxicillin', category: 'capsule', stock: 800, reorderLevel: 100, price: 8, expiryDate: '2027-03-20', manufacturer: 'Cipla' },
  { id: 'MED-5003', name: 'Amlodipine 5mg', genericName: 'Amlodipine', category: 'tablet', stock: 45, reorderLevel: 50, price: 5, expiryDate: '2027-09-10', manufacturer: 'Dr. Reddy\'s' },
  { id: 'MED-5004', name: 'Cetirizine 10mg', genericName: 'Cetirizine', category: 'tablet', stock: 2000, reorderLevel: 300, price: 3, expiryDate: '2027-12-01', manufacturer: 'Mankind' },
  { id: 'MED-5005', name: 'Insulin Glargine', genericName: 'Insulin', category: 'injection', stock: 120, reorderLevel: 30, price: 450, expiryDate: '2026-12-30', manufacturer: 'Novo Nordisk' },
  { id: 'MED-5006', name: 'Cough Syrup', genericName: 'Dextromethorphan', category: 'syrup', stock: 300, reorderLevel: 50, price: 85, expiryDate: '2027-01-15', manufacturer: 'Dabur' },
  { id: 'MED-5007', name: 'Betamethasone Cream', genericName: 'Betamethasone', category: 'ointment', stock: 25, reorderLevel: 30, price: 120, expiryDate: '2026-08-20', manufacturer: 'GSK' },
  { id: 'MED-5008', name: 'Salbutamol Inhaler', genericName: 'Salbutamol', category: 'inhaler', stock: 75, reorderLevel: 20, price: 180, expiryDate: '2027-05-05', manufacturer: 'Cipla' },
];

const MOCK_INVOICES = [
  { id: 'INV-6001', patientName: 'Arjun Reddy', date: '2026-06-20', items: [{ description: 'Consultation - Dr. Anil Mehta', amount: 1500 }, { description: 'Blood Test - CBC', amount: 600 }], total: 2100, paymentMethod: 'upi', paymentStatus: 'completed' },
  { id: 'INV-6002', patientName: 'Meera Krishnan', date: '2026-06-22', items: [{ description: 'Consultation - Dr. Vikram Joshi', amount: 1100 }, { description: 'Medicines', amount: 350 }], total: 1450, paymentMethod: 'card', paymentStatus: 'completed' },
  { id: 'INV-6003', patientName: 'Suresh Babu', date: '2026-06-18', items: [{ description: 'Consultation', amount: 1200 }, { description: 'X-Ray', amount: 800 }, { description: 'Medicines', amount: 450 }], total: 2450, paymentMethod: 'insurance', paymentStatus: 'pending' },
  { id: 'INV-6004', patientName: 'Ravi Shankar', date: '2026-06-19', items: [{ description: 'Emergency Consultation', amount: 2000 }, { description: 'ECG', amount: 500 }, { description: 'Medicines', amount: 800 }], total: 3300, paymentMethod: 'cash', paymentStatus: 'completed' },
  { id: 'INV-6005', patientName: 'Ananya Patel', date: '2026-06-23', items: [{ description: 'Consultation - Dr. Raman Pillai', amount: 800 }, { description: 'Medicines', amount: 150 }], total: 950, paymentMethod: 'upi', paymentStatus: 'pending' },
];

const MOCK_NOTIFICATIONS = [
  { id: 'n1', title: 'New Appointment', message: 'Arjun Reddy has booked an appointment for June 24', type: 'appointment', isRead: false, time: '2 min ago' },
  { id: 'n2', title: 'Lab Report Ready', message: 'CBC report for Arjun Reddy is ready for review', type: 'lab_report', isRead: false, time: '15 min ago' },
  { id: 'n3', title: 'Low Stock Alert', message: 'Amlodipine 5mg stock is below reorder level', type: 'system', isRead: false, time: '1 hour ago' },
  { id: 'n4', title: 'Emergency Case', message: 'Emergency case registered - Ravi Shankar (Chest Pain)', type: 'emergency', isRead: true, time: '3 hours ago' },
  { id: 'n5', title: 'Payment Received', message: 'Payment of ₹2,100 received from Arjun Reddy', type: 'billing', isRead: true, time: '5 hours ago' },
];

// ── Exported API Functions ────────────────────

// Dashboard
export const dashboardApi = {
  getStats: async () => ({
    data: {
      totalPatients: 12458,
      todayAppointments: 48,
      monthlyRevenue: 2456000,
      bedOccupancy: 78,
      totalDoctors: 85,
      totalStaff: 320,
      departments: 8,
      pendingTests: 23,
      activeCases: 156,
      emergencyToday: 5,
      pendingInvoices: 12,
      todayCollections: 185000,
    },
    error: null,
  }),
  getRevenue: async () => ({
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      values: [1850000, 2100000, 1950000, 2300000, 2150000, 2456000],
    },
    error: null,
  }),
  getDeptPerformance: async () => ({
    data: {
      labels: ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Dermatology', 'General Medicine', 'Ophthalmology', 'Emergency'],
      values: [320, 180, 250, 290, 150, 410, 120, 280],
    },
    error: null,
  }),
};

// Patients
export const patientsApi = {
  getAll: async () => ({ data: MOCK_PATIENTS, error: null }),
  getById: async (id) => ({ data: MOCK_PATIENTS.find(p => p.id === id) || MOCK_PATIENTS[0], error: null }),
  create: async (data) => ({ data: { id: 'PAT-' + Date.now(), ...data }, error: null }),
  update: async (id, data) => ({ data: { id, ...data }, error: null }),
  getMedicalHistory: async (id) => ({
    data: {
      allergies: ['Penicillin', 'Dust'],
      previousDiseases: ['Diabetes Type 2 (2021)', 'Hypertension (2023)'],
      surgeries: [{ name: 'Appendectomy', date: '2019-03-15', hospital: 'Apollo Hospital' }],
      currentMedications: ['Metformin 500mg', 'Amlodipine 5mg'],
    },
    error: null,
  }),
};

// Doctors
export const doctorsApi = {
  getAll: async () => ({ data: MOCK_DOCTORS, error: null }),
  getById: async (id) => ({ data: MOCK_DOCTORS.find(d => d.id === id) || MOCK_DOCTORS[0], error: null }),
  getAvailability: async (doctorId, date) => ({
    data: ['09:00 AM', '10:00 AM', '11:30 AM', '02:00 PM', '03:30 PM', '04:00 PM'],
    error: null,
  }),
};

// Appointments
export const appointmentsApi = {
  getAll: async () => ({ data: MOCK_APPOINTMENTS, error: null }),
  getById: async (id) => ({ data: MOCK_APPOINTMENTS.find(a => a.id === id) || MOCK_APPOINTMENTS[0], error: null }),
  book: async (data) => ({ data: { id: 'APT-' + Date.now(), status: 'requested', ...data }, error: null }),
  updateStatus: async (id, status) => ({ data: { id, status }, error: null }),
  reschedule: async (id, date, time) => ({ data: { id, date, time }, error: null }),
};

// Prescriptions
export const prescriptionsApi = {
  getAll: async () => ({ data: MOCK_PRESCRIPTIONS, error: null }),
  getById: async (id) => ({ data: MOCK_PRESCRIPTIONS.find(p => p.id === id) || MOCK_PRESCRIPTIONS[0], error: null }),
  create: async (data) => ({ data: { id: 'PRE-' + Date.now(), ...data }, error: null }),
  dispense: async (id) => ({ data: { id, isDispensed: true }, error: null }),
};

// Lab Tests
export const labTestsApi = {
  getAll: async () => ({ data: MOCK_LAB_TESTS, error: null }),
  getById: async (id) => ({ data: MOCK_LAB_TESTS.find(t => t.id === id) || MOCK_LAB_TESTS[0], error: null }),
  create: async (data) => ({ data: { id: 'LAB-' + Date.now(), ...data }, error: null }),
  updateStatus: async (id, status) => ({ data: { id, status }, error: null }),
};

// Pharmacy
export const pharmacyApi = {
  getMedicines: async () => ({ data: MOCK_MEDICINES, error: null }),
  getLowStock: async () => ({ data: MOCK_MEDICINES.filter(m => m.stock <= m.reorderLevel), error: null }),
  getExpired: async () => ({ data: MOCK_MEDICINES.filter(m => new Date(m.expiryDate) < new Date()), error: null }),
};

// Billing
export const billingApi = {
  getInvoices: async () => ({ data: MOCK_INVOICES, error: null }),
  getById: async (id) => ({ data: MOCK_INVOICES.find(i => i.id === id) || MOCK_INVOICES[0], error: null }),
  create: async (data) => ({ data: { id: 'INV-' + Date.now(), ...data }, error: null }),
  processPayment: async (id, method) => ({ data: { id, paymentStatus: 'completed', paymentMethod: method }, error: null }),
};

// Notifications
export const notificationsApi = {
  getAll: async () => ({ data: MOCK_NOTIFICATIONS, error: null }),
  markRead: async (id) => ({ data: { id, isRead: true }, error: null }),
  getUnreadCount: async () => ({ data: MOCK_NOTIFICATIONS.filter(n => !n.isRead).length, error: null }),
};

const generateAdvancedResponse = (query) => {
  const q = query.trim().toLowerCase();
  
  // 1. Chitchat & Greetings
  if (q === 'hi' || q === 'hello' || q === 'hey' || q === 'greetings') {
    return "Hello! I'm MedCare's AI Healthcare Assistant. How can I help you today? You can ask me medical questions, check symptoms, enquire about doctors, or look at hospital operations reports.";
  }
  if (q.includes('how are you')) {
    return "I'm running at peak efficiency, thank you for asking! How can I assist you with your health or hospital management tasks today?";
  }
  if (q.includes('your name') || q.includes('who are you')) {
    return "I am MedCare AI, an advanced virtual healthcare assistant designed to help patients check symptoms, understand prescriptions, book appointments, and assist administrators with operations analysis.";
  }
  if (q.includes('thank') || q.includes('thanks')) {
    return "You're very welcome! If you have any other questions, feel free to ask. Stay healthy!";
  }
  if (q.includes('joke')) {
    return "Why did the robot go to the clinic? Because it had a virus! 🤖\n\nHope that brought a smile to your face. How can I help you clinically today?";
  }
  if (q.includes('timings') || q.includes('timing') || q.includes('hours') || q.includes('open')) {
    return "🏥 **MedCare Hospital Timings:**\n\n• **Emergency Room (ER):** 24/7, Open 365 days.\n• **Outpatient Department (OPD):** 09:00 AM to 06:00 PM (Monday to Saturday).\n• **Pharmacy & Laboratory:** 24/7.\n• **Inpatient Visiting Hours:** 04:00 PM to 07:00 PM daily.";
  }
  if (q.includes('contact') || q.includes('phone') || q.includes('number') || q.includes('email')) {
    return "📞 **MedCare Contact Information:**\n\n• **General Helpline:** +91 22 5555 1234\n• **Emergency/Ambulance:** +91 22 5555 9111 (or dial 108)\n• **Email support:** info@medcarehospital.com\n• **Address:** MedCare Towers, BKC, Mumbai, Maharashtra.";
  }

  // 2. Specific Medical Conditions
  if (q.includes('diabetes') || q.includes('sugar')) {
    return "🍬 **Understanding Diabetes Mellitus:**\n\nDiabetes is a chronic metabolic condition characterized by elevated blood glucose levels. \n\n• **Type 1:** Autoimmune destruction of insulin-producing beta cells.\n• **Type 2:** Insulin resistance where the body cells don't respond properly to insulin (linked to diet, lifestyle).\n\n**Common Symptoms:** Increased thirst (polydipsia), frequent urination (polyuria), fatigue, and blurry vision.\n\n**Recommendations:** Regular HbA1c screening, physical activity, balanced diet, and consulting our Endocrinology department.";
  }
  if (q.includes('hypertension') || q.includes('blood pressure') || q.includes('bp')) {
    return "🩸 **Understanding Hypertension (High BP):**\n\nHypertension is defined as persistent blood pressure readings of 130/80 mmHg or higher.\n\n• **Risk Factors:** High sodium diet, lack of exercise, stress, genetics.\n• **Prevention:** Reduction in salt intake (DASH diet), 150 mins of exercise weekly, stress management.\n• **Medications:** Commonly managed with Amlodipine, Telmisartan, or Beta-blockers.\n\nRecommend booking a consultation with our **Cardiology** department for a proper assessment.";
  }
  if (q.includes('migraine') || q.includes('headache')) {
    return "🧠 **Understanding Headaches & Migraines:**\n\nHeadaches can be primary (tension, migraine, cluster) or secondary (sinus pressure, high BP).\n\n• **Migraines:** Characterized by throbbing pain on one side of the head, photophobia (sensitivity to light), nausea, and sensory aurus.\n• **Triggers:** Stress, certain foods, lack of sleep, sensory overload.\n• **Management:** Hydration, resting in a dark quiet room, pain relief (Paracetamol/Ibuprofen), or Triptans for acute attacks.\n\nSuggest booking a checkup with our **Neurology** department if headaches are chronic.";
  }
  if (q.includes('asthma') || q.includes('breath')) {
    return "🫁 **Understanding Asthma:**\n\nAsthma is a chronic inflammatory airway disease causing bronchospasms and narrowing of airways.\n\n• **Symptoms:** Wheezing, shortness of breath, chest tightness, and coughing (especially at night).\n• **Triggers:** Pollen, dust mites, pet dander, cold air, exercise.\n• **Treatments:** Bronchodilator inhalers (Salbutamol) for quick relief, and corticosteroid inhalers for long-term control.\n\nRecommend visiting our **Pulmonology** department for a lung function test (Spirometry).";
  }

  // 3. Fallback Generative Engine (GPT-style response for ANY user query)
  const topic = query.replace(/[?.,!/]/g, '').trim();
  
  return `🤖 **MedCare AI Clinical Response**\n\nYou asked about: **"${topic}"**\n\nHere is what you should know from a healthcare and clinical operations perspective:\n\n1. **Core Overview**: In medical literature, discussions surrounding *"${topic}"* typically concern patient care protocols, wellness, or diagnosis guidelines. If this is a medical condition or symptom, it requires clinical correlation.\n\n2. **Immediate Recommendations**:\n   • **Consultation**: Seek advice from a board-certified physician to examine specific concerns.\n   • **Monitoring**: Keep a log of when symptoms or queries arose and share them during your checkup.\n   • **Lifestyle**: Maintain proper hydration, nutritional balance, and rest.\n\n3. **Hospital Resources**: MedCare HMS offers complete specialist access. You can book an appointment with our OPD clinic via the *Appointments* tab or use the *AI Command Center* to run diagnostics.`;
};

// AI
export const aiApi = {
  analyzeSymptoms: async (symptoms) => ({
    data: {
      possibleConditions: [
        { name: 'Common Cold / Viral Infection', probability: 'High', description: 'Upper respiratory tract infection causing fever, cough, and headache.' },
        { name: 'Influenza (Flu)', probability: 'Moderate', description: 'Seasonal flu with similar symptoms but typically more severe.' },
        { name: 'Sinusitis', probability: 'Low', description: 'Inflammation of the sinuses, if headache is concentrated around forehead.' },
      ],
      recommendedDepartment: 'General Medicine',
      urgencyLevel: 'Low',
      disclaimer: '⚠️ This is NOT a medical diagnosis. Please consult a qualified healthcare professional for proper evaluation.',
    },
    error: null,
  }),
  summarizeRecords: async (patientId) => ({
    data: {
      summary: `**Patient Summary:**\n\nThe patient is a 34-year-old male with a history of Hypertension (diagnosed 2023) and Type 2 Diabetes (diagnosed 2021). Previous surgical history includes appendectomy (2019, Apollo Hospital).\n\n**Known Allergies:** Penicillin, Dust\n\n**Current Medications:** Metformin 500mg, Amlodipine 5mg\n\n**Recent Visits:** Last visited Cardiology on June 20, 2026 for routine BP monitoring. ECG and CBC reports are normal.\n\n**Recommendations:** Continue current medication regimen. Schedule follow-up in 3 months for HbA1c check.`,
    },
    error: null,
  }),
  explainPrescription: async (prescriptionId, question) => ({
    data: {
      explanation: `Here's how to take your prescribed medications:\n\n💊 **Amlodipine 5mg** - Take one tablet in the morning with water. This medicine helps control your blood pressure. Don't stop taking it suddenly.\n\n💊 **Aspirin 75mg** - Take one tablet after lunch. This helps prevent blood clots. Take it with food to avoid stomach upset.\n\n⏰ **Timing:** Try to take your medicines at the same time each day for best results.\n\n🚫 **Avoid:** Grapefruit juice while taking Amlodipine as it can increase side effects.\n\n📞 Contact your doctor if you experience dizziness, swelling in feet, or unusual bleeding.`,
    },
    error: null,
  }),
  assistAppointment: async (query) => ({
    data: {
      interpretation: 'You\'re looking for a heart specialist appointment next week.',
      suggestedDepartment: 'Cardiology',
      availableDoctors: [
        { name: 'Dr. Anil Mehta', specialization: 'Cardiologist', experience: '15 years', nextSlot: 'June 26, 09:00 AM', fee: '₹1,500' },
        { name: 'Dr. Sunita Agarwal', specialization: 'Interventional Cardiologist', experience: '14 years', nextSlot: 'June 27, 10:30 AM', fee: '₹2,000' },
      ],
    },
    error: null,
  }),
  operationsInsights: async (query) => ({
    data: {
      insights: `**Revenue Analysis - June 2026:**\n\n📊 Monthly revenue is ₹24,56,000, which is a **12% increase** from last month.\n\n📈 **Growth Drivers:**\n- Cardiology department saw 18% more consultations\n- Emergency cases increased by 8%\n- Lab test revenue grew by 15%\n\n📉 **Areas of Concern:**\n- Dermatology appointments decreased by 5%\n- Pharmacy margins dropped due to higher procurement costs\n\n💡 **Recommendations:**\n1. Consider extending evening OPD hours for Dermatology\n2. Negotiate bulk medicine procurement with suppliers\n3. Add weekend slots for high-demand departments`,
    },
    error: null,
  }),
  askGeneral: async (query) => ({
    data: {
      text: generateAdvancedResponse(query)
    },
    error: null,
  }),
};
