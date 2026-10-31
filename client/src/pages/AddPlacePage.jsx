import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FaPlusCircle,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaUpload,
  FaShieldAlt,
  FaInfoCircle,
} from 'react-icons/fa';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import LeafletMap from '../components/common/LeafletMap';
import AlertBanner from '../components/common/AlertBanner';

const ALL_11_FEATURES = [
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

const CATEGORIES = [
  'Hospital',
  'Restaurant',
  'Hotel',
  'Park',
  'Shopping Mall',
  'Cultural / Museum',
  'Transit / Station',
  'Educational Institution',
  'Library',
  'Sports & Entertainment',
  'Other',
];

const AddPlacePage = () => {
  const { isAuthenticated, user, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Form Fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Restaurant');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [lat, setLat] = useState(40.73061);
  const [lng, setLng] = useState(-73.935242);
  const [imageUrl, setImageUrl] = useState('');
  const [accessibilityFeatures, setAccessibilityFeatures] = useState([]);
  const [accessibilityNotes, setAccessibilityNotes] = useState('');
  const [openingHours, setOpeningHours] = useState('Monday - Sunday: 9:00 AM - 9:00 PM');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleFeatureToggle = (feature) => {
    setAccessibilityFeatures((prev) =>
      prev.includes(feature) ? prev.filter((f) => f !== feature) : [...prev, feature]
    );
  };

  const handleMapLocationSelect = (coords) => {
    setLat(Math.round(coords.lat * 100000) / 100000);
    setLng(Math.round(coords.lng * 100000) / 100000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !description.trim() || !address.trim() || !city.trim()) {
      setAlert({
        type: 'error',
        message: 'Please fill out all required fields: Place Name, Description, Address, and City.',
      });
      return;
    }

    if (accessibilityFeatures.length === 0) {
      setAlert({
        type: 'warning',
        message: 'Please select at least one accessibility feature provided at this location.',
      });
      return;
    }

    setLoading(true);
    setAlert(null);

    try {
      const payload = {
        name,
        category,
        description,
        address,
        city,
        state,
        zipCode,
        lat,
        lng,
        images: imageUrl.trim()
          ? [imageUrl.trim()]
          : ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80'],
        accessibilityFeatures,
        accessibilityNotes,
        openingHours,
        phone,
        email,
        website,
      };

      const response = await api.post('/places', payload);

      if (response.data.success) {
        setSubmittedSuccess(true);
      }
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.response?.data?.message || 'Failed to submit place. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="section container" style={{ maxWidth: '600px', textAlign: 'center', padding: '5rem 1rem' }}>
        <div className="card" style={{ padding: '3rem 2rem' }}>
          <FaShieldAlt size={48} color="#2563eb" style={{ marginBottom: '1.25rem' }} />
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            Sign In to Suggest a Place
          </h2>
          <p style={{ color: '#64748b', lineHeight: 1.6, marginBottom: '2rem' }}>
            To maintain high data integrity and accountability for our community with disabilities,
            suggesting new locations requires a registered account.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <Link to="/login" className="btn btn-primary">
              Sign In
            </Link>
            <Link to="/register" className="btn btn-outline">
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (submittedSuccess) {
    return (
      <div className="section container" style={{ maxWidth: '650px', textAlign: 'center', padding: '4rem 1rem' }}>
        <div className="card" style={{ padding: '3rem 2rem' }}>
          <div
            style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              backgroundColor: '#ecfdf5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto',
            }}
          >
            <FaCheckCircle size={36} />
          </div>

          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>
            {isAdmin ? 'Place Published Successfully!' : 'Submission Received!'}
          </h2>

          <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            {isAdmin
              ? 'As an administrator, your submitted location has been automatically approved and is now live on the AccessAble platform.'
              : 'Thank you for contributing to our accessibility map! Your submission has been routed to our verification team and will appear publicly once approved.'}
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/places" className="btn btn-primary">
              Explore Places
            </Link>
            <Link to="/dashboard" className="btn btn-outline">
              View My Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="add-place-page section" style={{ backgroundColor: '#f8fafc', minHeight: '85vh' }}>
      <div className="container container-narrow">
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem 0.9rem',
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              borderRadius: '9999px',
              fontSize: '0.85rem',
              fontWeight: 700,
              marginBottom: '0.75rem',
            }}
          >
            <FaPlusCircle size={14} /> Community Contributor Program
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
            Suggest a Barrier-Free Place
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Share an accessible public venue, restaurant, hospital, or attraction.
            Your information helps people with disabilities travel with confidence.
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
          {/* Section 1: Basic Information */}
          <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.25rem', color: '#0f172a' }}>
              1. Basic Information
            </h2>

            <div className="form-group">
              <label htmlFor="placeName" className="form-label">
                Place Name *
              </label>
              <input
                type="text"
                id="placeName"
                className="form-control"
                placeholder="e.g. St. Jude Wellness Center, The Olive Garden Bistro"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="placeCategory" className="form-label">
                Category *
              </label>
              <select
                id="placeCategory"
                className="form-control"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="placeDescription" className="form-label">
                Detailed Description *
              </label>
              <textarea
                id="placeDescription"
                className="form-control"
                rows="4"
                placeholder="Describe the environment, pathways, door styles, staff assistance, and overall barrier-free layout..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="imageUrl" className="form-label">
                Photo Image URL (High Resolution)
              </label>
              <input
                type="url"
                id="imageUrl"
                className="form-control"
                placeholder="https://images.unsplash.com/photo-..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              <span className="form-hint">
                Provide a direct image URL displaying the entrance or accessible amenities.
              </span>
            </div>
          </div>

          {/* Section 2: Accessibility Checkpoints */}
          <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                2. Accessibility Features Available *
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.88rem', margin: '0.25rem 0 0 0' }}>
                Check all features verified present at this location.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: '0.75rem',
                marginBottom: '1.5rem',
              }}
            >
              {ALL_11_FEATURES.map((feature) => {
                const isChecked = accessibilityFeatures.includes(feature);
                return (
                  <label
                    key={feature}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '10px',
                      backgroundColor: isChecked ? '#eff6ff' : '#f8fafc',
                      border: `1.5px solid ${isChecked ? '#2563eb' : '#e2e8f0'}`,
                      cursor: 'pointer',
                      fontSize: '0.88rem',
                      fontWeight: isChecked ? 700 : 500,
                      color: isChecked ? '#1d4ed8' : '#334155',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleFeatureToggle(feature)}
                      style={{ width: '18px', height: '18px', accentColor: '#2563eb' }}
                    />
                    <span>{feature}</span>
                  </label>
                );
              })}
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label htmlFor="accessibilityNotes" className="form-label">
                Specific Accessibility Notes & Dimensions
              </label>
              <textarea
                id="accessibilityNotes"
                className="form-control"
                rows="2"
                placeholder="e.g. Ramp slope is 1:12; elevator has tactile Braille buttons on left; quiet sensory room on 2nd floor."
                value={accessibilityNotes}
                onChange={(e) => setAccessibilityNotes(e.target.value)}
              />
            </div>
          </div>

          {/* Section 3: Location & Coordinates */}
          <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.25rem', color: '#0f172a' }}>
              3. Address & Map Coordinates
            </h2>

            <div className="form-group">
              <label htmlFor="address" className="form-label">
                Street Address *
              </label>
              <input
                type="text"
                id="address"
                className="form-control"
                placeholder="e.g. 120 Broadway, Suite 400"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: '1rem',
                marginBottom: '1.25rem',
              }}
            >
              <div>
                <label htmlFor="city" className="form-label">
                  City *
                </label>
                <input
                  type="text"
                  id="city"
                  className="form-control"
                  placeholder="New York"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="state" className="form-label">
                  State / Region
                </label>
                <input
                  type="text"
                  id="state"
                  className="form-control"
                  placeholder="NY"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="zipCode" className="form-label">
                  Postal / ZIP Code
                </label>
                <input
                  type="text"
                  id="zipCode"
                  className="form-control"
                  placeholder="10001"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                />
              </div>
            </div>

            {/* Interactive Coordinate Picker */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span className="form-label" style={{ margin: 0 }}>
                  Click Map to Set Exact Pin Coordinates
                </span>
                <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                  Lat: {lat}, Lng: {lng}
                </span>
              </div>
              <LeafletMap
                height="280px"
                interactive
                selectedLocation={{ lat, lng }}
                onLocationSelect={handleMapLocationSelect}
              />
            </div>
          </div>

          {/* Section 4: Operating Hours & Contact Details */}
          <div className="card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.25rem', color: '#0f172a' }}>
              4. Contact & Hours
            </h2>

            <div className="form-group">
              <label htmlFor="openingHours" className="form-label">
                Opening Hours
              </label>
              <input
                type="text"
                id="openingHours"
                className="form-control"
                placeholder="Mon - Sun: 9:00 AM - 9:00 PM"
                value={openingHours}
                onChange={(e) => setOpeningHours(e.target.value)}
              />
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
              }}
            >
              <div>
                <label htmlFor="phone" className="form-label">
                  Contact Phone
                </label>
                <input
                  type="text"
                  id="phone"
                  className="form-control"
                  placeholder="+1 (212) 555-0199"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  placeholder="contact@place.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="website" className="form-label">
                  Website URL
                </label>
                <input
                  type="url"
                  id="website"
                  className="form-control"
                  placeholder="https://example.com"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Verification Notice & Submit */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1.5rem',
              backgroundColor: '#ffffff',
              padding: '1.5rem 2rem',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', maxWidth: '480px' }}>
              <FaInfoCircle size={22} color="#2563eb" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.45 }}>
                Submissions are audited for universal accessibility guidelines.
                Thank you for making public places barrier-free!
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.85rem' }}>
              <Link to="/places" className="btn btn-outline">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ padding: '0.8rem 2rem', fontWeight: 700 }}
              >
                {loading ? 'Submitting...' : 'Submit Location'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPlacePage;
