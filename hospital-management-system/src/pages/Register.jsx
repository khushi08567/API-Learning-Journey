import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Cross, User, Mail, Lock, Phone, MapPin, Heart, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { BLOOD_GROUPS } from '../utils/constants';

export default function Register() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '', address: '', city: '', state: '', zipCode: '', bloodGroup: '', allergies: '', emergencyName: '', emergencyPhone: '' });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    const result = await register(form);
    if (result.success) navigate('/');
    else setError(result.error);
  };

  const steps = [
    { label: 'Personal', icon: User },
    { label: 'Contact', icon: Phone },
    { label: 'Medical', icon: Heart },
  ];

  return (
    <div className="login-page">
      <div className="login-bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
      </div>

      <div className="login-card" style={{ maxWidth: 500 }}>
        <div className="login-logo">
          <div className="login-logo-icon"><Cross size={32} /></div>
          <h1>Create Account</h1>
          <p>Register as a new patient</p>
        </div>

        <div className="steps">
          {steps.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
              <div className={`step ${step === i + 1 ? 'active' : step > i + 1 ? 'completed' : ''}`}>
                <div className="step-circle">{step > i + 1 ? <Check size={14} /> : i + 1}</div>
                <span className="step-label">{s.label}</span>
              </div>
              {i < 2 && <div className={`step-line ${step > i + 1 ? 'completed' : ''}`}></div>}
            </div>
          ))}
        </div>

        {error && (
          <div style={{ padding: '10px 16px', background: '#FFF5F5', color: '#C53030', borderRadius: 8, fontSize: '0.875rem', marginBottom: 16 }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="animate-fade-in">
              <div className="input-group">
                <label>Full Name</label>
                <input className="input" placeholder="Enter full name" value={form.name} onChange={(e) => update('name', e.target.value)} required />
              </div>
              <div className="input-group">
                <label>Email</label>
                <input className="input" type="email" placeholder="Enter email" value={form.email} onChange={(e) => update('email', e.target.value)} required />
              </div>
              <div className="input-group">
                <label>Password</label>
                <input className="input" type="password" placeholder="Create password" value={form.password} onChange={(e) => update('password', e.target.value)} required />
              </div>
              <div className="input-group">
                <label>Confirm Password</label>
                <input className="input" type="password" placeholder="Confirm password" value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} required />
              </div>
              <button type="button" className="btn btn-primary w-full" onClick={() => setStep(2)}>
                Next <ArrowRight size={16} />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in">
              <div className="input-group">
                <label>Phone Number</label>
                <input className="input" placeholder="Enter phone number" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
              </div>
              <div className="input-group">
                <label>Address</label>
                <input className="input" placeholder="Street address" value={form.address} onChange={(e) => update('address', e.target.value)} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="input-group">
                  <label>City</label>
                  <input className="input" placeholder="City" value={form.city} onChange={(e) => update('city', e.target.value)} />
                </div>
                <div className="input-group">
                  <label>State</label>
                  <input className="input" placeholder="State" value={form.state} onChange={(e) => update('state', e.target.value)} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setStep(1)}>
                  <ArrowLeft size={16} /> Back
                </button>
                <button type="button" className="btn btn-primary" style={{ flex: 1 }} onClick={() => setStep(3)}>
                  Next <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in">
              <div className="input-group">
                <label>Blood Group</label>
                <select className="input" value={form.bloodGroup} onChange={(e) => update('bloodGroup', e.target.value)}>
                  <option value="">Select blood group</option>
                  {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                </select>
              </div>
              <div className="input-group">
                <label>Allergies (comma separated)</label>
                <input className="input" placeholder="e.g., Penicillin, Dust" value={form.allergies} onChange={(e) => update('allergies', e.target.value)} />
              </div>
              <div className="input-group">
                <label>Emergency Contact Name</label>
                <input className="input" placeholder="Emergency contact name" value={form.emergencyName} onChange={(e) => update('emergencyName', e.target.value)} />
              </div>
              <div className="input-group">
                <label>Emergency Contact Phone</label>
                <input className="input" placeholder="Emergency contact phone" value={form.emergencyPhone} onChange={(e) => update('emergencyPhone', e.target.value)} />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setStep(2)}>
                  <ArrowLeft size={16} /> Back
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Register <Check size={16} />
                </button>
              </div>
            </div>
          )}
        </form>

        <div className="login-register" style={{ marginTop: 16 }}>
          Already have an account? <Link to="/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
