import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaWheelchair,
  FaHeart,
  FaGithub,
  FaTwitter,
  FaLinkedin,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaCheckCircle,
} from 'react-icons/fa';

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: '#0f172a',
        color: '#cbd5e1',
        paddingTop: '4.5rem',
        paddingBottom: '2.5rem',
        marginTop: 'auto',
        borderTop: '1px solid #1e293b',
      }}
      className="footer"
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2.5rem',
            marginBottom: '3.5rem',
          }}
        >
          {/* Brand & Mission */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                marginBottom: '1rem',
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FaWheelchair size={20} />
              </div>
              <span
                style={{
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  letterSpacing: '-0.02em',
                }}
              >
                Access<span style={{ color: '#60a5fa' }}>Able</span>
              </span>
            </div>
            <p
              style={{
                fontSize: '0.9rem',
                lineHeight: 1.6,
                color: '#94a3b8',
                marginBottom: '1.25rem',
              }}
            >
              AccessAble empowers people with disabilities to explore public places,
              dining, hospitality, healthcare, and education with confidence and zero barriers.
            </p>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.35rem 0.75rem',
                backgroundColor: 'rgba(37, 99, 235, 0.15)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '9999px',
                fontSize: '0.78rem',
                color: '#93c5fd',
                fontWeight: 600,
              }}
            >
              <FaCheckCircle size={13} color="#38bdf8" />
              <span>WCAG 2.2 AA Compliant Platform</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              style={{
                fontSize: '1rem',
                fontWeight: 700,
                color: '#ffffff',
                marginBottom: '1.25rem',
                letterSpacing: '0.02em',
              }}
            >
              Discover
            </h4>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                fontSize: '0.9rem',
              }}
            >
              <li>
                <Link to="/places" style={{ color: '#94a3b8' }}>
                  Explore All Places
                </Link>
              </li>
              <li>
                <Link to="/filter" style={{ color: '#94a3b8' }}>
                  Accessibility Feature Filters
                </Link>
              </li>
              <li>
                <Link to="/add-place" style={{ color: '#94a3b8' }}>
                  Suggest a Barrier-Free Location
                </Link>
              </li>
              <li>
                <Link to="/favorites" style={{ color: '#94a3b8' }}>
                  My Saved Places
                </Link>
              </li>
              <li>
                <Link to="/dashboard" style={{ color: '#94a3b8' }}>
                  Community Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Place Categories */}
          <div>
            <h4
              style={{
                fontSize: '1rem',
                fontWeight: 700,
                color: '#ffffff',
                marginBottom: '1.25rem',
                letterSpacing: '0.02em',
              }}
            >
              Popular Categories
            </h4>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                fontSize: '0.9rem',
              }}
            >
              <li>
                <Link to="/places?category=Hospital" style={{ color: '#94a3b8' }}>
                  Accessible Hospitals & Clinics
                </Link>
              </li>
              <li>
                <Link to="/places?category=Restaurant" style={{ color: '#94a3b8' }}>
                  Inclusive Dining & Cafes
                </Link>
              </li>
              <li>
                <Link to="/places?category=Hotel" style={{ color: '#94a3b8' }}>
                  Accessible Hotels & Lodging
                </Link>
              </li>
              <li>
                <Link to="/places?category=Park" style={{ color: '#94a3b8' }}>
                  Parks & Sensory Gardens
                </Link>
              </li>
              <li>
                <Link to="/places?category=Shopping Mall" style={{ color: '#94a3b8' }}>
                  Shopping Centers & Cineplexes
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4
              style={{
                fontSize: '1rem',
                fontWeight: 700,
                color: '#ffffff',
                marginBottom: '1.25rem',
                letterSpacing: '0.02em',
              }}
            >
              Reach Us
            </h4>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
                fontSize: '0.9rem',
                color: '#94a3b8',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <FaEnvelope color="#60a5fa" size={15} />
                <span>contact@accessable.org</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <FaPhoneAlt color="#60a5fa" size={15} />
                <span>+1 (800) 555-ABLE (2253)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <FaMapMarkerAlt color="#60a5fa" size={15} />
                <span>New York, NY 10001, United States</span>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Twitter Profile"
                  style={{
                    color: '#94a3b8',
                    padding: '8px',
                    borderRadius: '8px',
                    backgroundColor: '#1e293b',
                    display: 'flex',
                  }}
                >
                  <FaTwitter size={16} />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn Profile"
                  style={{
                    color: '#94a3b8',
                    padding: '8px',
                    borderRadius: '8px',
                    backgroundColor: '#1e293b',
                    display: 'flex',
                  }}
                >
                  <FaLinkedin size={16} />
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub Repository"
                  style={{
                    color: '#94a3b8',
                    padding: '8px',
                    borderRadius: '8px',
                    backgroundColor: '#1e293b',
                    display: 'flex',
                  }}
                >
                  <FaGithub size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid #1e293b',
            paddingTop: '2rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            fontSize: '0.85rem',
            color: '#64748b',
          }}
        >
          <div>
            &copy; {new Date().getFullYear()} AccessAble – Accessibility Discovery Platform. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span>Built with</span>
            <FaHeart size={14} color="#ef4444" />
            <span>for universal barrier-free accessibility</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
