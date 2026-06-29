import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Cross, Mail, Lock, ArrowRight } from 'lucide-react';
import { DEMO_CREDENTIALS } from '../utils/constants';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password || 'demo');
    setLoading(false);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
  };

  const quickLogin = async (demoEmail) => {
    setEmail(demoEmail);
    setPassword('demo');
    setLoading(true);
    const result = await login(demoEmail, 'demo');
    setLoading(false);
    if (result.success) navigate('/');
  };

  return (
    <div className="login-page">
      <div className="login-bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
      </div>

      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-icon">
            <Cross size={32} />
          </div>
          <h1>MedCare HMS</h1>
          <p>AI-Powered Hospital Management</p>
        </div>

        {error && (
          <div style={{ padding: '10px 16px', background: '#FFF5F5', color: '#C53030', borderRadius: 8, fontSize: '0.875rem', marginBottom: 16, border: '1px solid #FED7D7' }}>
            {error}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email Address</label>
            <div className="input-icon">
              <Mail size={18} />
              <input className="input" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="input-icon">
              <Lock size={18} />
              <input className="input" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'} {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="login-register">
          New patient? <Link to="/register">Create an account</Link>
        </div>

        <div className="login-demo">
          <p>🔐 Quick Demo Login (click any role):</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
            {DEMO_CREDENTIALS.map((cred) => (
              <button
                key={cred.email}
                onClick={() => quickLogin(cred.email)}
                style={{
                  padding: '4px 10px', fontSize: 11, background: '#E8F5E9', border: '1px solid #C8E6C9',
                  borderRadius: 20, cursor: 'pointer', color: '#2E7D32', fontWeight: 500,
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => { e.target.style.background = '#C8E6C9'; }}
                onMouseOut={(e) => { e.target.style.background = '#E8F5E9'; }}
              >
                {cred.role}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
