# 🏗️ System Architecture Document

**Project:** MedCare HMS — AI-Powered Hospital Management System
**Version:** 1.0.0
**Last Updated:** 2026-06-24

---

## Table of Contents

- [Overview](#overview)
- [High-Level Architecture](#high-level-architecture)
- [Component Architecture](#component-architecture)
  - [Frontend Architecture](#frontend-architecture)
  - [Backend Architecture](#backend-architecture)
  - [AI Service Layer](#ai-service-layer)
- [Data Flow Diagrams](#data-flow-diagrams)
  - [Patient Registration & Appointment Booking](#1-patient-registration--appointment-booking)
  - [Lab Test Ordering & Results](#2-lab-test-ordering--results)
  - [Billing Flow](#3-billing-flow)
  - [Emergency Case Handling](#4-emergency-case-handling)
- [Security Architecture](#security-architecture)
  - [JWT Authentication Flow](#jwt-authentication-flow)
  - [RBAC Model](#role-based-access-control-rbac)
- [Deployment Architecture](#deployment-architecture)
- [Technology Stack](#technology-stack)

---

## Overview

MedCare HMS is a full-stack, AI-powered hospital management system built with a **modern three-tier architecture**: a React single-page application (SPA) as the presentation layer, an Express.js REST API as the application layer, and MongoDB as the data layer. Google's Gemini AI is integrated as an auxiliary intelligence layer for clinical decision support, natural language queries, and operational analytics.

The system follows **separation of concerns**, **stateless API design**, and **role-based access control** to ensure scalability, security, and maintainability.

---

## High-Level Architecture

```mermaid
graph TB
    subgraph CLIENT["🖥️ Client Layer"]
        BROWSER["Browser / Mobile"]
    end

    subgraph FRONTEND["⚛️ Frontend - React + Vite"]
        REACT["React 19 SPA"]
        ROUTER["React Router v7"]
        AXIOS["Axios HTTP Client"]
        CHARTS["Chart.js / Recharts"]
        LUCIDE["Lucide React Icons"]
    end

    subgraph API["🔌 API Layer - Express.js"]
        EXPRESS["Express.js Server"]
        CORS_MW["CORS Middleware"]
        AUTH_MW["Auth Middleware"]
        VALIDATION["Request Validation"]
        ROUTES["Route Handlers"]
    end

    subgraph AUTH["🔐 Authentication Layer"]
        JWT["JWT Token Manager"]
        BCRYPT["Bcrypt Password Hashing"]
        RBAC["Role-Based Access Control"]
        REFRESH["Refresh Token Rotation"]
    end

    subgraph BUSINESS["⚙️ Business Logic Layer"]
        PATIENT_SVC["Patient Service"]
        DOCTOR_SVC["Doctor Service"]
        APPT_SVC["Appointment Service"]
        BILLING_SVC["Billing Service"]
        LAB_SVC["Lab Test Service"]
        RX_SVC["Prescription Service"]
        PHARMACY_SVC["Pharmacy Service"]
        DEPT_SVC["Department Service"]
        NOTIFY_SVC["Notification Service"]
        AUDIT_SVC["Audit Log Service"]
    end

    subgraph DATA["🗄️ Data Layer - MongoDB"]
        MONGOOSE["Mongoose ODM"]
        MONGODB[("MongoDB Database")]
    end

    subgraph AI["🤖 AI Service Layer - Google Gemini"]
        GEMINI["Google Generative AI SDK"]
        SYMPTOM["Symptom Analyzer"]
        SUMMARIZER["Medical Record Summarizer"]
        RX_BOT["Prescription Explanation Bot"]
        APPT_AI["Appointment Assistant"]
        OPS_AI["Operations Dashboard AI"]
    end

    BROWSER --> REACT
    REACT --> ROUTER
    REACT --> AXIOS
    REACT --> CHARTS
    REACT --> LUCIDE
    AXIOS -->|"HTTP/HTTPS"| EXPRESS
    EXPRESS --> CORS_MW
    CORS_MW --> AUTH_MW
    AUTH_MW --> JWT
    JWT --> BCRYPT
    JWT --> RBAC
    JWT --> REFRESH
    AUTH_MW --> VALIDATION
    VALIDATION --> ROUTES
    ROUTES --> PATIENT_SVC
    ROUTES --> DOCTOR_SVC
    ROUTES --> APPT_SVC
    ROUTES --> BILLING_SVC
    ROUTES --> LAB_SVC
    ROUTES --> RX_SVC
    ROUTES --> PHARMACY_SVC
    ROUTES --> DEPT_SVC
    ROUTES --> NOTIFY_SVC
    ROUTES --> AUDIT_SVC
    PATIENT_SVC --> MONGOOSE
    DOCTOR_SVC --> MONGOOSE
    APPT_SVC --> MONGOOSE
    BILLING_SVC --> MONGOOSE
    LAB_SVC --> MONGOOSE
    RX_SVC --> MONGOOSE
    PHARMACY_SVC --> MONGOOSE
    DEPT_SVC --> MONGOOSE
    NOTIFY_SVC --> MONGOOSE
    AUDIT_SVC --> MONGOOSE
    MONGOOSE --> MONGODB
    ROUTES -->|"AI Requests"| GEMINI
    GEMINI --> SYMPTOM
    GEMINI --> SUMMARIZER
    GEMINI --> RX_BOT
    GEMINI --> APPT_AI
    GEMINI --> OPS_AI

    style CLIENT fill:#E3F2FD,stroke:#1565C0,color:#000
    style FRONTEND fill:#E8F5E9,stroke:#2E7D32,color:#000
    style API fill:#FFF3E0,stroke:#E65100,color:#000
    style AUTH fill:#FCE4EC,stroke:#C62828,color:#000
    style BUSINESS fill:#F3E5F5,stroke:#6A1B9A,color:#000
    style DATA fill:#E0F2F1,stroke:#00695C,color:#000
    style AI fill:#FFF8E1,stroke:#F57F17,color:#000
```

---

## Component Architecture

### Frontend Architecture

The frontend is a **React 19 Single-Page Application** built with **Vite** for blazing-fast HMR and optimized builds. It communicates with the backend exclusively through REST API calls via Axios.

```mermaid
graph TB
    subgraph PAGES["📄 Pages"]
        LOGIN["Login / Register"]
        DASHBOARD["Dashboard"]
        PAT_LIST["Patient List"]
        PAT_DETAIL["Patient Detail"]
        DOC_LIST["Doctor List"]
        DOC_DETAIL["Doctor Detail"]
        APPT_PAGE["Appointments"]
        SCHEDULE["Scheduling Calendar"]
        LAB_PAGE["Lab Tests"]
        PHARMACY["Pharmacy / Medicines"]
        BILLING["Billing / Invoices"]
        RECORDS["Medical Records"]
        DEPT_PAGE["Departments"]
        REPORTS["Reports & Analytics"]
        AI_CHAT["AI Assistant"]
        SETTINGS["Settings"]
        PROFILE["User Profile"]
    end

    subgraph COMPONENTS["🧩 Shared Components"]
        NAVBAR["Navbar / Sidebar"]
        TABLE["Data Table"]
        MODAL["Modal Dialog"]
        FORM["Form Components"]
        CARD["Stat Cards"]
        CHART_COMP["Chart Components"]
        ALERT["Alert / Toast"]
        LOADER["Loading Spinner"]
        PAGINATION["Pagination"]
        SEARCH["Search Bar"]
        BADGE["Status Badges"]
        AVATAR["Avatar"]
    end

    subgraph STATE["🔄 State Management"]
        CONTEXT["React Context API"]
        AUTH_CTX["AuthContext"]
        THEME_CTX["ThemeContext"]
        NOTIFY_CTX["NotificationContext"]
    end

    subgraph SERVICES["📡 API Services"]
        AUTH_API["authService.js"]
        PATIENT_API["patientService.js"]
        DOCTOR_API["doctorService.js"]
        APPT_API["appointmentService.js"]
        LAB_API["labTestService.js"]
        BILLING_API["billingService.js"]
        PHARMACY_API["pharmacyService.js"]
        AI_API["aiService.js"]
    end

    subgraph UTILS["🛠️ Utilities"]
        INTERCEPTOR["Axios Interceptor"]
        FORMATTER["Date / Currency Formatters"]
        VALIDATOR["Form Validators"]
        CONSTANTS["Constants & Enums"]
        HELPERS["Helper Functions"]
    end

    PAGES --> COMPONENTS
    PAGES --> STATE
    PAGES --> SERVICES
    SERVICES --> INTERCEPTOR
    INTERCEPTOR -->|"Bearer Token"| EXTERNAL["Express.js API :5000"]

    style PAGES fill:#E8F5E9,stroke:#2E7D32,color:#000
    style COMPONENTS fill:#E3F2FD,stroke:#1565C0,color:#000
    style STATE fill:#FFF3E0,stroke:#E65100,color:#000
    style SERVICES fill:#F3E5F5,stroke:#6A1B9A,color:#000
    style UTILS fill:#EFEBE9,stroke:#4E342E,color:#000
```

**Key Frontend Decisions:**

| Decision | Rationale |
|----------|-----------|
| **Vite** over CRA | 10-100x faster HMR, native ESM support, optimized builds |
| **React Router v7** | File-system-like routing, nested layouts, data loaders |
| **Axios** over Fetch | Interceptors for JWT refresh, request/response transforms, cancellation |
| **Context API** over Redux | Sufficient for auth/theme state; avoids Redux boilerplate for this scale |
| **Chart.js** | Lightweight, responsive charts for dashboards and analytics |
| **Lucide React** | Tree-shakeable, consistent icon set with medical/healthcare icons |

### Backend Architecture

The backend follows a **layered architecture** pattern with clear separation between routes, controllers, services, and models.

```mermaid
graph LR
    subgraph ROUTES["Routes Layer"]
        R1["authRoutes.js"]
        R2["patientRoutes.js"]
        R3["doctorRoutes.js"]
        R4["appointmentRoutes.js"]
        R5["prescriptionRoutes.js"]
        R6["labTestRoutes.js"]
        R7["medicineRoutes.js"]
        R8["invoiceRoutes.js"]
        R9["departmentRoutes.js"]
        R10["notificationRoutes.js"]
        R11["aiRoutes.js"]
        R12["dashboardRoutes.js"]
    end

    subgraph MIDDLEWARE["Middleware Layer"]
        M1["authMiddleware.js"]
        M2["roleMiddleware.js"]
        M3["validationMiddleware.js"]
        M4["errorHandler.js"]
        M5["rateLimiter.js"]
        M6["auditLogger.js"]
    end

    subgraph CONTROLLERS["Controllers Layer"]
        C1["authController.js"]
        C2["patientController.js"]
        C3["doctorController.js"]
        C4["appointmentController.js"]
        C5["prescriptionController.js"]
        C6["labTestController.js"]
        C7["medicineController.js"]
        C8["invoiceController.js"]
        C9["departmentController.js"]
        C10["aiController.js"]
    end

    subgraph MODELS["Models Layer - Mongoose"]
        MD1["User.js"]
        MD2["Patient.js"]
        MD3["Doctor.js"]
        MD4["Appointment.js"]
        MD5["Prescription.js"]
        MD6["MedicalRecord.js"]
        MD7["LabTest.js"]
        MD8["Medicine.js"]
        MD9["Invoice.js"]
        MD10["Notification.js"]
        MD11["AuditLog.js"]
        MD12["Department.js"]
    end

    R1 --> M1
    R2 --> M1
    R3 --> M1
    M1 --> M2
    M2 --> M3
    M3 --> C1
    M3 --> C2
    M3 --> C3
    M3 --> C4
    M3 --> C5
    C1 --> MD1
    C2 --> MD2
    C3 --> MD3
    C4 --> MD4
    C5 --> MD5

    style ROUTES fill:#FFF3E0,stroke:#E65100,color:#000
    style MIDDLEWARE fill:#FCE4EC,stroke:#C62828,color:#000
    style CONTROLLERS fill:#F3E5F5,stroke:#6A1B9A,color:#000
    style MODELS fill:#E0F2F1,stroke:#00695C,color:#000
```

**Request Processing Pipeline:**

```
Client Request
    │
    ▼
┌─────────────────────┐
│  Express.js Server   │
│  (CORS, Body Parser) │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Auth Middleware      │  ← Verify JWT, extract user
│  (JWT Verification)   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Role Middleware      │  ← Check user has required role
│  (RBAC Check)         │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Validation Layer     │  ← Validate request body/params
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Route Handler /      │  ← Business logic execution
│  Controller           │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Mongoose Model       │  ← Database operations
│  (MongoDB)            │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Audit Logger         │  ← Log action to AuditLogs
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Response             │  ← JSON response to client
│  (Success / Error)    │
└─────────────────────┘
```

### AI Service Layer

The AI service layer integrates **Google Gemini** (via the `@google/generative-ai` SDK) to provide five intelligent features.

```mermaid
graph TB
    subgraph AI_LAYER["🤖 AI Service Architecture"]
        API_REQ["Incoming API Request<br/>/api/ai/*"]

        subgraph ORCHESTRATOR["AI Orchestrator"]
            PROMPT_ENG["Prompt Engineering<br/>Module"]
            CONTEXT_BUILD["Context Builder"]
            RESPONSE_PARSE["Response Parser"]
            SAFETY_FILTER["Safety & Disclaimer<br/>Filter"]
        end

        subgraph FEATURES["AI Features"]
            F1["🩺 Symptom Analyzer"]
            F2["📋 Medical Record<br/>Summarizer"]
            F3["💊 Prescription<br/>Explanation Bot"]
            F4["📅 Appointment<br/>Assistant"]
            F5["📊 Operations<br/>Dashboard AI"]
        end

        subgraph GEMINI_API["Google Gemini API"]
            MODEL["gemini-1.5-flash /<br/>gemini-1.5-pro"]
            SAFETY["Safety Settings"]
            GEN_CONFIG["Generation Config"]
        end
    end

    API_REQ --> PROMPT_ENG
    PROMPT_ENG --> CONTEXT_BUILD
    CONTEXT_BUILD --> F1 & F2 & F3 & F4 & F5
    F1 & F2 & F3 & F4 & F5 --> MODEL
    MODEL --> SAFETY
    SAFETY --> GEN_CONFIG
    GEN_CONFIG --> RESPONSE_PARSE
    RESPONSE_PARSE --> SAFETY_FILTER
    SAFETY_FILTER -->|"JSON Response"| API_REQ

    style AI_LAYER fill:#FFF8E1,stroke:#F57F17,color:#000
    style ORCHESTRATOR fill:#E8F5E9,stroke:#2E7D32,color:#000
    style FEATURES fill:#E3F2FD,stroke:#1565C0,color:#000
    style GEMINI_API fill:#F3E5F5,stroke:#6A1B9A,color:#000
```

---

## Data Flow Diagrams

### 1. Patient Registration & Appointment Booking

```mermaid
sequenceDiagram
    actor P as Patient / Receptionist
    participant FE as React Frontend
    participant API as Express.js API
    participant AUTH as Auth Middleware
    participant DB as MongoDB
    participant NOTIFY as Notification Service

    Note over P,NOTIFY: Phase 1 — Patient Registration

    P->>FE: Fill registration form
    FE->>API: POST /api/auth/register
    API->>API: Validate input data
    API->>API: Hash password (bcrypt)
    API->>DB: Create User document (role: patient)
    DB-->>API: User created
    API->>DB: Create Patient document (link userId)
    DB-->>API: Patient created (PAT-XXXXXX)
    API->>DB: Create AuditLog entry
    API-->>FE: 201 Created + JWT tokens
    FE->>FE: Store tokens, redirect to dashboard
    FE-->>P: Registration successful

    Note over P,NOTIFY: Phase 2 — Appointment Booking

    P->>FE: Select doctor & date
    FE->>API: GET /api/doctors/:id/availability?date=2026-06-25
    API->>AUTH: Verify JWT
    AUTH-->>API: Authorized
    API->>DB: Query Doctor's availableSlots
    API->>DB: Query existing Appointments for date
    API-->>FE: Available time slots

    P->>FE: Select slot, enter complaint
    FE->>API: POST /api/appointments
    API->>AUTH: Verify JWT
    AUTH-->>API: Authorized
    API->>DB: Check slot not double-booked
    API->>DB: Create Appointment (APT-XXXXXX)
    DB-->>API: Appointment created
    API->>NOTIFY: Send notification to doctor
    NOTIFY->>DB: Create Notification for doctor
    API->>NOTIFY: Send confirmation to patient
    NOTIFY->>DB: Create Notification for patient
    API->>DB: Create AuditLog entry
    API-->>FE: 201 Created + appointment details
    FE-->>P: Appointment confirmed ✅
```

### 2. Lab Test Ordering & Results

```mermaid
sequenceDiagram
    actor DOC as Doctor
    actor LAB as Lab Technician
    participant FE as React Frontend
    participant API as Express.js API
    participant DB as MongoDB
    participant NOTIFY as Notification Service

    Note over DOC,NOTIFY: Phase 1 — Test Ordering

    DOC->>FE: Order lab test during consultation
    FE->>API: POST /api/lab-tests
    Note right of FE: { patientId, testName,<br/>category, priority, sampleType }
    API->>DB: Create LabTest (status: ordered)
    DB-->>API: LabTest created (LAB-XXXXXX)
    API->>NOTIFY: Notify lab department
    NOTIFY->>DB: Create Notification (type: lab_result)
    API->>DB: Create AuditLog
    API-->>FE: 201 Created
    FE-->>DOC: Test ordered ✅

    Note over DOC,NOTIFY: Phase 2 — Sample Collection

    LAB->>FE: View pending tests queue
    FE->>API: GET /api/lab-tests?status=ordered&priority=urgent
    API->>DB: Query LabTests
    API-->>FE: List of pending tests
    LAB->>FE: Mark sample collected
    FE->>API: PATCH /api/lab-tests/:id/status
    Note right of FE: { status: sample_collected }
    API->>DB: Update LabTest status
    API-->>FE: Updated

    Note over DOC,NOTIFY: Phase 3 — Results Entry

    LAB->>FE: Enter test results
    FE->>API: PUT /api/lab-tests/:id/results
    Note right of FE: { results: { parameters: [...],<br/>conclusion }, status: completed }
    API->>DB: Update LabTest with results
    API->>NOTIFY: Notify ordering doctor
    NOTIFY->>DB: Create Notification for doctor
    API->>NOTIFY: Notify patient
    NOTIFY->>DB: Create Notification for patient
    API->>DB: Create MedicalRecord (type: lab_report)
    API->>DB: Create AuditLog
    API-->>FE: Results saved ✅

    Note over DOC,NOTIFY: Phase 4 — Doctor Review

    DOC->>FE: View patient's lab results
    FE->>API: GET /api/lab-tests/:id
    API->>DB: Query LabTest + populate patient
    API-->>FE: Full test results
    DOC->>FE: Request AI analysis
    FE->>API: POST /api/ai/analyze-results
    API->>API: Build prompt with results context
    API->>API: Call Gemini API
    API-->>FE: AI interpretation + recommendations
    FE-->>DOC: Display results with AI insights
```

### 3. Billing Flow

```mermaid
sequenceDiagram
    actor STAFF as Receptionist / Admin
    actor PAT as Patient
    participant FE as React Frontend
    participant API as Express.js API
    participant DB as MongoDB
    participant NOTIFY as Notification Service

    Note over STAFF,NOTIFY: Phase 1 — Invoice Generation

    STAFF->>FE: Generate invoice for appointment
    FE->>API: GET /api/appointments/:id/billable-items
    API->>DB: Query Appointment details
    API->>DB: Query linked Prescriptions
    API->>DB: Query linked LabTests
    API-->>FE: Billable items list

    STAFF->>FE: Review items, apply discount
    FE->>API: POST /api/invoices
    Note right of FE: { patientId, appointmentId,<br/>items: [...], discount,<br/>taxRate, dueDate }
    API->>API: Calculate subtotal, tax, total
    API->>DB: Create Invoice (INV-XXXXXX)
    DB-->>API: Invoice created
    API->>NOTIFY: Send invoice to patient
    NOTIFY->>DB: Create Notification (type: billing)
    API->>DB: Create AuditLog
    API-->>FE: 201 Created + invoice details
    FE-->>STAFF: Invoice generated ✅

    Note over STAFF,NOTIFY: Phase 2 — Payment Processing

    PAT->>FE: View invoice
    FE->>API: GET /api/invoices/:invoiceNumber
    API->>DB: Query Invoice + populate patient
    API-->>FE: Invoice details + PDF-ready data

    PAT->>FE: Make payment
    FE->>API: POST /api/invoices/:id/payment
    Note right of FE: { amount, paymentMethod }
    API->>DB: Update Invoice (paidAmount, paymentStatus)
    alt Full Payment
        API->>DB: Set paymentStatus = "paid"
    else Partial Payment
        API->>DB: Set paymentStatus = "partial"
    end
    API->>NOTIFY: Send payment receipt
    NOTIFY->>DB: Create Notification
    API->>DB: Create AuditLog
    API-->>FE: Payment recorded ✅
    FE-->>PAT: Receipt displayed

    Note over STAFF,NOTIFY: Phase 3 — Insurance Claims (Optional)

    STAFF->>FE: Submit insurance claim
    FE->>API: POST /api/invoices/:id/insurance-claim
    Note right of FE: { provider, policyNumber,<br/>claimAmount }
    API->>DB: Update Invoice.insuranceClaim
    API->>DB: Create AuditLog
    API-->>FE: Claim submitted
    FE-->>STAFF: Insurance claim recorded ✅
```

### 4. Emergency Case Handling

```mermaid
sequenceDiagram
    actor RECEP as Receptionist
    actor DOC as On-Duty Doctor
    actor NURSE as Nurse
    participant FE as React Frontend
    participant API as Express.js API
    participant DB as MongoDB
    participant AI as Gemini AI
    participant NOTIFY as Notification Service

    Note over RECEP,NOTIFY: Emergency Protocol

    RECEP->>FE: Create emergency appointment
    FE->>API: POST /api/appointments
    Note right of FE: { type: "emergency",<br/>priority: "critical",<br/>chiefComplaint: "..." }
    API->>DB: Find available emergency doctor
    API->>DB: Create Appointment (status: in_progress)
    API->>NOTIFY: URGENT notification to on-duty doctor
    NOTIFY->>DB: Create Notification (priority: critical)
    API->>NOTIFY: Alert department head
    API->>DB: Create AuditLog
    API-->>FE: Emergency appointment created

    RECEP->>FE: Quick patient intake
    FE->>API: POST /api/patients/quick-register
    Note right of FE: { name, phone,<br/>emergencyContact, bloodGroup }
    API->>DB: Create minimal Patient record
    API-->>FE: Patient registered (PAT-XXXXXX)

    DOC->>FE: Accept emergency case
    FE->>API: PATCH /api/appointments/:id
    Note right of FE: { status: "in_progress" }

    DOC->>FE: Record vitals
    FE->>API: PATCH /api/appointments/:id/vitals
    Note right of FE: { vitals: { temperature,<br/>bloodPressure, heartRate,<br/>oxygenSaturation } }
    API->>DB: Update Appointment.vitals

    DOC->>FE: Request AI symptom analysis
    FE->>API: POST /api/ai/analyze-symptoms
    Note right of FE: { symptoms, vitals,<br/>chiefComplaint }
    API->>AI: Analyze with emergency context
    AI-->>API: Differential diagnoses +<br/>recommended tests + urgency
    API-->>FE: AI analysis results

    DOC->>FE: Order STAT lab tests
    FE->>API: POST /api/lab-tests
    Note right of FE: { priority: "stat",<br/>multiple tests }
    API->>DB: Create LabTests (priority: stat)
    API->>NOTIFY: URGENT notification to lab
    NOTIFY->>DB: Notifications created

    DOC->>FE: Prescribe emergency medications
    FE->>API: POST /api/prescriptions
    API->>DB: Create Prescription
    API->>DB: Update Medicine stock
    API-->>FE: Prescription created

    DOC->>FE: Create medical record
    FE->>API: POST /api/medical-records
    Note right of FE: { type: "consultation",<br/>diagnosis, treatmentPlan }
    API->>DB: Create MedicalRecord
    API-->>FE: Record saved

    Note over RECEP,NOTIFY: Post-Emergency Billing

    RECEP->>FE: Generate emergency invoice
    FE->>API: POST /api/invoices
    API->>DB: Create Invoice with emergency items
    API-->>FE: Invoice created (INV-XXXXXX)
```

---

## Security Architecture

### JWT Authentication Flow

```mermaid
sequenceDiagram
    actor U as User
    participant FE as React App
    participant API as Express API
    participant JWT as JWT Service
    participant DB as MongoDB

    Note over U,DB: Login Flow

    U->>FE: Enter email + password
    FE->>API: POST /api/auth/login
    API->>DB: Find User by email
    DB-->>API: User document
    API->>API: Compare password (bcrypt)
    alt Password Valid
        API->>JWT: Generate Access Token (15min)
        API->>JWT: Generate Refresh Token (7 days)
        JWT-->>API: Tokens
        API->>DB: Store hashed refresh token
        API-->>FE: 200 OK + { accessToken, refreshToken, user }
        FE->>FE: Store accessToken (memory)<br/>Store refreshToken (httpOnly cookie)
    else Password Invalid
        API-->>FE: 401 Unauthorized
    end

    Note over U,DB: Authenticated Request

    U->>FE: Navigate to protected page
    FE->>API: GET /api/patients<br/>Authorization: Bearer <accessToken>
    API->>JWT: Verify access token
    alt Token Valid
        JWT-->>API: Decoded payload { userId, role }
        API->>API: Check role permissions
        API->>DB: Execute query
        API-->>FE: 200 OK + data
    else Token Expired
        API-->>FE: 401 Token Expired
        FE->>API: POST /api/auth/refresh<br/>{ refreshToken }
        API->>JWT: Verify refresh token
        API->>DB: Compare with stored hash
        alt Refresh Valid
            API->>JWT: Generate new Access Token
            API->>JWT: Generate new Refresh Token (rotation)
            API->>DB: Update stored refresh token hash
            API-->>FE: New tokens
            FE->>API: Retry original request
        else Refresh Invalid
            API-->>FE: 403 Forbidden
            FE->>FE: Redirect to login
        end
    end

    Note over U,DB: Logout Flow

    U->>FE: Click Logout
    FE->>API: POST /api/auth/logout
    API->>DB: Clear refresh token
    API->>DB: Create AuditLog (LOGOUT)
    API-->>FE: 200 OK
    FE->>FE: Clear tokens, redirect to login
```

**Token Specifications:**

| Token | Algorithm | Expiry | Storage | Purpose |
|-------|-----------|--------|---------|---------|
| Access Token | HS256 | 15 minutes | Memory (JS variable) | API authorization |
| Refresh Token | HS256 | 7 days | HttpOnly cookie / secure storage | Token renewal |

> [!CAUTION]
> Access tokens are stored in JavaScript memory (not localStorage) to prevent XSS attacks. Refresh tokens use HttpOnly cookies to prevent JavaScript access.

### Role-Based Access Control (RBAC)

The system implements **6 user roles** with granular permissions across all resources:

```mermaid
graph TB
    subgraph ROLES["User Roles Hierarchy"]
        ADMIN["👑 Admin<br/>(Full Access)"]
        DOCTOR["🩺 Doctor"]
        RECEP["📋 Receptionist"]
        PHARMA["💊 Pharmacist"]
        LAB_TECH["🔬 Lab Technician"]
        PATIENT_R["👤 Patient"]
    end

    ADMIN -->|manages| DOCTOR
    ADMIN -->|manages| RECEP
    ADMIN -->|manages| PHARMA
    ADMIN -->|manages| LAB_TECH
    ADMIN -->|manages| PATIENT_R

    style ADMIN fill:#FFCDD2,stroke:#C62828,color:#000
    style DOCTOR fill:#C8E6C9,stroke:#2E7D32,color:#000
    style RECEP fill:#BBDEFB,stroke:#1565C0,color:#000
    style PHARMA fill:#FFE0B2,stroke:#E65100,color:#000
    style LAB_TECH fill:#D1C4E9,stroke:#4527A0,color:#000
    style PATIENT_R fill:#F0F4C3,stroke:#827717,color:#000
```

#### Permissions Matrix

| Resource | Admin | Doctor | Receptionist | Patient | Pharmacist | Lab Tech |
|----------|:-----:|:------:|:------------:|:-------:|:----------:|:--------:|
| **Users** | CRUD | R (self) | R | R (self) | R (self) | R (self) |
| **Patients** | CRUD | R/U | CRU | R (own) | R | R |
| **Doctors** | CRUD | R/U (self) | R | R | R | R |
| **Departments** | CRUD | R | R | R | R | R |
| **Appointments** | CRUD | RU (own) | CRUD | CRU (own) | — | — |
| **Prescriptions** | CRUD | CRUD (own) | R | R (own) | R | — |
| **Medical Records** | CRUD | CRUD (own) | R | R (own) | — | R |
| **Lab Tests** | CRUD | CRU | R | R (own) | — | RU |
| **Medicines** | CRUD | R | R | — | CRUD | — |
| **Invoices** | CRUD | R | CRUD | R (own) | — | — |
| **Notifications** | CRUD | RU (own) | RU (own) | RU (own) | RU (own) | RU (own) |
| **Audit Logs** | R | — | — | — | — | — |
| **AI Features** | ✅ All | ✅ All | ✅ Appt AI | ✅ Symptom, Rx | — | — |
| **Dashboard** | Full | Doctor | Reception | Patient | Pharmacy | Lab |

*Legend: C = Create, R = Read, U = Update, D = Delete, — = No Access*

**Middleware Implementation:**

```javascript
// Role-based access middleware pattern
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    next();
  };
};

// Usage in routes
router.get('/patients', auth, authorize('admin', 'doctor', 'receptionist'), getPatients);
router.delete('/patients/:id', auth, authorize('admin'), deletePatient);
```

> [!IMPORTANT]
> Resource-level access control (e.g., "patient can only view their own records") is enforced in the controller/service layer by filtering queries with the authenticated user's ID.

---

## Deployment Architecture

```mermaid
graph TB
    subgraph PRODUCTION["☁️ Production Deployment"]
        subgraph CDN["Content Delivery"]
            STATIC["Static Assets<br/>(Vite Build Output)"]
        end

        subgraph APP_SERVER["Application Server"]
            NODE["Node.js Runtime"]
            EXPRESS_PROD["Express.js<br/>Production Server"]
            PM2["PM2 Process Manager"]
        end

        subgraph DATABASE["Database Server"]
            MONGO_PRIMARY["MongoDB Primary"]
            MONGO_REPLICA1["MongoDB Replica"]
            MONGO_REPLICA2["MongoDB Replica"]
        end

        subgraph EXTERNAL["External Services"]
            GEMINI_EXT["Google Gemini API"]
        end
    end

    subgraph DEV["💻 Development Environment"]
        VITE_DEV["Vite Dev Server :3000"]
        NODE_DEV["Express Dev Server :5000"]
        MONGO_DEV["MongoDB Local :27017"]
    end

    STATIC --> APP_SERVER
    EXPRESS_PROD --> MONGO_PRIMARY
    MONGO_PRIMARY --> MONGO_REPLICA1
    MONGO_PRIMARY --> MONGO_REPLICA2
    EXPRESS_PROD --> GEMINI_EXT

    VITE_DEV -->|"Proxy /api"| NODE_DEV
    NODE_DEV --> MONGO_DEV

    style PRODUCTION fill:#E8F5E9,stroke:#2E7D32,color:#000
    style CDN fill:#E3F2FD,stroke:#1565C0,color:#000
    style APP_SERVER fill:#FFF3E0,stroke:#E65100,color:#000
    style DATABASE fill:#E0F2F1,stroke:#00695C,color:#000
    style EXTERNAL fill:#FFF8E1,stroke:#F57F17,color:#000
    style DEV fill:#F3E5F5,stroke:#6A1B9A,color:#000
```

**Development vs. Production:**

| Aspect | Development | Production |
|--------|-------------|------------|
| **Frontend** | Vite dev server (`:3000`) with HMR | Static build served by Express or CDN |
| **Backend** | Nodemon with auto-restart | PM2 with cluster mode |
| **Database** | Local MongoDB (`:27017`) | MongoDB Atlas / Replica Set |
| **API Proxy** | Vite proxy (`/api` → `:5000`) | Same-origin or reverse proxy (Nginx) |
| **Environment** | `.env` file | Environment variables / secrets manager |
| **Logging** | Console output | Structured logging (Winston/Pino) |
| **CORS** | `http://localhost:3000` | Production domain |

---

## Technology Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Frontend** | React | 19.1.0 | UI library |
| | Vite | 6.3.5 | Build tool & dev server |
| | React Router | 7.6.2 | Client-side routing |
| | Axios | 1.9.0 | HTTP client |
| | Chart.js | 4.5.0 | Data visualization |
| | react-chartjs-2 | 5.3.0 | React Chart.js wrapper |
| | Lucide React | 0.511.0 | Icon system |
| **Backend** | Node.js | 20+ LTS | Runtime |
| | Express.js | 4.21.0 | Web framework |
| | Mongoose | 8.7.0 | MongoDB ODM |
| | jsonwebtoken | 9.0.2 | JWT auth |
| | bcryptjs | 2.4.3 | Password hashing |
| | cors | 2.8.5 | CORS middleware |
| | dotenv | 16.4.5 | Environment variables |
| **AI** | @google/generative-ai | 0.21.0 | Gemini AI SDK |
| **Database** | MongoDB | 7.0+ | Document database |
| **Dev Tools** | Nodemon | 3.1.7 | Auto-restart server |
| | @vitejs/plugin-react | 4.5.2 | React support for Vite |

---

> [!NOTE]
> This architecture is designed for a **single-hospital deployment**. For multi-hospital / multi-tenant deployment, the architecture would need tenant isolation at the database level (separate databases per tenant or tenant-scoped queries) and a gateway service for tenant routing.
