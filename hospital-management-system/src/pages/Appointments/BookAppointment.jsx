import { useState } from 'react';
import { CalendarPlus, Sparkles, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { DEPARTMENTS, TIME_SLOTS } from '../../utils/constants';

const DOCTORS_BY_DEPT = {
  'Cardiology': [{ id: 'DOC-101', name: 'Dr. Anil Mehta', fee: '₹1,500' }, { id: 'DOC-108', name: 'Dr. Sunita Agarwal', fee: '₹2,000' }],
  'Neurology': [{ id: 'DOC-102', name: 'Dr. Sanjay Gupta', fee: '₹1,800' }],
  'Orthopedics': [{ id: 'DOC-103', name: 'Dr. Priya Nair', fee: '₹1,200' }],
  'Pediatrics': [{ id: 'DOC-104', name: 'Dr. Rekha Sharma', fee: '₹1,000' }],
  'Dermatology': [{ id: 'DOC-105', name: 'Dr. Vikram Joshi', fee: '₹1,100' }],
  'General Medicine': [{ id: 'DOC-107', name: 'Dr. Raman Pillai', fee: '₹800' }],
  'Ophthalmology': [{ id: 'DOC-106', name: 'Dr. Anjali Verma', fee: '₹1,300' }],
  'Emergency': [{ id: 'DOC-108', name: 'Dr. Sunita Agarwal', fee: '₹2,000' }],
};

export default function BookAppointment() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ department: '', doctor: '', date: '', time: '', symptoms: '' });

  const doctors = DOCTORS_BY_DEPT[form.department] || [];

  return (
    <div>
      <div className="page-header"><div><h1>Book Appointment</h1><p style={{ color: '#718096' }}>Schedule a new consultation</p></div></div>

      <div className="card animate-fade-in-up" style={{ maxWidth: 700, margin: '0 auto' }}>
        <div className="steps" style={{ marginBottom: 32 }}>
          {['Department', 'Doctor', 'Date & Time', 'Confirm'].map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
              <div className={`step ${step === i + 1 ? 'active' : step > i + 1 ? 'completed' : ''}`}>
                <div className="step-circle">{step > i + 1 ? <Check size={14} /> : i + 1}</div>
                <span className="step-label">{s}</span>
              </div>
              {i < 3 && <div className={`step-line ${step > i + 1 ? 'completed' : ''}`}></div>}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="animate-fade-in">
            <h3 style={{ marginBottom: 16 }}>Select Department</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              {DEPARTMENTS.map(d => (
                <button key={d.id} className={`quick-action-btn ${form.department === d.name ? 'active' : ''}`}
                  style={form.department === d.name ? { borderColor: '#6EC89B', background: '#E8F5E9' } : {}}
                  onClick={() => setForm({ ...form, department: d.name })}>
                  <span style={{ fontWeight: 600 }}>{d.name}</span>
                  <span style={{ fontSize: 11, color: '#718096' }}>{d.description}</span>
                </button>
              ))}
            </div>
            <button className="btn btn-primary w-full" style={{ marginTop: 20 }} disabled={!form.department} onClick={() => setStep(2)}>
              Next <ArrowRight size={16} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            <h3 style={{ marginBottom: 16 }}>Select Doctor — {form.department}</h3>
            {doctors.map(d => (
              <div key={d.id} className="quick-action-btn" style={{ flexDirection: 'row', justifyContent: 'space-between', cursor: 'pointer', ...(form.doctor === d.name ? { borderColor: '#6EC89B', background: '#E8F5E9' } : {}) }}
                onClick={() => setForm({ ...form, doctor: d.name })}>
                <span style={{ fontWeight: 600 }}>{d.name}</span>
                <span className="badge badge-green">{d.fee}</span>
              </div>
            ))}
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setStep(1)}><ArrowLeft size={16} /> Back</button>
              <button className="btn btn-primary" style={{ flex: 1 }} disabled={!form.doctor} onClick={() => setStep(3)}>Next <ArrowRight size={16} /></button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in">
            <h3 style={{ marginBottom: 16 }}>Select Date & Time</h3>
            <div className="input-group"><label>Date</label><input className="input" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
            <label style={{ fontSize: 14, fontWeight: 500, marginBottom: 8, display: 'block' }}>Available Time Slots</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              {TIME_SLOTS.map(slot => (
                <button key={slot} className={`btn ${form.time === slot ? 'btn-primary' : 'btn-outline'} btn-sm`} onClick={() => setForm({ ...form, time: slot })}>{slot}</button>
              ))}
            </div>
            <div className="input-group"><label>Symptoms / Notes</label><textarea className="input" placeholder="Describe your symptoms..." value={form.symptoms} onChange={(e) => setForm({ ...form, symptoms: e.target.value })} /></div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setStep(2)}><ArrowLeft size={16} /> Back</button>
              <button className="btn btn-primary" style={{ flex: 1 }} disabled={!form.date || !form.time} onClick={() => setStep(4)}>Review <ArrowRight size={16} /></button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="animate-fade-in">
            <h3 style={{ marginBottom: 16 }}>Confirm Appointment</h3>
            <div style={{ background: '#F8FAFB', padding: 20, borderRadius: 12, marginBottom: 20 }}>
              {[['Department', form.department], ['Doctor', form.doctor], ['Date', form.date], ['Time', form.time], ['Symptoms', form.symptoms || 'None specified']].map(([label, value], i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < 4 ? '1px solid #E2E8F0' : 'none' }}>
                  <span style={{ color: '#718096' }}>{label}</span>
                  <span style={{ fontWeight: 500 }}>{value}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setStep(3)}><ArrowLeft size={16} /> Back</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => alert('Appointment booked successfully!')}><Check size={16} /> Confirm Booking</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
