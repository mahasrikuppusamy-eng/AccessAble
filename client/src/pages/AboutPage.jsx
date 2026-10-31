import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaWheelchair,
  FaShieldAlt,
  FaUniversalAccess,
  FaHeart,
  FaCheckCircle,
  FaUsers,
  FaGlobeAmericas,
} from 'react-icons/fa';

const AboutPage = () => {
  return (
    <div className="about-page section" style={{ backgroundColor: '#ffffff', minHeight: '85vh' }}>
      <div className="container">
        {/* Hero Banner */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 4rem auto' }}>
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
              marginBottom: '1rem',
            }}
          >
            <FaUniversalAccess size={15} /> Our Mission & Standards
          </div>
          <h1
            style={{
              fontSize: '3rem',
              fontWeight: 800,
              color: '#0f172a',
              lineHeight: 1.2,
              marginBottom: '1.25rem',
            }}
          >
            Empowering Universal Exploration Without Barriers
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#475569', lineHeight: 1.6 }}>
            AccessAble was created with a single, clear objective: ensure that people with physical,
            sensory, and cognitive disabilities have accurate, audited, and honest accessibility
            information before they step out the door.
          </p>
        </div>

        {/* The Problem vs The Solution Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
            marginBottom: '4.5rem',
          }}
        >
          <div
            className="card"
            style={{
              padding: '2.5rem',
              borderRadius: '20px',
              borderLeft: '6px solid #ef4444',
            }}
          >
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#dc2626', marginBottom: '1rem' }}>
              The Problem with Standard Maps
            </div>
            <p style={{ color: '#475569', lineHeight: 1.7, fontSize: '1rem', marginBottom: '1.25rem' }}>
              Mainstream navigation apps often mark a venue as "wheelchair accessible" based solely on
              an unchecked checkbox. In reality, visitors frequently encounter hidden steps at the threshold,
              heavy manual doors, restrooms with narrow doorways, or broken elevators with zero prior warning.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', color: '#64748b', fontSize: '0.92rem' }}>
              <li>❌ Vague labels without ramp slope or doorway dimensions</li>
              <li>❌ Zero sensory guidelines for neurodivergent individuals</li>
              <li>❌ Inadequate information for low-vision and hearing-impaired visitors</li>
            </ul>
          </div>

          <div
            className="card"
            style={{
              padding: '2.5rem',
              borderRadius: '20px',
              borderLeft: '6px solid #059669',
            }}
          >
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#059669', marginBottom: '1rem' }}>
              The AccessAble Standard
            </div>
            <p style={{ color: '#475569', lineHeight: 1.7, fontSize: '1rem', marginBottom: '1.25rem' }}>
              Every location listed on AccessAble is evaluated against our <strong>11 Universal Accessibility Checkpoints</strong>.
              Submissions undergo community and auditor reviews, detailing exact ramp angles, tactile wayfinding,
              Braille door signs, ASL interpreter availability, and assistive listening systems.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', color: '#334155', fontSize: '0.92rem' }}>
              <li>✓ Verified 11-point barrier-free checklist</li>
              <li>✓ Authentic photographs of entrances, ramps, and bathrooms</li>
              <li>✓ Community reviews focused specifically on accessibility</li>
            </ul>
          </div>
        </div>

        {/* Global Accessibility Frameworks We Adhere To */}
        <div
          style={{
            backgroundColor: '#f8fafc',
            padding: '3.5rem 2.5rem',
            borderRadius: '24px',
            border: '1px solid #e2e8f0',
            marginBottom: '4.5rem',
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 2.5rem auto' }}>
            <span className="section-subtitle-tag">Compliance & Inclusivity</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
              Built for Universal Usability
            </h2>
            <p style={{ color: '#64748b', margin: 0 }}>
              Both our digital platform and physical evaluation criteria are aligned with international accessibility benchmarks.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.5rem',
            }}
          >
            <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#2563eb', marginBottom: '0.4rem' }}>
                WCAG 2.2 AA
              </div>
              <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                High-contrast color modes, keyboard-friendly focus rings, scalable typography,
                and screen reader aria semantic landmarks.
              </p>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#7c3aed', marginBottom: '0.4rem' }}>
                ADA Title III
              </div>
              <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                Standard American ramp slopes (1:12 maximum), 36-inch minimum clear passage corridors,
                and barrier-free accessible restrooms.
              </p>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#059669', marginBottom: '0.4rem' }}>
                EN 301 549 & ISO 21542
              </div>
              <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                European harmonized guidelines for digital accessibility and international
                building construction mobility provisions.
              </p>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>
            Ready to Discover Barrier-Free Spaces?
          </h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/places" className="btn btn-primary btn-lg">
              Explore Accessible Places
            </Link>
            <Link to="/add-place" className="btn btn-outline-primary btn-lg">
              Suggest a Location
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
