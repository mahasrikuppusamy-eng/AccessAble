import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FaWheelchair,
  FaHeart,
  FaUserCircle,
  FaBars,
  FaTimes,
  FaPlusCircle,
  FaSearch,
  FaShieldAlt,
  FaSignOutAlt,
  FaTachometerAlt,
  FaUser,
} from 'react-icons/fa';
import { MdFilterList } from 'react-icons/md';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '74px',
        }}
      >
        {/* Brand Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            textDecoration: 'none',
          }}
          aria-label="AccessAble Home"
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
            }}
          >
            <FaWheelchair size={22} />
          </div>
          <div>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.45rem',
                fontWeight: 800,
                color: '#0f172a',
                letterSpacing: '-0.03em',
                lineHeight: 1,
                display: 'block',
              }}
            >
              Access<span style={{ color: '#2563eb' }}>Able</span>
            </span>
            <span
              style={{
                fontSize: '0.72rem',
                color: '#64748b',
                fontWeight: 600,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              Barrier-Free Discovery
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '1.5rem',
          }}
          className="desktop-nav"
        >
          <NavLink
            to="/"
            style={({ isActive }) => ({
              fontWeight: 600,
              fontSize: '0.95rem',
              color: isActive ? '#2563eb' : '#475569',
              textDecoration: 'none',
              padding: '0.4rem 0.2rem',
              borderBottom: isActive ? '2px solid #2563eb' : '2px solid transparent',
              transition: 'all 0.15s ease',
            })}
          >
            Home
          </NavLink>

          <NavLink
            to="/places"
            style={({ isActive }) => ({
              fontWeight: 600,
              fontSize: '0.95rem',
              color: isActive ? '#2563eb' : '#475569',
              textDecoration: 'none',
              padding: '0.4rem 0.2rem',
              borderBottom: isActive ? '2px solid #2563eb' : '2px solid transparent',
              transition: 'all 0.15s ease',
            })}
          >
            Explore Places
          </NavLink>

          <NavLink
            to="/filter"
            style={({ isActive }) => ({
              fontWeight: 600,
              fontSize: '0.95rem',
              color: isActive ? '#2563eb' : '#475569',
              textDecoration: 'none',
              padding: '0.4rem 0.2rem',
              borderBottom: isActive ? '2px solid #2563eb' : '2px solid transparent',
              transition: 'all 0.15s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
            })}
          >
            <MdFilterList size={18} />
            Filters
          </NavLink>

          <NavLink
            to="/add-place"
            style={({ isActive }) => ({
              fontWeight: 600,
              fontSize: '0.95rem',
              color: isActive ? '#2563eb' : '#475569',
              textDecoration: 'none',
              padding: '0.4rem 0.2rem',
              borderBottom: isActive ? '2px solid #2563eb' : '2px solid transparent',
              transition: 'all 0.15s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
            })}
          >
            <FaPlusCircle size={15} color="#2563eb" />
            Add Place
          </NavLink>

          <NavLink
            to="/about"
            style={({ isActive }) => ({
              fontWeight: 600,
              fontSize: '0.95rem',
              color: isActive ? '#2563eb' : '#475569',
              textDecoration: 'none',
              padding: '0.4rem 0.2rem',
              borderBottom: isActive ? '2px solid #2563eb' : '2px solid transparent',
              transition: 'all 0.15s ease',
            })}
          >
            About Us
          </NavLink>

          <NavLink
            to="/contact"
            style={({ isActive }) => ({
              fontWeight: 600,
              fontSize: '0.95rem',
              color: isActive ? '#2563eb' : '#475569',
              textDecoration: 'none',
              padding: '0.4rem 0.2rem',
              borderBottom: isActive ? '2px solid #2563eb' : '2px solid transparent',
              transition: 'all 0.15s ease',
            })}
          >
            Contact
          </NavLink>
        </nav>

        {/* Right Section / Auth Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Favorites link */}
          <Link
            to="/favorites"
            className="btn btn-outline"
            style={{
              padding: '0.45rem 0.85rem',
              fontSize: '0.88rem',
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
            title="View saved favorites"
          >
            <FaHeart color="#dc2626" size={15} />
            <span style={{ fontWeight: 600 }}>Favorites</span>
          </Link>

          {/* User authenticated dropdown or Login/Register buttons */}
          {isAuthenticated ? (
            <div style={{ position: 'relative' }} ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  padding: '0.35rem 0.65rem',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  transition: 'border-color 0.15s ease',
                }}
              >
                <img
                  src={
                    user?.profileImage ||
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
                  }
                  alt={user?.name || 'User'}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                  }}
                />
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    color: '#1e293b',
                    maxWidth: '110px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {user?.name?.split(' ')[0]}
                </span>
                {isAdmin && (
                  <span
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      backgroundColor: '#7c3aed',
                      color: '#ffffff',
                      padding: '0.15rem 0.4rem',
                      borderRadius: '4px',
                      textTransform: 'uppercase',
                    }}
                  >
                    Admin
                  </span>
                )}
              </button>

              {/* User Dropdown Menu */}
              {dropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '46px',
                    right: 0,
                    width: '230px',
                    backgroundColor: '#ffffff',
                    borderRadius: '14px',
                    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.12)',
                    border: '1px solid #e2e8f0',
                    padding: '0.5rem',
                    zIndex: 200,
                    animation: 'modalEnter 0.15s ease',
                  }}
                >
                  <div
                    style={{
                      padding: '0.6rem 0.8rem',
                      borderBottom: '1px solid #f1f5f9',
                      marginBottom: '0.4rem',
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>
                      {user?.name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      {user?.email}
                    </div>
                  </div>

                  <Link
                    to="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.6rem 0.8rem',
                      color: '#334155',
                      borderRadius: '8px',
                      fontSize: '0.88rem',
                      fontWeight: 500,
                      textDecoration: 'none',
                    }}
                  >
                    <FaTachometerAlt size={15} color="#2563eb" />
                    <span>My Dashboard</span>
                  </Link>

                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.6rem 0.8rem',
                      color: '#334155',
                      borderRadius: '8px',
                      fontSize: '0.88rem',
                      fontWeight: 500,
                      textDecoration: 'none',
                    }}
                  >
                    <FaUser size={15} color="#7c3aed" />
                    <span>My Profile</span>
                  </Link>

                  <Link
                    to="/favorites"
                    onClick={() => setDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.6rem 0.8rem',
                      color: '#334155',
                      borderRadius: '8px',
                      fontSize: '0.88rem',
                      fontWeight: 500,
                      textDecoration: 'none',
                    }}
                  >
                    <FaHeart size={15} color="#dc2626" />
                    <span>Saved Places</span>
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.6rem 0.8rem',
                        color: '#7c3aed',
                        backgroundColor: '#f5f3ff',
                        borderRadius: '8px',
                        fontSize: '0.88rem',
                        fontWeight: 700,
                        textDecoration: 'none',
                        marginTop: '0.3rem',
                      }}
                    >
                      <FaShieldAlt size={15} color="#7c3aed" />
                      <span>Admin Control Panel</span>
                    </Link>
                  )}

                  <div style={{ borderTop: '1px solid #f1f5f9', margin: '0.4rem 0' }} />

                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.6rem 0.8rem',
                      color: '#dc2626',
                      background: 'none',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <FaSignOutAlt size={15} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-outline-primary btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}

          {/* Mobile menu toggle button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-nav-toggle"
            aria-label="Toggle Navigation Menu"
            style={{
              background: 'none',
              border: 'none',
              color: '#334155',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.4rem',
            }}
          >
            {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderBottom: '2px solid #e2e8f0',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
          }}
        >
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: 600, color: '#1e293b', fontSize: '1rem' }}
          >
            Home
          </Link>
          <Link
            to="/places"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: 600, color: '#1e293b', fontSize: '1rem' }}
          >
            Explore Places
          </Link>
          <Link
            to="/filter"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: 600, color: '#1e293b', fontSize: '1rem' }}
          >
            Accessibility Filters
          </Link>
          <Link
            to="/add-place"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: 600, color: '#1e293b', fontSize: '1rem' }}
          >
            + Add a Place
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: 600, color: '#1e293b', fontSize: '1rem' }}
          >
            About Us
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: 600, color: '#1e293b', fontSize: '1rem' }}
          >
            Contact
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontWeight: 700, color: '#7c3aed', fontSize: '1rem' }}
            >
              Admin Dashboard
            </Link>
          )}
        </div>
      )}

      {/* CSS for responsive navigation toggle */}
      <style>{`
        @media (min-width: 900px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-nav-toggle {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
