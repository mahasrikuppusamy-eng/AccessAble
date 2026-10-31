import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaSearch,
  FaMapMarkerAlt,
  FaWheelchair,
  FaHospital,
  FaUtensils,
  FaHotel,
  FaTree,
  FaShoppingBag,
  FaLandmark,
  FaSubway,
  FaGraduationCap,
  FaArrowRight,
  FaStar,
  FaCheckCircle,
  FaShieldAlt,
  FaHeart,
  FaQuoteLeft,
} from 'react-icons/fa';
import api from '../services/api';
import PlaceCard from '../components/common/PlaceCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const CATEGORY_ITEMS = [
  { name: 'Hospital', label: 'Hospitals & Clinics', icon: FaHospital, count: '350+ Audited', color: '#0284c7' },
  { name: 'Restaurant', label: 'Dining & Cafes', icon: FaUtensils, count: '520+ Venues', color: '#ea580c' },
  { name: 'Hotel', label: 'Hotels & Lodging', icon: FaHotel, count: '280+ Stays', color: '#7c3aed' },
  { name: 'Park', label: 'Parks & Trails', icon: FaTree, count: '190+ Green Spaces', color: '#16a34a' },
  { name: 'Shopping Mall', label: 'Malls & Retail', icon: FaShoppingBag, count: '210+ Centers', color: '#db2777' },
  { name: 'Cultural / Museum', label: 'Museums & Arts', icon: FaLandmark, count: '140+ Galleries', color: '#2563eb' },
  { name: 'Transit / Station', label: 'Transit Hubs', icon: FaSubway, count: '95+ Stations', color: '#4f46e5' },
  { name: 'Educational Institution', label: 'Universities & Libraries', icon: FaGraduationCap, count: '85+ Campuses', color: '#059669' },
];

