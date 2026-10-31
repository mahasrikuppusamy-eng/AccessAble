import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaWheelchair, FaLock, FaEnvelope, FaUser, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import AlertBanner from '../components/common/AlertBanner';

const ACCESSIBILITY_PREFERENCES = [
  'Wheelchair Accessible',
  'Wheelchair Ramps',
  'Elevator Availability',
  'Braille Signage',
  'Audio Assistance',
  'Visual Assistance',
  'Hearing Assistance',
];

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [bio, setBio] = useState('');
  const [selectedNeeds, setSelectedNeeds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleNeedToggle = (need) => {
    setSelectedNeeds((prev) =>
      prev.includes(need) ? prev.filter((n) => n !== need) : [...prev, need]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password) {
      setError('Please fill in your name, email, and password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');

    const result = await register({
      name,
      email,
      password,
      bio,
      accessibilityNeeds: selectedNeeds,
    });

    if (result.success) {
      navigate('/dashboard', { replace: true });
    } else {
      setError(result.message || 'Registration failed. Please check your inputs.');
      setLoading(false);
    }
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
        paddingTop: '3rem',
        paddingBottom: '3rem',
      }}
    >
      <div className="container" style={{ maxWidth: '540px' }}>
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
              Join AccessAble
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0 }}>
              Create your account to discover and share barrier-free places.
            </p>
          </div>

          {error && <AlertBanner type="error" message={error} onClose={() => setError('')} />}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="regName" className="form-label">
                Full Name *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  id="regName"
                  className="form-control"
                  placeholder="e.g. Elena Rostova"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ paddingLeft: '2.5rem' }}
                  required
                />
                <FaUser
                  color="#94a3b8"
                  size={15}
                  style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="regEmail" className="form-label">
                Email Address *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  id="regEmail"
                  className="form-control"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: '2.5rem' }}
                  required
                />
                <FaEnvelope
                  color="#94a3b8"
                  size={15}
                  style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
                />
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                marginBottom: '1rem',
              }}
            >
              <div>
                <label htmlFor="regPassword" style={{ fontWeight: 600, fontSize: '0.88rem', display: 'block', marginBottom: '0.4rem' }}>
                  Password *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="regPassword"
                    className="form-control"
                    placeholder="Min 6 chars"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                    }}
                  >
                    {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="regConfirmPassword" style={{ fontWeight: 600, fontSize: '0.88rem', display: 'block', marginBottom: '0.4rem' }}>
                  Confirm Password *
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="regConfirmPassword"
                  className="form-control"
                  placeholder="Repeat password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Accessibility Preferences */}
            <div className="form-group">
              <label className="form-label">
                Accessibility Priorities (Optional):
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {ACCESSIBILITY_PREFERENCES.map((need) => {
                  const isChecked = selectedNeeds.includes(need);
                  return (
                    <button
                      type="button"
                      key={need}
                      onClick={() => handleNeedToggle(need)}
                      style={{
                        padding: '0.35rem 0.65rem',
                        borderRadius: '9999px',
                        border: '1px solid',
                        borderColor: isChecked ? '#2563eb' : '#cbd5e1',
                        backgroundColor: isChecked ? '#eff6ff' : '#ffffff',
                        color: isChecked ? '#1d4ed8' : '#475569',
                        fontSize: '0.78rem',
                        fontWeight: isChecked ? 700 : 500,
                        cursor: 'pointer',
                      }}
                    >
                      {isChecked ? '✓ ' : '+ '} {need}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="regBio" className="form-label">
                Bio / About You (Optional)
              </label>
              <textarea
                id="regBio"
                className="form-control"
                rows="2"
                placeholder="e.g. Accessibility advocate, wheelchair basketball player, frequent traveler..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem', fontWeight: 700 }}
            >
              {loading ? 'Creating Account...' : 'Complete Registration'}
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
            Already have an account?{' '}
            <Link to="/login" style={{ fontWeight: 700, color: '#2563eb' }}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
