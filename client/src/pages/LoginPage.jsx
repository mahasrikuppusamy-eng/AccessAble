import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaWheelchair, FaLock, FaEnvelope, FaEye, FaEyeSlash, FaShieldAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import AlertBanner from '../components/common/AlertBanner';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    setError('');

    const result = await login(email, password);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.message || 'Login failed. Please check credentials.');
      setLoading(false);
    }
  };

  // Demo auto-fill helpers
  const fillAdminCredentials = () => {
    setEmail('admin@accessable.org');
    setPassword('admin123');
    setError('');
  };

  const fillUserCredentials = () => {
    setEmail('user@accessable.org');
    setPassword('user123');
    setError('');
  };

  return (
    <div
      className="section"
      style={{
        backgroundColor: '#f8fafc',
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div className="container" style={{ maxWidth: '480px' }}>
        <div
          className="card"
          style={{
            padding: '2.5rem',
            borderRadius: '20px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto',
                boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)',
              }}
            >
              <FaWheelchair size={26} />
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
              Welcome Back
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0 }}>
              Sign in to AccessAble to save places and share reviews.
            </p>
          </div>

          {error && <AlertBanner type="error" message={error} onClose={() => setError('')} />}

          {/* Quick Demo Logins Helper Card */}
          <div
            style={{
              padding: '0.9rem',
              backgroundColor: '#eff6ff',
              borderRadius: '12px',
              border: '1px solid #bfdbfe',
              marginBottom: '1.5rem',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#1d4ed8',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginBottom: '0.5rem',
              }}
            >
              🚀 Quick Demo Accounts (1-Click Fill)
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={fillAdminCredentials}
                className="btn btn-sm"
                style={{
                  backgroundColor: '#7c3aed',
                  color: '#ffffff',
                  fontSize: '0.78rem',
                  padding: '0.35rem 0.65rem',
                }}
              >
                <FaShieldAlt size={12} /> Admin Demo
              </button>
              <button
                type="button"
                onClick={fillUserCredentials}
                className="btn btn-sm"
                style={{
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  fontSize: '0.78rem',
                  padding: '0.35rem 0.65rem',
                }}
              >
                👤 User Demo
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="loginEmail" className="form-label">
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  id="loginEmail"
                  className="form-control"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: '2.5rem' }}
                  required
                />
                <FaEnvelope
                  color="#94a3b8"
                  size={16}
                  style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
                />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label htmlFor="loginPassword" className="form-label" style={{ margin: 0 }}>
                  Password
                </label>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="loginPassword"
                  className="form-control"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                  required
                />
                <FaLock
                  color="#94a3b8"
                  size={16}
                  style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    display: 'flex',
                  }}
                >
                  {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem', fontWeight: 700 }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div
            style={{
              textAlign: 'center',
              marginTop: '1.75rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid #f1f5f9',
              fontSize: '0.9rem',
              color: '#64748b',
            }}
          >
            Don't have an account yet?{' '}
            <Link to="/register" style={{ fontWeight: 700, color: '#2563eb' }}>
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
