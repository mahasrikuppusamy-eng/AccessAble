import React from 'react';
import { Link } from 'react-router-dom';
import { FaWheelchair, FaSearch, FaHome } from 'react-icons/fa';

const NotFoundPage = () => {
  return (
    <div
      className="not-found-page section"
      style={{
        backgroundColor: '#f8fafc',
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <div className="container" style={{ maxWidth: '560px' }}>
        <div className="card" style={{ padding: '3.5rem 2rem', borderRadius: '24px' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '20px',
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto',
            }}
          >
            <FaWheelchair size={36} />
          </div>

          <h1
            style={{
              fontSize: '4.5rem',
              fontWeight: 800,
              color: '#2563eb',
              lineHeight: 1,
              marginBottom: '0.75rem',
              letterSpacing: '-0.04em',
            }}
          >
            404
          </h1>

          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>
            Page Not Found
          </h2>

          <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            The page you are looking for may have been moved, renamed, or is temporarily unavailable.
            Don't worry, all our barrier-free discovery pathways are open!
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
            <Link to="/" className="btn btn-primary" style={{ padding: '0.8rem 1.6rem' }}>
              <FaHome size={15} /> Back to Home
            </Link>
            <Link to="/places" className="btn btn-outline-primary" style={{ padding: '0.8rem 1.6rem' }}>
              <FaSearch size={14} /> Explore Places
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
