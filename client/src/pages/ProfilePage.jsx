import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaImage, FaShieldAlt, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import AlertBanner from '../components/common/AlertBanner';

const ACCESSIBILITY_OPTIONS = [
  'Wheelchair Accessible',
  'Wheelchair Ramps',
  'Accessible Parking',
  'Accessible Restrooms',
  'Elevator Availability',
  'Braille Signage',
  'Audio Assistance',
  'Visual Assistance',
  'Sign Language Support',
  'Accessible Entrance',
  'Hearing Assistance',
];

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [accessibilityNeeds, setAccessibilityNeeds] = useState(user?.accessibilityNeeds || []);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setProfileImage(user.profileImage || '');
      setBio(user.bio || '');
      setAccessibilityNeeds(user.accessibilityNeeds || []);
    }
  }, [user]);

  const toggleNeed = (need) => {
    setAccessibilityNeeds((prev) =>
      prev.includes(need) ? prev.filter((n) => n !== need) : [...prev, need]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setAlert({ type: 'error', message: 'Name cannot be blank.' });
      return;
    }

    setLoading(true);
    setAlert(null);

    const result = await updateProfile({
      name,
      profileImage,
      bio,
      accessibilityNeeds,
    });

    if (result.success) {
      setAlert({ type: 'success', message: 'Profile updated successfully!' });
    } else {
      setAlert({ type: 'error', message: result.message || 'Error updating profile.' });
    }
    setLoading(false);
  };

  return (
    <div className="profile-page section" style={{ backgroundColor: '#f8fafc', minHeight: '85vh' }}>
      <div className="container container-narrow">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
            Account Profile & Preferences
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem', margin: 0 }}>
            Manage your personal information, profile photo, and accessibility needs.
          </p>
        </div>

        {alert && (
          <AlertBanner
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        <form onSubmit={handleSubmit}>
          <div className="card" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
            {/* Avatar Preview */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                marginBottom: '2rem',
                paddingBottom: '1.5rem',
                borderBottom: '1px solid #f1f5f9',
              }}
            >
              <img
                src={
                  profileImage ||
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
                }
                alt="Profile Preview"
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid #2563eb',
                }}
              />
              <div style={{ flex: 1 }}>
                <label htmlFor="profileImageInput" className="form-label">
                  Profile Photo URL
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="url"
                    id="profileImageInput"
                    className="form-control"
                    placeholder="https://images.unsplash.com/..."
                    value={profileImage}
                    onChange={(e) => setProfileImage(e.target.value)}
                    style={{ paddingLeft: '2.5rem' }}
                  />
                  <FaImage
                    color="#94a3b8"
                    size={16}
                    style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
                  />
                </div>
                <span className="form-hint">Paste an image URL to customize your avatar.</span>
              </div>
            </div>

            {/* Name & Email */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.25rem',
                marginBottom: '1.25rem',
              }}
            >
              <div className="form-group" style={{ margin: 0 }}>
                <label htmlFor="profName" className="form-label">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="profName"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label htmlFor="profEmail" className="form-label">
                  Email Address
                </label>
                <input
                  type="email"
                  id="profEmail"
                  className="form-control"
                  value={user?.email || ''}
                  disabled
                  style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed' }}
                />
                <span className="form-hint">Email address cannot be changed.</span>
              </div>
            </div>

            {/* Bio */}
            <div className="form-group">
              <label htmlFor="profBio" className="form-label">
                About You / Bio
              </label>
              <textarea
                id="profBio"
                className="form-control"
                rows="3"
                placeholder="Share a short bio or accessibility advocacy interests..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            {/* Accessibility Priorities */}
            <div className="form-group">
              <label className="form-label">
                Your Accessibility Priorities:
              </label>
              <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '0.65rem' }}>
                Select the accessibility features that matter most to you when discovering places.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {ACCESSIBILITY_OPTIONS.map((item) => {
                  const isChecked = accessibilityNeeds.includes(item);
                  return (
                    <button
                      type="button"
                      key={item}
                      onClick={() => toggleNeed(item)}
                      style={{
                        padding: '0.4rem 0.8rem',
                        borderRadius: '9999px',
                        border: '1.5px solid',
                        borderColor: isChecked ? '#2563eb' : '#cbd5e1',
                        backgroundColor: isChecked ? '#eff6ff' : '#ffffff',
                        color: isChecked ? '#1d4ed8' : '#475569',
                        fontSize: '0.85rem',
                        fontWeight: isChecked ? 700 : 500,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {isChecked ? '✓ ' : '+ '} {item}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Account Role Info */}
            <div
              style={{
                padding: '1rem',
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '1.5rem',
              }}
            >
              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', display: 'block' }}>
                  Account Level
                </span>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Role: {user?.role === 'admin' ? 'Platform Administrator' : 'Verified Community Member'}
                </span>
              </div>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  backgroundColor: user?.role === 'admin' ? '#7c3aed' : '#2563eb',
                  color: '#ffffff',
                  padding: '0.25rem 0.65rem',
                  borderRadius: '9999px',
                  textTransform: 'uppercase',
                }}
              >
                {user?.role}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ padding: '0.75rem 2rem', fontWeight: 700 }}
              >
                {loading ? 'Saving Changes...' : 'Save Profile Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
