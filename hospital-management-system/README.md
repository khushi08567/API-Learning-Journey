# 🏥 MedCare HMS — AI-Powered Hospital Management System

> Enterprise-grade Hospital Management System with AI-powered healthcare assistant, multi-role access control, and comprehensive operational management.

## 🌟 Features

### Role-Based Dashboards (9 Roles)
| Role | Dashboard | Key Features |
|------|-----------|-------------|
| **Super Admin** | System Overview | Audit logs, system health, user management |
| **Hospital Admin** | Hospital Dashboard | Revenue charts, patient volume, bed occupancy, department stats |
| **Doctor** | Clinical Dashboard | Patient queue, prescriptions, AI summaries |
| **Nurse** | Ward Dashboard | Patient vitals, task management |
| **Receptionist** | Front Desk | Scheduling, doctor availability, quick registration |
| **Lab Technician** | Lab Dashboard | Kanban board for test workflow |
| **Pharmacist** | Pharmacy Dashboard | Prescription fulfillment, stock alerts |
| **Billing Executive** | Billing Dashboard | Invoice management, collections stats |
| **Patient** | Health Portal | Appointments, prescriptions, reports, AI symptom checker |

### 🤖 AI Healthcare Assistant
- **Symptom Analysis** — Describe symptoms, get possible conditions & department recommendations
- **Prescription Explainer** — Understand medications, dosage, and interactions
- **Appointment Assistant** — Find the right specialist based on symptoms
- **Patient History Summarizer** — AI-generated medical history summaries
- **Operations Insights** — Analytics and optimization recommendations

### 📊 Core Modules
- Patient Management (Registration, Medical Records, History)
- Doctor Management (Profiles, Schedules, Availability)
- Appointment Scheduling (Multi-step booking, calendar view)
- Prescription Management (Digital prescriptions with pharmacy integration)
- Laboratory Management (Test ordering, Kanban workflow, reports)
- Pharmacy & Inventory (Stock tracking, low-stock alerts, dispensing)
- Billing & Invoicing (Multi-payment, insurance claims)
- Emergency Department (Priority queue, triage system)
- Reports & Analytics (Revenue trends, department stats, AI insights)
- Notifications (Real-time alerts by type)
- Audit Logging (Complete activity trail)
- Settings (Profile, password, notification preferences)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, React Router 7, Chart.js, Lucide Icons |
| **Styling** | Custom CSS Design System (Pastel Light Theme) |
| **Backend** | Express.js, Node.js |
| **Database** | MongoDB with Mongoose ODM |
| **Auth** | JWT (Access + Refresh Tokens) |
| **AI** | Mock AI Service (ready for LLM integration) |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (optional — app works with mock data)

### Installation

```bash
# Clone and install frontend
cd hospital-management-system
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### Running the Application

```bash
# Start frontend (port 5173)
npm run dev

# Start backend (port 5000) - optional
npm run server
```

### Demo Login
The app includes **quick demo login** for all 9 roles. Click any role badge on the login page to instantly log in and explore that role's dashboard.

---

## 📁 Project Structure

```
hospital-management-system/
├── src/
│   ├── components/
│   │   ├── AI/           # AI Chat Widget
│   │   ├── Charts/       # Revenue, Patient, Department, Bed charts
│   │   ├── Layout/       # Sidebar, Header, DashboardLayout
│   │   └── UI/           # StatsCard, StatusBadge, Modal, Spinner
│   ├── context/          # AuthContext (RBAC)
│   ├── pages/
│   │   ├── Dashboard/    # 9 role-specific dashboards
│   │   ├── Patients/     # Patient management
│   │   ├── Doctors/      # Doctor profiles
│   │   ├── Appointments/ # Calendar + Booking
│   │   ├── Pharmacy/     # Inventory management
│   │   ├── Billing/      # Invoices
│   │   ├── Emergency/    # Priority queue
│   │   ├── Reports/      # Analytics + AI insights
│   │   ├── Notifications/# Notification center
│   │   └── Settings/     # User settings
│   ├── services/         # Mock API layer
│   ├── utils/            # Constants, RBAC config
│   ├── App.jsx           # Router configuration
│   └── main.jsx          # Entry point
├── server/
│   ├── config/           # Database connection
│   ├── middleware/        # Auth, RBAC, Audit, Error handling
│   ├── models/           # 12 Mongoose models
│   ├── routes/           # 14 API route groups
│   ├── services/         # AI service layer
│   └── server.js         # Express entry point
├── index.html
├── vite.config.js
└── package.json
```

---

## 🎨 Design System

- **Theme**: Light pastel (no dark backgrounds, no neon colors)
- **Colors**: Soft greens (#A8D5BA), blues (#A8C8E8), whites
- **Typography**: Inter (body), Outfit (headings)
- **Effects**: Glassmorphism, smooth animations, hover transitions
- **Charts**: Pastel-colored Chart.js visualizations

---

## 🔒 Security Features

- JWT Access + Refresh Token authentication
- Role-Based Access Control (9 roles, 50+ permissions)
- Password hashing with bcrypt
- Audit logging for all actions
- API route protection with middleware
- CORS configuration

---

## 📝 API Endpoints

| Module | Endpoints | Methods |
|--------|-----------|---------|
| Auth | `/api/auth` | POST login, register, refresh |
| Patients | `/api/patients` | GET, POST, PUT, DELETE |
| Doctors | `/api/doctors` | GET, POST, PUT |
| Appointments | `/api/appointments` | GET, POST, PUT, DELETE |
| Prescriptions | `/api/prescriptions` | GET, POST, PUT |
| Lab Tests | `/api/lab-tests` | GET, POST, PUT |
| Pharmacy | `/api/pharmacy` | GET, POST, PUT |
| Billing | `/api/billing` | GET, POST, PUT |
| Departments | `/api/departments` | GET, POST, PUT, DELETE |
| Notifications | `/api/notifications` | GET, PUT, POST |
| Audit Logs | `/api/audit` | GET (admin only) |
| Dashboard | `/api/dashboard` | GET stats, revenue, dept |
| AI | `/api/ai` | POST (5 endpoints) |

---

## 👥 Authors

Built as an enterprise-grade healthcare management solution.

## 📄 License

MIT License