const TESTIMONIALS = [
  {
    name: 'Marcus Vance',
    role: 'Manual Wheelchair User',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    comment: 'AccessAble transformed how I travel. Before, I had to call restaurants 3 times to ask about step-free entrances and bathroom width. Now, verified photos and community audits tell me everything instantly.',
    rating: 5,
    place: 'The Green Olive Bistro',
  },
  {
    name: 'Dr. Alisha Patel',
    role: 'Deaf Educator & Advocate',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    comment: 'Finding cultural venues and hospitals with on-demand ASL interpreters and hearing loop systems used to be guesswork. AccessAble’s filter makes it completely effortless.',
    rating: 5,
    place: 'Metropolitan Modern Art Museum',
  },
  {
    name: 'Lucas Romero',
    role: 'Low Vision Traveler & Guide Dog Handler',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    comment: 'Tactile paving information and braille elevator confirmations gave me the independence to attend conferences in New York and Chicago without constantly relying on assistance.',
    rating: 5,
    place: 'Union Central Express Terminal',
  },
];

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [featuredPlaces, setFeaturedPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await api.get('/places?limit=6&sort=rating_desc');
        if (response.data.success) {
          setFeaturedPlaces(response.data.places);
        }
      } catch (err) {
        console.error('Failed to load featured places:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.append('search', searchTerm.trim());
    if (selectedCategory && selectedCategory !== 'All') params.append('category', selectedCategory);
    if (cityFilter.trim()) params.append('city', cityFilter.trim());
    navigate(`/places?${params.toString()}`);
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section
        style={{
          background: 'radial-gradient(circle at 10% 20%, rgba(219, 234, 254, 0.6) 0%, rgba(243, 232, 255, 0.5) 45%, #ffffff 90%)',
          paddingTop: '5rem',
          paddingBottom: '5rem',
          borderBottom: '1px solid #e2e8f0',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="container">
          <div style={{ maxWidth: '840px', margin: '0 auto', textAlign: 'center' }}>
            {/* Pill Tag */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.4rem 1rem',
                backgroundColor: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: '9999px',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#1d4ed8',
                marginBottom: '1.5rem',
              }}
            >
              <FaShieldAlt color="#2563eb" />
              <span>Universal Accessibility Discovery Platform</span>
            </div>

            {/* Heading */}
            <h1
              style={{
                fontSize: '3.25rem',
                fontWeight: 800,
                color: '#0f172a',
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                marginBottom: '1.25rem',
              }}
            >
              Explore the World{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Without Barriers
              </span>
            </h1>

            {/* Subheading */}
            <p
              style={{
                fontSize: '1.25rem',
                color: '#475569',
                lineHeight: 1.6,
                marginBottom: '2.5rem',
              }}
            >
              Discover wheelchair accessible, sensory-friendly, and barrier-free restaurants,
              hospitals, hotels, cultural destinations, and transit hubs verified by real people.
            </p>

            {/* Search Bar Form */}
            <form
              onSubmit={handleSearchSubmit}
              style={{
                backgroundColor: '#ffffff',
                padding: '0.75rem',
                borderRadius: '20px',
                boxShadow: '0 15px 35px -5px rgba(0, 0, 0, 0.12), 0 0 2px rgba(0,0,0,0.05)',
                border: '1px solid #cbd5e1',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.65rem',
                alignItems: 'center',
              }}
            >
              {/* Search text input */}
              <div
                style={{
                  flex: '2 1 240px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.5rem 0.85rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                }}
              >
                <FaSearch color="#64748b" size={16} />
                <input
                  type="text"
                  placeholder="Search places by name, museum, hospital..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    width: '100%',
                    fontSize: '0.95rem',
                    color: '#1e293b',
                  }}
                  aria-label="Search places by name"
                />
              </div>

              {/* Category selector */}
              <div
                style={{
                  flex: '1.2 1 180px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 0.85rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                }}
              >
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    width: '100%',
                    fontSize: '0.92rem',
                    color: '#334155',
                    cursor: 'pointer',
                  }}
                  aria-label="Filter by category"
                >
                  <option value="">All Categories</option>
                  <option value="Restaurant">Restaurant</option>
                  <option value="Hotel">Hotel</option>
                  <option value="Hospital">Hospital</option>
                  <option value="Educational Institution">Educational Institution</option>
                  <option value="Shopping Mall">Shopping Mall</option>
                  <option value="Park">Park & Nature</option>
                  <option value="Transit / Station">Transit / Station</option>
                  <option value="Cultural / Museum">Cultural / Museum</option>
                </select>
              </div>

              {/* Location/City input */}
              <div
                style={{
                  flex: '1 1 140px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 0.85rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                }}
              >
                <FaMapMarkerAlt color="#64748b" size={15} />
                <input
                  type="text"
                  placeholder="City (e.g. New York)"
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    width: '100%',
                    fontSize: '0.92rem',
                    color: '#1e293b',
                  }}
                  aria-label="City or Location"
                />
              </div>

              {/* Submit Search Button */}
              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  flex: '0 0 auto',
                  padding: '0.8rem 1.6rem',
                  borderRadius: '12px',
                  fontWeight: 700,
                }}
              >
                <FaSearch size={15} />
                <span>Search</span>
              </button>
            </form>

            {/* Quick Filter Tag Links */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '0.6rem',
                marginTop: '1.5rem',
                fontSize: '0.85rem',
                color: '#64748b',
              }}
            >
              <span style={{ fontWeight: 600 }}>Quick Filters:</span>
              <Link
                to="/places?features=Wheelchair+Ramps"
                style={{
                  padding: '0.25rem 0.65rem',
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '9999px',
                  color: '#334155',
                  fontWeight: 500,
                }}
              >
                ♿ Wheelchair Ramps
              </Link>
              <Link
                to="/places?features=Elevator+Availability"
                style={{
                  padding: '0.25rem 0.65rem',
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '9999px',
                  color: '#334155',
                  fontWeight: 500,
                }}
              >
                🛗 Elevators
              </Link>
              <Link
                to="/places?features=Braille+Signage"
                style={{
                  padding: '0.25rem 0.65rem',
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '9999px',
                  color: '#334155',
                  fontWeight: 500,
                }}
              >
                ⠃ Braille Signage
              </Link>
              <Link
                to="/places?features=Hearing+Assistance"
                style={{
                  padding: '0.25rem 0.65rem',
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '9999px',
                  color: '#334155',
                  fontWeight: 500,
                }}
              >
                🦻 Hearing Assistance
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section
        style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          padding: '2.5rem 0',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '2rem',
              textAlign: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#2563eb' }}>
                1,200+
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#64748b' }}>
                Verified Accessible Places
              </div>
            </div>

            <div>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#7c3aed' }}>
                11
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#64748b' }}>
                Accessibility Checkpoints Audited
              </div>
            </div>

            <div>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#059669' }}>
                15,000+
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#64748b' }}>
                Community Feedback Reviews
              </div>
            </div>

            <div>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#ea580c' }}>
                100%
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#64748b' }}>
                Barrier-Free Commitment
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section section-light">
        <div className="container">
          <div className="section-title-wrap">
            <span className="section-subtitle-tag">Location Categories</span>
            <h2 className="section-title">Browse Accessible Environments</h2>
            <p className="section-desc">
              Explore places thoughtfully audited for mobility devices, visual assistance,
              sensory quietness, and hearing loop installations.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {CATEGORY_ITEMS.map((item) => {
              const IconComp = item.icon;
              return (
                <Link
                  key={item.name}
                  to={`/places?category=${encodeURIComponent(item.name)}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    className="card card-interactive"
                    style={{
                      padding: '1.75rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      borderRadius: '16px',
                      height: '100%',
                    }}
                  >
                    <div
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '14px',
                        backgroundColor: `${item.color}15`,
                        color: item.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1rem',
                        transition: 'transform 0.2s ease',
                      }}
                    >
                      <IconComp size={26} />
                    </div>
                    <h3
                      style={{
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        color: '#0f172a',
                        marginBottom: '0.35rem',
                      }}
                    >
                      {item.label}
                    </h3>
                    <span
                      style={{
                        fontSize: '0.85rem',
                        color: '#64748b',
                        fontWeight: 500,
                      }}
                    >
                      {item.count}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Accessible Places */}
      <section className="section" style={{ backgroundColor: '#f8fafc' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: '2.5rem',
              gap: '1rem',
            }}
          >
            <div>
              <span className="section-subtitle-tag">Curated Highlights</span>
              <h2 className="section-title" style={{ marginBottom: '0.4rem' }}>
                Featured Accessible Destinations
              </h2>
              <p className="section-desc" style={{ margin: 0 }}>
                Highest-rated accessible facilities verified by our community audits.
              </p>
            </div>
            <Link to="/places" className="btn btn-outline-primary">
              View All Places <FaArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner message="Loading featured places..." />
          ) : featuredPlaces.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '3rem',
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
              }}
            >
              <p style={{ color: '#64748b' }}>No places found. Check back shortly!</p>
            </div>
          ) : (
            <div className="places-grid">
              {featuredPlaces.map((place) => (
                <PlaceCard key={place._id} place={place} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section section-light">
        <div className="container">
          <div className="section-title-wrap">
            <span className="section-subtitle-tag">Simple & Transparent</span>
            <h2 className="section-title">How AccessAble Works</h2>
            <p className="section-desc">
              Four simple steps to explore public spaces safely, independently, and barrier-free.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '2rem',
            }}
          >
            {/* Step 1 */}
            <div
              style={{
                backgroundColor: '#ffffff',
                padding: '2rem',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: '#eff6ff',
                  color: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  marginBottom: '1.25rem',
                }}
              >
                1
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.6rem' }}>
                Search & Filter
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6 }}>
                Filter places by the exact accessibility features you need: wheelchair ramps,
                elevators, braille signage, or quiet sensory hours.
              </p>
            </div>

            {/* Step 2 */}
            <div
              style={{
                backgroundColor: '#ffffff',
                padding: '2rem',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: '#f5f3ff',
                  color: '#7c3aed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  marginBottom: '1.25rem',
                }}
              >
                2
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.6rem' }}>
                Verify Checkpoints
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6 }}>
                View our verified checklist: door widths, ramp slopes, tactile paving,
                and contact information vetted by accessibility auditors.
              </p>
            </div>

            {/* Step 3 */}
            <div
              style={{
                backgroundColor: '#ffffff',
                padding: '2rem',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: '#ecfdf5',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  marginBottom: '1.25rem',
                }}
              >
                3
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.6rem' }}>
                Explore Confidently
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6 }}>
                Navigate seamlessly with interactive maps, direct directions, and detailed
                notes about parking spots and accessible restrooms.
              </p>
            </div>

            {/* Step 4 */}
            <div
              style={{
                backgroundColor: '#ffffff',
                padding: '2rem',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: '#fff7ed',
                  color: '#ea580c',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  marginBottom: '1.25rem',
                }}
              >
                4
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.6rem' }}>
                Share & Review
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6 }}>
                Rate places from 1 to 5 stars, leave honest feedback, and suggest new
                barrier-free locations to expand our inclusive community map.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Testimonials */}
      <section className="section section-purple-gradient">
        <div className="container">
          <div className="section-title-wrap">
            <span className="section-subtitle-tag">Voices of the Community</span>
            <h2 className="section-title">Trusted by Explorers Everywhere</h2>
            <p className="section-desc">
              Real experiences from people who navigate cities with freedom and peace of mind.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem',
            }}
          >
            {TESTIMONIALS.map((t, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: '#ffffff',
                  padding: '2rem',
                  borderRadius: '20px',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#f59e0b', marginBottom: '1rem' }}>
                    {[...Array(t.rating)].map((_, i) => (
                      <FaStar key={i} size={16} />
                    ))}
                  </div>
                  <p
                    style={{
                      fontSize: '0.95rem',
                      color: '#334155',
                      lineHeight: 1.65,
                      fontStyle: 'italic',
                      marginBottom: '1.5rem',
                    }}
                  >
                    "{t.comment}"
                  </p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.85rem',
                    borderTop: '1px solid #f1f5f9',
                    paddingTop: '1rem',
                  }}
                >
                  <img
                    src={t.avatar}
                    alt={t.name}
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                    }}
                  />
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                      {t.name}
                    </h4>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      {t.role}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Suggest Place CTA Banner */}
      <section
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #7c3aed 100%)',
          color: '#ffffff',
          padding: '4.5rem 0',
          position: 'relative',
        }}
      >
        <div className="container" style={{ textAlign: 'center', maxWidth: '750px' }}>
          <h2
            style={{
              fontSize: '2.4rem',
              fontWeight: 800,
              color: '#ffffff',
              marginBottom: '1rem',
              letterSpacing: '-0.02em',
            }}
          >
            Know an Accessible Place?
          </h2>
          <p
            style={{
              fontSize: '1.15rem',
              color: '#dbeafe',
              lineHeight: 1.6,
              marginBottom: '2rem',
            }}
          >
            Help fellow explorers discover new barrier-free locations. Submit public parks,
            restaurants, hotels, or clinics to our verified directory.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              to="/add-place"
              className="btn btn-lg"
              style={{
                backgroundColor: '#ffffff',
                color: '#1d4ed8',
                fontWeight: 700,
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              }}
            >
              Suggest a Location Now
            </Link>
            <Link
              to="/filter"
              className="btn btn-outline btn-lg"
              style={{
                borderColor: '#ffffff',
                color: '#ffffff',
                fontWeight: 600,
              }}
            >
              Explore Checklist
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
