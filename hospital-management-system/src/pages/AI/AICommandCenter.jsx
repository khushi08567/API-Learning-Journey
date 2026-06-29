import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity, Upload, ShieldCheck, Cpu, Sparkles, Siren, Brain, TrendingUp,
  CheckCircle, RefreshCw, FileText, HeartPulse, User, Check, AlertTriangle, Clock, Map, Edit2
} from 'lucide-react';

const MOCK_SCANS = [
  { id: 'scan-1', name: 'Chest X-Ray (Pneumonia Detection)', url: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=400&q=80', anomaly: 'Lobar Pneumonia (Right Lung)', confidence: '94.2%', box: { top: '35%', left: '55%', width: '30%', height: '35%' }, clinicalNote: 'Consolidation noted in the right lower lobe. Suggest correlation with sputum culture and initiate antibiotic therapy.' },
  { id: 'scan-2', name: 'Brain MRI (Malignancy Screen)', url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=400&q=80', anomaly: 'Benign Meningioma (Frontal Lobe)', confidence: '98.5%', box: { top: '20%', left: '25%', width: '25%', height: '25%' }, clinicalNote: 'Well-circumscribed extra-axial mass in the left frontal region. No significant mass effect. Recommend neurosurgery follow-up.' },
  { id: 'scan-3', name: 'Knee X-Ray (Fracture Assessment)', url: 'https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?auto=format&fit=crop&w=400&q=80', anomaly: 'Hairline Fracture (Distal Patella)', confidence: '89.7%', box: { top: '45%', left: '40%', width: '20%', height: '15%' }, clinicalNote: 'Minor cortical disruption at the superior pole of the patella. Recommend knee immobilizer and orthopedic evaluation.' }
];

const DICTATION_PRESETS = [
  { text: 'Patient presents with acute substernal chest pain radiating to the left shoulder and jaw, accompanied by diaphoresis and mild dyspnea. Symptoms started 45 minutes ago during physical exertion.', label: 'Cardiac Emergency' },
  { text: 'Patient complains of chronic headache for the past 3 weeks, localized to the frontal area, worse in the mornings. Associated with mild photophobia and occasional nausea. No vision disturbances.', label: 'Neurological Follow-up' },
  { text: '6-year-old child presents with high-grade fever up to 103F for 2 days, persistent dry cough, sore throat, and generalized fatigue. Decreased appetite but drinking fluids.', label: 'Pediatric Acute' }
];

const BODY_SECTORS = [
  { id: 'head', name: 'Head & Brain', icon: '🧠', symptoms: ['Chronic migraines', 'Dizziness', 'Frontal headaches'], dept: 'Neurology', doctor: 'Dr. Sanjay Gupta' },
  { id: 'chest', name: 'Chest & Heart', icon: '🫁', symptoms: ['Angina / Chest Pain', 'Palpitations', 'Shortness of breath'], dept: 'Cardiology', doctor: 'Dr. Anil Mehta' },
  { id: 'abdomen', name: 'Abdomen & Stomach', icon: '🍕', symptoms: ['Acute abdominal pain', 'Nausea / vomiting', 'Acid reflux'], dept: 'General Medicine', doctor: 'Dr. Raman Pillai' },
  { id: 'joints', name: 'Joints & Bones', icon: '🦴', symptoms: ['Joint stiffness', 'Distal fractures', 'Knee arthritis'], dept: 'Orthopedics', doctor: 'Dr. Priya Nair' }
];

export default function AICommandCenter() {
  const [activeTab, setActiveTab] = useState('iot');
  const navigate = useNavigate();

  // --- 1. IoT Bedside Telemetry ---
  const canvasRef = useRef(null);
  const [heartRate, setHeartRate] = useState(72);
  const [spo2, setSpo2] = useState(98);
  const [bp, setBp] = useState('120/80');
  const [alertActive, setAlertActive] = useState(false);
  const ecgIndex = useRef(0);

  useEffect(() => {
    if (activeTab !== 'iot') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrame;
    const width = canvas.width;
    const height = canvas.height;
    
    const draw = () => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.fillRect(0, 0, width, height);

      // Grid lines
      ctx.strokeStyle = '#F0F4F8';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < width; i += 20) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke();
      }
      for (let i = 0; i < height; i += 20) {
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.stroke();
      }

      ctx.strokeStyle = alertActive ? '#E53E3E' : '#6EC89B';
      ctx.lineWidth = 2.5;
      ctx.beginPath();

      const points = [];
      const speed = 3;
      const step = speed;
      ecgIndex.current = (ecgIndex.current + step) % width;

      for (let x = 0; x < width; x++) {
        let y = height / 2;
        const pulseCycle = (x - ecgIndex.current + width) % 120;
        
        if (pulseCycle > 20 && pulseCycle < 25) {
          y -= 10;
        } else if (pulseCycle >= 25 && pulseCycle < 28) {
          y += 5;
        } else if (pulseCycle >= 28 && pulseCycle < 33) {
          y -= 50;
        } else if (pulseCycle >= 33 && pulseCycle < 37) {
          y += 20;
        } else if (pulseCycle >= 45 && pulseCycle < 55) {
          y -= 15;
        }
        points.push({ x, y });
      }

      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.stroke();

      animationFrame = requestAnimationFrame(draw);
    };

    draw();

    const interval = setInterval(() => {
      if (alertActive) {
        setHeartRate(Math.floor(Math.random() * (145 - 130) + 130));
        setSpo2(Math.floor(Math.random() * (89 - 85) + 85));
        setBp('155/98');
      } else {
        setHeartRate(prev => Math.max(60, Math.min(100, prev + Math.floor(Math.random() * 5) - 2)));
        setSpo2(prev => Math.max(95, Math.min(100, prev + Math.floor(Math.random() * 3) - 1)));
        setBp('120/80');
      }
    }, 2000);

    return () => {
      cancelAnimationFrame(animationFrame);
      clearInterval(interval);
    };
  }, [activeTab, alertActive]);

  // --- 2. AI Medical Scan ---
  const [selectedScan, setSelectedScan] = useState(MOCK_SCANS[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  const runDiagnostic = () => {
    setIsScanning(true);
    setScanResult(null);
    setTimeout(() => {
      setIsScanning(false);
      setScanResult(selectedScan);
    }, 2500);
  };

  // --- 3. AI Scribe & ICD Coder ---
  const [scribeInput, setScribeInput] = useState('');
  const [isScribing, setIsScribing] = useState(false);
  const [scribeOutput, setScribeOutput] = useState(null);

  const runScribe = () => {
    if (!scribeInput.trim()) return;
    setIsScribing(true);
    setTimeout(() => {
      setIsScribing(false);
      const lower = scribeInput.toLowerCase();
      if (lower.includes('chest') || lower.includes('cardiac') || lower.includes('shoulder')) {
        setScribeOutput({
          icdCode: 'ICD-10 I21.9: Acute Myocardial Infarction, Unspecified',
          primaryDept: 'Cardiology (Admit immediately)',
          clinicalSummary: 'Acute chest pain indicating coronary ischemia. Urgent ECG and cardiac enzymes required.',
          medications: [
            { name: 'Aspirin', dose: '325 mg chewed immediately' },
            { name: 'Nitroglycerin', dose: '0.4 mg sublingual q5min' }
          ]
        });
      } else if (lower.includes('headache') || lower.includes('photophobia')) {
        setScribeOutput({
          icdCode: 'ICD-10 G43.9: Migraine, Unspecified',
          primaryDept: 'Neurology',
          clinicalSummary: 'Chronic frontal headaches suspicious of chronic migraine. R/O intracranial pathology.',
          medications: [
            { name: 'Sumatriptan', dose: '50 mg oral' },
            { name: 'Propranolol', dose: '40 mg daily prophylaxis' }
          ]
        });
      } else {
        setScribeOutput({
          icdCode: 'ICD-10 J06.9: Acute Upper Respiratory Infection, Unspecified',
          primaryDept: 'Pediatrics / General Medicine',
          clinicalSummary: 'Acute febrile respiratory illness, likely viral upper respiratory tract infection.',
          medications: [
            { name: 'Paracetamol', dose: '250 mg syrup q6h prn fever' },
            { name: 'Saline Nasal Drops', dose: '2 drops each nostril tid' }
          ]
        });
      }
    }, 1500);
  };

  // --- 4. Blockchain Integrity Verification ---
  const [blockchainLogs, setBlockchainLogs] = useState([
    { id: 101, action: 'Access medical record', user: 'Dr. Anil Mehta', resource: 'PAT-1002', hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', verified: true },
    { id: 102, action: 'Update vitals', user: 'Sita Devi (Nurse)', resource: 'PAT-1002', hash: '8f73ac896f30e698888b50ea8796facb8a8b843de323e4210a8b981f4a9b60cf', verified: true },
    { id: 103, action: 'Dispense medication', user: 'Neha Gupta (Pharm)', resource: 'PRE-3001', hash: '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824', verified: true },
  ]);
  const [verifyingLog, setVerifyingLog] = useState(null);

  const verifyLedger = (id) => {
    setVerifyingLog(id);
    setTimeout(() => {
      setVerifyingLog(null);
      alert(`Ledger record #${id} cryptographic signature is VALID. Confirmed on blockchain.`);
    }, 1000);
  };

  // --- 5. Interactive Human Body Map ---
  const [selectedBodyPart, setSelectedBodyPart] = useState(BODY_SECTORS[0]);

  // --- 6. Live Bed Occupancy Heatmap ---
  const [beds, setBeds] = useState([
    { id: 'bed-1', name: 'ICU Bed 1', status: 'occupied', patient: 'Ravi Shankar' },
    { id: 'bed-2', name: 'ICU Bed 2', status: 'vacant', patient: null },
    { id: 'bed-3', name: 'ICU Bed 3', status: 'maintenance', patient: null },
    { id: 'bed-4', name: 'ICU Bed 4', status: 'isolation', patient: 'Unknown Male' },
    { id: 'bed-5', name: 'General A1', status: 'occupied', patient: 'Arjun Reddy' },
    { id: 'bed-6', name: 'General A2', status: 'vacant', patient: null },
    { id: 'bed-7', name: 'General A3', status: 'occupied', patient: 'Meera Krishnan' },
    { id: 'bed-8', name: 'General A4', status: 'vacant', patient: null },
    { id: 'bed-9', name: 'Maternity B1', status: 'occupied', patient: 'Priyanka Das' },
    { id: 'bed-10', name: 'Maternity B2', status: 'vacant', patient: null },
    { id: 'bed-11', name: 'Private Room 101', status: 'occupied', patient: 'Suresh Babu' },
    { id: 'bed-12', name: 'Private Room 102', status: 'vacant', patient: null }
  ]);
  const [selectedBed, setSelectedBed] = useState(null);

  const changeBedStatus = (bedId, newStatus) => {
    setBeds(prev => prev.map(b => b.id === bedId ? { ...b, status: newStatus, patient: newStatus === 'occupied' ? 'New Admission' : null } : b));
    setSelectedBed(null);
  };

  // --- 7. Smart Pill Tracker & Adherence ---
  const [pills, setPills] = useState([
    { id: 1, name: 'Amlodipine (5mg)', time: 'Morning (08:00 AM)', status: 'taken' },
    { id: 2, name: 'Aspirin (75mg)', time: 'Afternoon (01:00 PM)', status: 'taken' },
    { id: 3, name: 'Metformin (500mg)', time: 'Evening (08:00 PM)', status: 'pending' },
    { id: 4, name: 'Atorvastatin (10mg)', time: 'Night (10:00 PM)', status: 'pending' }
  ]);

  const togglePill = (id) => {
    setPills(prev => prev.map(p => {
      if (p.id === id) {
        const nextStatus = p.status === 'taken' ? 'missed' : p.status === 'missed' ? 'pending' : 'taken';
        return { ...p, status: nextStatus };
      }
      return p;
    }));
  };

  const takenCount = pills.filter(p => p.status === 'taken').length;
  const complianceScore = Math.round((takenCount / pills.length) * 100);

  // --- 8. Hospital Indoor Wayfinder ---
  const [wayfinderStart, setWayfinderStart] = useState('reception');
  const [wayfinderEnd, setWayfinderEnd] = useState('icu');
  const [drawingRoute, setDrawingRoute] = useState(false);

  const handleDrawRoute = () => {
    setDrawingRoute(true);
    setTimeout(() => {
      setDrawingRoute(false);
    }, 1500);
  };

  // --- 9. Digital Signature & PDF Generator ---
  const sigCanvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [reportForm, setReportForm] = useState({ patient: 'Arjun Reddy', test: 'Complete Blood Count (CBC)', result: 'Hemoglobin: 14.2 g/dL (Normal), WBC: 6.8 x10^3/uL (Normal), Platelets: 250 x10^3/uL (Normal)', remark: 'All blood indices are within satisfactory reference ranges. No immediate intervention required.' });

  const startSigDrawing = (e) => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const drawSig = (e) => {
    if (!isDrawing) return;
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = '#1A365D'; // Navy blue ink
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const stopSigDrawing = () => {
    setIsDrawing(false);
  };

  const clearSigPad = () => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const generatePDF = () => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const sigDataUrl = canvas.toDataURL();
    
    // Open a beautifully styled print window representing the generated PDF report
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
      <head>
        <title>Clinical Laboratory Report - MedCare HMS</title>
        <style>
          body { font-family: 'Inter', sans-serif; color: #2D3748; padding: 40px; line-height: 1.6; }
          .header { text-align: center; border-bottom: 2px solid #6EC89B; padding-bottom: 20px; margin-bottom: 30px; }
          .header h1 { margin: 0; color: #1A365D; font-size: 24px; }
          .header p { margin: 5px 0 0; color: #718096; font-size: 14px; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; background: #F8FAFB; padding: 15px; border-radius: 8px; border: 1px solid #E2E8F0; }
          .info-item { font-size: 13px; }
          .info-item strong { color: #4A5568; }
          .results-box { border: 1px solid #CBD5E0; border-radius: 8px; padding: 20px; margin-bottom: 30px; background: #FAFFFE; }
          .results-box h3 { margin: 0 0 10px; color: #2E7D32; font-size: 16px; border-bottom: 1px solid #C8E6C9; padding-bottom: 8px; }
          .footer-sign { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 50px; }
          .sign-box { text-align: center; border-top: 1px solid #A0AEC0; width: 200px; padding-top: 10px; }
          .sign-box img { max-width: 150px; max-height: 60px; display: block; margin: 0 auto 5px; }
          .watermark { position: absolute; top: 35%; left: 35%; font-size: 80px; color: rgba(110, 200, 155, 0.05); transform: rotate(-30deg); user-select: none; pointer-events: none; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="watermark">MEDCARE</div>
        <div class="header">
          <h1>MEDCARE HOSPITAL CLINICS</h1>
          <p>Super Specialty Health & Diagnostic Centre | Tel: +91 22 5555 1234</p>
        </div>
        <div class="info-grid">
          <div class="info-item"><strong>Patient Name:</strong> ${reportForm.patient}</div>
          <div class="info-item"><strong>Report Date:</strong> ${new Date().toLocaleDateString('en-IN')}</div>
          <div class="info-item"><strong>Diagnostic Test:</strong> ${reportForm.test}</div>
          <div class="info-item"><strong>Lab Reference:</strong> LAB-REF-${Math.floor(Math.random() * 9000 + 1000)}</div>
        </div>
        <div class="results-box">
          <h3>Test Findings & Analysis</h3>
          <p style="white-space: pre-wrap; font-size: 14px; margin: 0;">${reportForm.result}</p>
        </div>
        <div class="results-box" style="background:#fff;">
          <h3>Clinical Remarks</h3>
          <p style="font-size: 14px; margin: 0;">${reportForm.remark}</p>
        </div>
        <div class="footer-sign">
          <div>
            <p style="font-size: 11px; color: #718096; margin: 0;">This report is electronically signed and secured on the blockchain ledger.</p>
          </div>
          <div class="sign-box">
            <img src="${sigDataUrl}" alt="Doctor Signature" />
            <strong>Authorized Signatory</strong>
            <p style="font-size: 11px; color: #718096; margin: 2px 0 0;">Consultant Pathologist</p>
          </div>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print(); // Automatically open browser's PDF save/print options
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Sparkles size={28} style={{ color: '#6EC89B' }} /> AI Command Center
          </h1>
          <p style={{ color: '#718096' }}>Advanced operations control, clinical tools, and security ledger</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, borderBottom: '1px solid #E2E8F0', paddingBottom: 12, flexWrap: 'wrap' }}>
        <button className={`btn ${activeTab === 'iot' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('iot')}>
          <Activity size={16} /> IoT Bedsides
        </button>
        <button className={`btn ${activeTab === 'diagnostics' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('diagnostics')}>
          <Brain size={16} /> AI Diagnostics
        </button>
        <button className={`btn ${activeTab === 'scribe' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('scribe')}>
          <Cpu size={16} /> AI Scribe
        </button>
        <button className={`btn ${activeTab === 'bodymap' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('bodymap')}>
          <User size={16} /> Body Symptom Map
        </button>
        <button className={`btn ${activeTab === 'bedgrid' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('bedgrid')}>
          <TrendingUp size={16} /> Bed Occupancy Heatmap
        </button>
        <button className={`btn ${activeTab === 'pills' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('pills')}>
          <CheckCircle size={16} /> Smart Pill & Wait-Time
        </button>
        <button className={`btn ${activeTab === 'wayfinder' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('wayfinder')}>
          <Map size={16} /> Indoor Wayfinder
        </button>
        <button className={`btn ${activeTab === 'sigpad' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('sigpad')}>
          <Edit2 size={16} /> Digital Signature Pad
        </button>
        <button className={`btn ${activeTab === 'blockchain' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('blockchain')}>
          <ShieldCheck size={16} /> Blockchain Ledger
        </button>
      </div>

      {/* Content Panels */}
      <div className="animate-fade-in-up">

        {/* TAB 1: IoT Bedsides */}
        {activeTab === 'iot' && (
          <div className="grid grid-2">
            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div className="card-header">
                <h3>Live Bedside Monitor (Room ICU-3)</h3>
                <span className={`status-badge ${alertActive ? 'status-cancelled' : 'status-confirmed'}`}>
                  {alertActive ? '🚨 CRITICAL EMERGENCY' : '💚 STABLE'}
                </span>
              </div>
              <div style={{ background: '#0F172A', borderRadius: 8, padding: 12, position: 'relative' }}>
                <canvas ref={canvasRef} width={450} height={200} style={{ width: '100%', height: 200, display: 'block', background: 'transparent' }} />
                {alertActive && (
                  <div style={{ position: 'absolute', inset: 0, border: '3px solid #E53E3E', borderRadius: 8, pointerEvents: 'none', animation: 'pulseBorder 1.2s infinite' }}></div>
                )}
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                <button className={`btn ${alertActive ? 'btn-primary' : 'btn-danger'} w-full`} onClick={() => setAlertActive(!alertActive)}>
                  {alertActive ? 'Reset Vital Feeds' : 'Simulate Cardiac Drop'}
                </button>
              </div>
            </div>

            <div className="card">
              <div className="card-header"><h3>Vitals Telemetry</h3></div>
              <div className="grid grid-3" style={{ gap: 12, marginBottom: 20 }}>
                <div style={{ background: alertActive ? '#FFF5F5' : '#FAFFFE', padding: 16, borderRadius: 12, border: '1px solid #E2E8F0', textAlign: 'center' }}>
                  <div style={{ fontSize: 24 }}>💓</div>
                  <div style={{ color: '#718096', fontSize: 12, marginTop: 4 }}>Heart Rate</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: alertActive ? '#C53030' : '#2D3748' }}>{heartRate} bpm</div>
                </div>
                <div style={{ background: alertActive ? '#FFF5F5' : '#FAFFFE', padding: 16, borderRadius: 12, border: '1px solid #E2E8F0', textAlign: 'center' }}>
                  <div style={{ fontSize: 24 }}>💨</div>
                  <div style={{ color: '#718096', fontSize: 12, marginTop: 4 }}>SpO2</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: alertActive ? '#C53030' : '#2D3748' }}>{spo2}%</div>
                </div>
                <div style={{ background: '#FAFFFE', padding: 16, borderRadius: 12, border: '1px solid #E2E8F0', textAlign: 'center' }}>
                  <div style={{ fontSize: 24 }}>🩸</div>
                  <div style={{ color: '#718096', fontSize: 12, marginTop: 4 }}>Blood Pressure</div>
                  <div style={{ fontSize: 22, fontWeight: 700 }}>{bp}</div>
                </div>
              </div>
              <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: 16 }}>
                <h4 style={{ marginBottom: 12 }}>System Telemetry Actions</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ fontSize: 13, display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#718096' }}>ECG Sensor status</span><span style={{ color: '#6EC89B', fontWeight: 600 }}>Active</span></div>
                  <div style={{ fontSize: 13, display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#718096' }}>Alert Escalation Group</span><span>ICU-Cardiology-OnCall</span></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AI Diagnostics */}
        {activeTab === 'diagnostics' && (
          <div className="grid grid-2">
            <div className="card">
              <div className="card-header"><h3>Select Scan Case</h3></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {MOCK_SCANS.map(scan => (
                  <button key={scan.id} className={`quick-action-btn ${selectedScan.id === scan.id ? 'active' : ''}`}
                    style={selectedScan.id === scan.id ? { borderColor: '#6EC89B', background: '#E8F5E9' } : {}}
                    onClick={() => { setSelectedScan(scan); setScanResult(null); }}>
                    <span style={{ fontWeight: 600 }}>{scan.name}</span>
                  </button>
                ))}
              </div>
              <button className="btn btn-primary w-full" style={{ marginTop: 20 }} onClick={runDiagnostic} disabled={isScanning}>
                {isScanning ? 'AI Computing Scan...' : 'Analyze with Medical AI'}
              </button>
            </div>

            <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div className="card-header" style={{ width: '100%' }}><h3>Imaging Viewer</h3></div>
              <div style={{ position: 'relative', width: 280, height: 280, borderRadius: 12, overflow: 'hidden', border: '1px solid #CBD5E0', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={selectedScan.url} alt="Medical Scan" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
                {isScanning && (
                  <div className="scanner-line" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: '#6EC89B', boxShadow: '0 0 10px #6EC89B', animation: 'scanWave 1.5s infinite linear' }}></div>
                )}
                {scanResult && scanResult.id === selectedScan.id && (
                  <div style={{
                    position: 'absolute', top: selectedScan.box.top, left: selectedScan.box.left,
                    width: selectedScan.box.width, height: selectedScan.box.height,
                    border: '2px solid #E53E3E', background: 'rgba(229, 62, 62, 0.15)',
                    borderRadius: 4, boxSizing: 'border-box'
                  }}>
                    <span style={{ position: 'absolute', top: -18, left: 0, background: '#E53E3E', color: '#fff', fontSize: 10, padding: '2px 4px', borderRadius: 3, fontWeight: 'bold' }}>
                      {selectedScan.anomaly}
                    </span>
                  </div>
                )}
              </div>
              {scanResult && scanResult.id === selectedScan.id && (
                <div style={{ marginTop: 16, width: '100%', background: '#F8FAFB', padding: 12, borderRadius: 8, fontSize: '0.85rem' }}>
                  <div style={{ fontWeight: 700, color: '#C53030', marginBottom: 4 }}>Anomaly Detected: {scanResult.anomaly} ({scanResult.confidence})</div>
                  <div><strong>Clinical Suggestion:</strong> {scanResult.clinicalNote}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: AI Scribe */}
        {activeTab === 'scribe' && (
          <div className="grid grid-2">
            <div className="card">
              <div className="card-header"><h3>AI Scribe Input</h3></div>
              <p style={{ color: '#718096', fontSize: 13, marginBottom: 12 }}>Type clinical remarks or click a preset below:</p>
              <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
                {DICTATION_PRESETS.map((preset, idx) => (
                  <button key={idx} className="btn btn-outline btn-sm" style={{ fontSize: 11 }} onClick={() => setScribeInput(preset.text)}>
                    {preset.label}
                  </button>
                ))}
              </div>
              <textarea className="input" placeholder="Start typing symptoms..." style={{ minHeight: 120, resize: 'vertical' }} value={scribeInput} onChange={(e) => setScribeInput(e.target.value)} />
              <button className="btn btn-primary w-full" style={{ marginTop: 12 }} onClick={runScribe} disabled={isScribing || !scribeInput.trim()}>
                {isScribing ? 'AI Coding Scribe...' : 'Synthesize and Get ICD-10 Codes'}
              </button>
            </div>

            <div className="card">
              <div className="card-header"><h3>Structured Output</h3></div>
              {isScribing && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: 200 }}>
                  <RefreshCw size={32} className="animate-spin" style={{ color: '#6EC89B' }} />
                  <span style={{ marginTop: 12, color: '#718096' }}>Parsing clinical notes...</span>
                </div>
              )}
              {!isScribing && !scribeOutput && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: 200, color: '#A0AEC0', textAlign: 'center' }}>
                  <FileText size={48} />
                  <span style={{ marginTop: 12 }}>ICD-10 clinical codes and initial treatment summaries will appear here.</span>
                </div>
              )}
              {!isScribing && scribeOutput && (
                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ background: '#E3F2FD', padding: 12, borderRadius: 8, borderLeft: '4px solid #1565C0' }}>
                    <div style={{ fontSize: 11, color: '#1565C0', fontWeight: 600 }}>Mapped ICD-10 Diagnosis</div>
                    <div style={{ fontSize: 15, fontWeight: 700, marginTop: 2, color: '#0D47A1' }}>{scribeOutput.icdCode}</div>
                  </div>
                  <div>
                    <strong>Suggested Referral:</strong> <span className="badge badge-teal" style={{ marginLeft: 8 }}>{scribeOutput.primaryDept}</span>
                  </div>
                  <div><strong>Summary:</strong> <p style={{ fontSize: 13, color: '#4A5568', marginTop: 4 }}>{scribeOutput.clinicalSummary}</p></div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: Body Symptom Map */}
        {activeTab === 'bodymap' && (
          <div className="grid grid-2">
            <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div className="card-header" style={{ width: '100%' }}><h3>Interactive Anatomy Map</h3></div>
              <p style={{ color: '#718096', fontSize: 13, marginBottom: 20, textAlign: 'center' }}>Click any area on the body to analyze corresponding symptoms.</p>
              <div style={{ position: 'relative', width: 180, height: 350, border: '1px solid #E2E8F0', borderRadius: 20, background: '#F8FAFB', display: 'flex', justifyContent: 'center', padding: '16px 0' }}>
                <svg viewBox="0 0 100 220" width="100%" height="100%">
                  <circle cx="50" cy="25" r="15" fill={selectedBodyPart.id === 'head' ? '#A8D5BA' : '#CBD5E0'} stroke="#718096" strokeWidth="1.5" style={{ cursor: 'pointer' }} onClick={() => setSelectedBodyPart(BODY_SECTORS[0])} />
                  <rect x="47" y="40" width="6" height="10" fill="#CBD5E0" />
                  <rect x="35" y="50" width="30" height="50" rx="5" fill={selectedBodyPart.id === 'chest' ? '#A8C8E8' : '#CBD5E0'} stroke="#718096" strokeWidth="1.5" style={{ cursor: 'pointer' }} onClick={() => setSelectedBodyPart(BODY_SECTORS[1])} />
                  <rect x="35" y="100" width="30" height="35" rx="3" fill={selectedBodyPart.id === 'abdomen' ? '#FFE0B2' : '#CBD5E0'} stroke="#718096" strokeWidth="1.5" style={{ cursor: 'pointer' }} onClick={() => setSelectedBodyPart(BODY_SECTORS[2])} />
                  <path d="M 30,52 L 15,110" stroke="#718096" strokeWidth="8" strokeLinecap="round" fill="none" />
                  <path d="M 70,52 L 85,110" stroke="#718096" strokeWidth="8" strokeLinecap="round" fill="none" />
                  <path d="M 40,135 L 40,200" stroke={selectedBodyPart.id === 'joints' ? '#E8D5E8' : '#718096'} strokeWidth="10" strokeLinecap="round" fill="none" style={{ cursor: 'pointer' }} onClick={() => setSelectedBodyPart(BODY_SECTORS[3])} />
                  <path d="M 60,135 L 60,200" stroke={selectedBodyPart.id === 'joints' ? '#E8D5E8' : '#718096'} strokeWidth="10" strokeLinecap="round" fill="none" style={{ cursor: 'pointer' }} onClick={() => setSelectedBodyPart(BODY_SECTORS[3])} />
                </svg>
              </div>
            </div>

            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className="card-header">
                <span style={{ fontSize: 32 }}>{selectedBodyPart.icon}</span>
                <h3 style={{ margin: '4px 0 0' }}>{selectedBodyPart.name} Analysis</h3>
              </div>
              <div style={{ marginTop: 12 }}>
                <h4 style={{ fontSize: 13, color: '#718096', marginBottom: 8 }}>Common Associated Symptoms:</h4>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                  {selectedBodyPart.symptoms.map((s, i) => <span key={i} className="badge badge-gray">{s}</span>)}
                </div>
                <div style={{ background: '#FAFFFE', padding: 14, border: '1px solid #E2E8F0', borderRadius: 8, marginBottom: 16 }}>
                  <div style={{ fontSize: 12, color: '#718096' }}>Recommended Department</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#6EC89B', marginTop: 2 }}>{selectedBodyPart.dept}</div>
                  <div style={{ fontSize: 13, color: '#4A5568', marginTop: 4 }}>Consult Specialist: <strong>{selectedBodyPart.doctor}</strong></div>
                </div>
                <button className="btn btn-primary w-full" onClick={() => navigate('/book-appointment')}>Book Referral Appointment</button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: Bed Occupancy Heatmap */}
        {activeTab === 'bedgrid' && (
          <div className="card animate-fade-in">
            <div className="card-header">
              <h3>Live Bed Ward Heatmap</h3>
              <div style={{ display: 'flex', gap: 12, fontSize: 12 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#68D391' }}></span> Vacant</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FC8181' }}></span> Occupied</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#F6AD55' }}></span> Cleaning</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#63B3ED' }}></span> Isolation</span>
              </div>
            </div>
            <div className="grid grid-4" style={{ gap: 12, marginTop: 12 }}>
              {beds.map(bed => {
                const colorMap = { vacant: '#68D391', occupied: '#FC8181', maintenance: '#F6AD55', isolation: '#63B3ED' };
                return (
                  <div key={bed.id} className="quick-action-btn"
                    style={{
                      borderLeft: `5px solid ${colorMap[bed.status]}`, padding: 12, cursor: 'pointer',
                      ...(selectedBed?.id === bed.id ? { borderColor: '#2D3748', background: '#EDF2F7' } : {})
                    }}
                    onClick={() => setSelectedBed(bed)}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{bed.name}</div>
                    <div style={{ fontSize: 11, color: '#718096', marginTop: 2 }}>{bed.patient || 'No Patient'}</div>
                    <span style={{ fontSize: 10, textTransform: 'uppercase', fontWeight: 700, color: colorMap[bed.status], marginTop: 6, display: 'block' }}>
                      {bed.status}
                    </span>
                  </div>
                );
              })}
            </div>
            {selectedBed && (
              <div style={{ marginTop: 20, padding: 16, background: '#F8FAFB', borderRadius: 12, border: '1px solid #CBD5E0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: 0 }}>Configure {selectedBed.name}</h4>
                  <p style={{ fontSize: 12, color: '#718096', margin: '4px 0 0' }}>Current status: <strong>{selectedBed.status}</strong></p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-outline btn-sm" onClick={() => changeBedStatus(selectedBed.id, 'vacant')}>Make Vacant</button>
                  <button className="btn btn-outline btn-sm" onClick={() => changeBedStatus(selectedBed.id, 'occupied')}>Admit Patient</button>
                  <button className="btn btn-outline btn-sm" onClick={() => changeBedStatus(selectedBed.id, 'maintenance')}>Set Maintenance</button>
                  <button className="btn btn-outline btn-sm" onClick={() => changeBedStatus(selectedBed.id, 'isolation')}>Set Isolation</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: Smart Pill & Wait-Time */}
        {activeTab === 'pills' && (
          <div className="grid grid-2">
            <div className="card">
              <div className="card-header">
                <h3>Medication Adherence Checklist</h3>
                <span className="badge badge-green">Taken: {complianceScore}%</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
                {pills.map(p => (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: 8, background: p.status === 'taken' ? '#F0FFF4' : p.status === 'missed' ? '#FFF5F5' : '#fff' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, textDecoration: p.status === 'taken' ? 'line-through' : 'none', color: p.status === 'taken' ? '#718096' : '#2D3748' }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: '#A0AEC0' }}>{p.time}</div>
                    </div>
                    <button className={`btn btn-sm ${p.status === 'taken' ? 'btn-primary' : 'btn-outline'}`} style={{ padding: '4px 8px', fontSize: 11 }} onClick={() => togglePill(p.id)}>
                      {p.status === 'taken' ? <Check size={12} /> : 'Mark Taken'}
                    </button>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                  <span>Adherence Score</span>
                  <span>{complianceScore}%</span>
                </div>
                <div style={{ width: '100%', height: 8, background: '#E2E8F0', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${complianceScore}%`, height: '100%', background: '#6EC89B', transition: 'width 0.3s' }}></div>
                </div>
              </div>
            </div>

            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div className="card-header"><h3>AI Patient Wait-Time Predictor</h3></div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 0' }}>
                <div style={{ width: 140, height: 140, borderRadius: '50%', border: '8px solid #E2E8F0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderTopColor: '#6EC89B', borderRightColor: '#6FA8DC' }}>
                  <Clock size={28} style={{ color: '#6EC89B' }} />
                  <div style={{ fontSize: 24, fontWeight: 700, marginTop: 4 }}>18m</div>
                  <div style={{ fontSize: 10, color: '#A0AEC0' }}>Est. Waiting Time</div>
                </div>
                <div style={{ marginTop: 16, textAlign: 'center' }}>
                  <h4>Queue Traffic: Moderate</h4>
                  <p style={{ color: '#718096', fontSize: 12, marginTop: 4 }}>3 patients ahead in outpatient Cardiology OPD queue.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: Hospital Indoor Wayfinder */}
        {activeTab === 'wayfinder' && (
          <div className="grid grid-2">
            <div className="card">
              <div className="card-header"><h3>Hospital Wayfinder Navigation</h3></div>
              <p style={{ color: '#718096', fontSize: 13, marginBottom: 16 }}>Select locations to compute your walking route inside the main wing.</p>
              
              <div className="input-group">
                <label>Starting Point</label>
                <select className="input" value={wayfinderStart} onChange={(e) => setWayfinderStart(e.target.value)}>
                  <option value="reception">Main Entrance / Reception</option>
                  <option value="er">Emergency Room (ER)</option>
                  <option value="pharmacy">Pharmacy Hall</option>
                </select>
              </div>

              <div className="input-group">
                <label>Destination Department</label>
                <select className="input" value={wayfinderEnd} onChange={(e) => setWayfinderEnd(e.target.value)}>
                  <option value="icu">Intensive Care Unit (ICU)</option>
                  <option value="cardiology">Cardiology OPD Room 12</option>
                  <option value="laboratory">Diagnostic Laboratory</option>
                </select>
              </div>

              <button className="btn btn-primary w-full" style={{ marginTop: 12 }} onClick={handleDrawRoute} disabled={drawingRoute}>
                {drawingRoute ? 'Computing Walk Path...' : 'Draw Walk Route'}
              </button>
            </div>

            <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div className="card-header" style={{ width: '100%' }}><h3>Indoor Map Layout</h3></div>
              
              {/* Floor Layout Map Represented Visually */}
              <div style={{ position: 'relative', width: 280, height: 260, border: '1px solid #CBD5E0', borderRadius: 12, background: '#FAFFFE', overflow: 'hidden' }}>
                {/* Rooms */}
                <div style={{ position: 'absolute', top: 10, left: 10, width: 80, height: 60, border: '1px solid #E2E8F0', background: wayfinderEnd === 'icu' ? '#E8F5E9' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 'bold' }}>ICU</div>
                <div style={{ position: 'absolute', top: 10, left: 190, width: 80, height: 60, border: '1px solid #E2E8F0', background: wayfinderEnd === 'cardiology' ? '#E8F5E9' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 'bold' }}>Cardiology</div>
                <div style={{ position: 'absolute', top: 190, left: 10, width: 80, height: 60, border: '1px solid #E2E8F0', background: wayfinderStart === 'reception' ? '#E3F2FD' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 'bold' }}>Reception</div>
                <div style={{ position: 'absolute', top: 190, left: 190, width: 80, height: 60, border: '1px solid #E2E8F0', background: wayfinderStart === 'pharmacy' ? '#E3F2FD' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 'bold' }}>Pharmacy</div>
                
                {/* Corridors */}
                <div style={{ position: 'absolute', top: 70, left: 100, width: 80, height: 120, borderLeft: '1px dashed #A0AEC0', borderRight: '1px dashed #A0AEC0' }}></div>

                {/* Animated Path SVG Overlay */}
                <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                  {wayfinderStart === 'reception' && wayfinderEnd === 'cardiology' && (
                    <path d="M 50,190 L 50,100 L 230,100 L 230,70" fill="none" stroke="#6EC89B" strokeWidth="4" strokeDasharray="8" style={{ animation: drawingRoute ? 'none' : 'dash 2s linear infinite' }} />
                  )}
                  {wayfinderStart === 'reception' && wayfinderEnd === 'icu' && (
                    <path d="M 50,190 L 50,70" fill="none" stroke="#6EC89B" strokeWidth="4" strokeDasharray="8" style={{ animation: drawingRoute ? 'none' : 'dash 2s linear infinite' }} />
                  )}
                  {wayfinderStart === 'pharmacy' && wayfinderEnd === 'icu' && (
                    <path d="M 230,190 L 230,100 L 50,100 L 50,70" fill="none" stroke="#6EC89B" strokeWidth="4" strokeDasharray="8" style={{ animation: drawingRoute ? 'none' : 'dash 2s linear infinite' }} />
                  )}
                </svg>

                {drawingRoute && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 500 }}>
                    Recalculating routing...
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: Digital Signature Pad & PDF */}
        {activeTab === 'sigpad' && (
          <div className="grid grid-2">
            <div className="card">
              <div className="card-header"><h3>Laboratory Report Fields</h3></div>
              <div className="input-group">
                <label>Patient Name</label>
                <input className="input" value={reportForm.patient} onChange={(e) => setReportForm({ ...reportForm, patient: e.target.value })} />
              </div>
              <div className="input-group">
                <label>Diagnostic Test Name</label>
                <input className="input" value={reportForm.test} onChange={(e) => setReportForm({ ...reportForm, test: e.target.value })} />
              </div>
              <div className="input-group">
                <label>Analytical Findings</label>
                <textarea className="input" style={{ minHeight: 60 }} value={reportForm.result} onChange={(e) => setReportForm({ ...reportForm, result: e.target.value })} />
              </div>
              <div className="input-group">
                <label>Pathologist Remarks</label>
                <input className="input" value={reportForm.remark} onChange={(e) => setReportForm({ ...reportForm, remark: e.target.value })} />
              </div>
            </div>

            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div className="card-header"><h3>Pathologist Signature Pad</h3></div>
              <p style={{ color: '#718096', fontSize: 12, marginBottom: 8 }}>Draw your clinical signature below using your mouse or touchscreen:</p>
              
              <div style={{ border: '1px solid #CBD5E0', borderRadius: 8, background: '#fff', overflow: 'hidden' }}>
                <canvas ref={sigCanvasRef} width={300} height={120} style={{ display: 'block', background: '#FAFFFE', cursor: 'crosshair', width: '100%', height: 120 }}
                  onMouseDown={startSigDrawing} onMouseMove={drawSig} onMouseUp={stopSigDrawing} onMouseLeave={stopSigDrawing} />
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button className="btn btn-outline w-full btn-sm" onClick={clearSigPad}>Clear Pad</button>
                <button className="btn btn-primary w-full btn-sm" onClick={generatePDF}>Generate & Print PDF</button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: Blockchain Audit Ledger */}
        {activeTab === 'blockchain' && (
          <div className="card">
            <div className="card-header">
              <h3>Tamper-Proof EHR Audit Trail</h3>
              <button className="btn btn-outline btn-sm" onClick={() => alert('All ledger logs verify clean. Zero anomalies.')}>
                <ShieldCheck size={14} style={{ marginRight: 4 }} /> Audit Complete Trail
              </button>
            </div>
            <p style={{ color: '#718096', fontSize: 13, marginBottom: 16 }}>
              Every access to patient records is registered on a decentralized ledger. Access hashes are verifiable by clicking the key.
            </p>
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr><th>Log ID</th><th>User Action</th><th>Resource ID</th><th>Cryptographic Access Hash</th><th>Security Verification</th></tr>
                </thead>
                <tbody>
                  {blockchainLogs.map(log => (
                    <tr key={log.id}>
                      <td>#{log.id}</td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{log.action}</div>
                        <div style={{ fontSize: 11, color: '#718096' }}>by {log.user}</div>
                      </td>
                      <td><span className="badge badge-blue">{log.resource}</span></td>
                      <td>
                        <code style={{ fontSize: 11, background: '#F0F4F8', padding: '2px 6px', borderRadius: 4, color: '#4A5568' }}>
                          {log.hash.slice(0, 16)}...
                        </code>
                      </td>
                      <td>
                        <button className="btn btn-ghost btn-sm" style={{ color: '#6EC89B' }} onClick={() => verifyLedger(log.id)} disabled={verifyingLog === log.id}>
                          {verifyingLog === log.id ? 'Decrypting...' : 'Verify Signature'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
