import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaHeart,
  FaStar,
  FaMapMarkerAlt,
  FaPlusCircle,
  FaTrash,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaShieldAlt,
  FaUserEdit,
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import PlaceCard from '../components/common/PlaceCard';
import StarRating from '../components/common/StarRating';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AlertBanner from '../components/common/AlertBanner';

const DashboardPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('favorites'); // 'favorites' | 'reviews' | 'places'

  const [favorites, setFavorites] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [myPlaces, setMyPlaces] = useState([]);

  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  // Fetch all user dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [favRes, revRes, placeRes] = await Promise.all([
          api.get('/favorites'),
          api.get('/reviews/user/my-reviews'),
          api.get('/places/user/my-places'),
        ]);

        if (favRes.data.success) {
          setFavorites(favRes.data.favorites || []);
        }
        if (revRes.data.success) {
          setReviews(revRes.data.reviews || []);
        }
        if (placeRes.data.success) {
          setMyPlaces(placeRes.data.places || []);
        }
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setAlert({ type: 'error', message: 'Failed to load your dashboard activity.' });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Remove favorite handler
  const handleRemoveFavorite = async (placeId) => {
    try {
      await api.delete(`/favorites/${placeId}`);
      setFavorites((prev) => prev.filter((f) => f.place?._id !== placeId));
      setAlert({ type: 'info', message: 'Place removed from your favorites.' });
    } catch (err) {
      setAlert({ type: 'error', message: 'Could not remove favorite.' });
    }
  };

  // Delete review handler
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await api.delete(`/reviews/${reviewId}`);
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
      setAlert({ type: 'info', message: 'Review successfully deleted.' });
    } catch (err) {
      setAlert({ type: 'error', message: 'Could not delete review.' });
    }
  };

  return (
    <div className="dashboard-page section" style={{ backgroundColor: '#f8fafc', minHeight: '85vh' }}>
      <div className="container">
        {/* Profile Overview Card */}
        <div
          className="card"
          style={{
            padding: '2.5rem',
            marginBottom: '2rem',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            border: '1px solid #e2e8f0',
            borderRadius: '20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <img
                src={
                  user?.profileImage ||
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80'
                }
                alt={user?.name || 'User profile'}
                style={{
                  width: '84px',
                  height: '84px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid #2563eb',
                  boxShadow: '0 4px 15px rgba(37, 99, 235, 0.2)',
                }}
              />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.25rem' }}>
                  <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    {user?.name}
                  </h1>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      backgroundColor: user?.role === 'admin' ? '#7c3aed' : '#2563eb',
                      color: '#ffffff',
                      padding: '0.2rem 0.55rem',
                      borderRadius: '9999px',
                      textTransform: 'uppercase',
                    }}
                  >
                    {user?.role === 'admin' ? 'Administrator' : 'Explorer'}
                  </span>
                </div>
                <p style={{ color: '#64748b', fontSize: '0.95rem', margin: '0 0 0.5rem 0' }}>
                  {user?.email} • Member since {new Date(user?.createdAt || Date.now()).getFullYear()}
                </p>
                {user?.bio && (
                  <p style={{ color: '#334155', fontSize: '0.9rem', margin: 0, fontStyle: 'italic', maxWidth: '600px' }}>
                    "{user.bio}"
                  </p>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link to="/profile" className="btn btn-outline-primary btn-sm">
                <FaUserEdit size={14} /> Edit Profile
              </Link>
              <Link to="/add-place" className="btn btn-primary btn-sm">
                <FaPlusCircle size={14} /> Suggest Place
              </Link>
            </div>
          </div>
        </div>

        {alert && (
          <AlertBanner
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        {/* Stats Metrics Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2.5rem',
          }}
        >
          <div
            className="card"
            style={{
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              borderLeft: '5px solid #dc2626',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#fee2e2',
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FaHeart size={22} />
            </div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
                {favorites.length}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
                Saved Favorites
              </div>
            </div>
          </div>

          <div
            className="card"
            style={{
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              borderLeft: '5px solid #f59e0b',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#fef3c7',
                color: '#d97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FaStar size={22} />
            </div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
                {reviews.length}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
                Submitted Reviews
              </div>
            </div>
          </div>

          <div
            className="card"
            style={{
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              borderLeft: '5px solid #2563eb',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#dbeafe',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FaMapMarkerAlt size={22} />
            </div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
                {myPlaces.length}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
                Suggested Locations
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            borderBottom: '2px solid #e2e8f0',
            marginBottom: '2rem',
          }}
        >
          <button
            onClick={() => setActiveTab('favorites')}
            style={{
              padding: '0.75rem 1.25rem',
              border: 'none',
              background: 'none',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: activeTab === 'favorites' ? '#2563eb' : '#64748b',
              borderBottom: activeTab === 'favorites' ? '3px solid #2563eb' : '3px solid transparent',
              cursor: 'pointer',
              marginBottom: '-2px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <FaHeart size={15} color={activeTab === 'favorites' ? '#dc2626' : '#94a3b8'} />
            <span>Saved Favorites ({favorites.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            style={{
              padding: '0.75rem 1.25rem',
              border: 'none',
              background: 'none',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: activeTab === 'reviews' ? '#2563eb' : '#64748b',
              borderBottom: activeTab === 'reviews' ? '3px solid #2563eb' : '3px solid transparent',
              cursor: 'pointer',
              marginBottom: '-2px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <FaStar size={15} color={activeTab === 'reviews' ? '#f59e0b' : '#94a3b8'} />
            <span>My Reviews ({reviews.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('places')}
            style={{
              padding: '0.75rem 1.25rem',
              border: 'none',
              background: 'none',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: activeTab === 'places' ? '#2563eb' : '#64748b',
              borderBottom: activeTab === 'places' ? '3px solid #2563eb' : '3px solid transparent',
              cursor: 'pointer',
              marginBottom: '-2px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <FaMapMarkerAlt size={15} color={activeTab === 'places' ? '#2563eb' : '#94a3b8'} />
            <span>Suggested Places ({myPlaces.length})</span>
          </button>
        </div>

        {/* Tab 1: Favorites */}
        {activeTab === 'favorites' && (
          <div>
            {loading ? (
              <LoadingSpinner message="Loading your favorite places..." />
            ) : favorites.length === 0 ? (
              <div className="card" style={{ padding: '3.5rem', textAlign: 'center' }}>
                <FaHeart size={36} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  No Saved Places Yet
                </h3>
                <p style={{ color: '#64748b', maxWidth: '420px', margin: '0 auto 1.5rem auto' }}>
                  Click the heart icon on any accessible location to bookmark it for quick access anytime.
                </p>
                <Link to="/places" className="btn btn-primary">
                  Explore Places
                </Link>
              </div>
            ) : (
              <div className="places-grid">
                {favorites.map((fav) => {
                  if (!fav.place) return null;
                  return (
                    <div key={fav._id} style={{ position: 'relative' }}>
                      <PlaceCard
                        place={fav.place}
                        isInitiallyFavorite={true}
                        onFavoriteToggle={(pId, isFav) => {
                          if (!isFav) {
                            setFavorites((prev) => prev.filter((f) => f.place?._id !== pId));
                          }
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Reviews */}
        {activeTab === 'reviews' && (
          <div>
            {loading ? (
              <LoadingSpinner message="Loading your submitted reviews..." />
            ) : reviews.length === 0 ? (
              <div className="card" style={{ padding: '3.5rem', textAlign: 'center' }}>
                <FaStar size={36} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  No Reviews Written Yet
                </h3>
                <p style={{ color: '#64748b', maxWidth: '420px', margin: '0 auto 1.5rem auto' }}>
                  Have you visited an accessible hospital, restaurant, or hotel? Share your rating and feedback to help others.
                </p>
                <Link to="/places" className="btn btn-primary">
                  Find Places to Review
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {reviews.map((rev) => (
                  <div
                    key={rev._id}
                    className="card"
                    style={{
                      padding: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <Link
                          to={`/places/${rev.place?._id}`}
                          style={{
                            fontSize: '1.15rem',
                            fontWeight: 700,
                            color: '#0f172a',
                            textDecoration: 'none',
                          }}
                        >
                          {rev.place?.name || 'Accessible Place'}
                        </Link>
                        <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
                          {rev.place?.category} • {rev.place?.city}
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteReview(rev._id)}
                        className="btn btn-outline btn-sm"
                        style={{ color: '#dc2626', borderColor: '#fecaca' }}
                        title="Delete review"
                      >
                        <FaTrash size={13} /> Delete
                      </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <StarRating rating={rev.rating} size={15} showValue={false} />
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.95rem', color: '#334155', lineHeight: 1.55, margin: 0 }}>
                      "{rev.comment}"
                    </p>

                    {rev.accessibilityHighlights && rev.accessibilityHighlights.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.25rem' }}>
                        {rev.accessibilityHighlights.map((feat) => (
                          <span
                            key={feat}
                            style={{
                              fontSize: '0.75rem',
                              backgroundColor: '#eff6ff',
                              color: '#1d4ed8',
                              padding: '0.2rem 0.5rem',
                              borderRadius: '4px',
                              fontWeight: 600,
                            }}
                          >
                            ✓ {feat}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Suggested Places */}
        {activeTab === 'places' && (
          <div>
            {loading ? (
              <LoadingSpinner message="Loading your suggested places..." />
            ) : myPlaces.length === 0 ? (
              <div className="card" style={{ padding: '3.5rem', textAlign: 'center' }}>
                <FaMapMarkerAlt size={36} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  No Suggested Places
                </h3>
                <p style={{ color: '#64748b', maxWidth: '420px', margin: '0 auto 1.5rem auto' }}>
                  You haven't submitted any places yet. Know a wheelchair accessible cafe, park, or clinic?
                </p>
                <Link to="/add-place" className="btn btn-primary">
                  Suggest a Place Now
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {myPlaces.map((pl) => {
                  const statusColors = {
                    approved: { bg: '#ecfdf5', text: '#047857', border: '#a7f3d0', icon: FaCheckCircle, label: 'Approved & Live' },
                    pending: { bg: '#fffbeb', text: '#b45309', border: '#fde68a', icon: FaClock, label: 'Pending Verification' },
                    rejected: { bg: '#fef2f2', text: '#b91c1c', border: '#fecaca', icon: FaTimesCircle, label: 'Needs Correction' },
                  }[pl.status] || { bg: '#f1f5f9', text: '#475569', border: '#cbd5e1', icon: FaClock, label: pl.status };

                  const StatusIcon = statusColors.icon;

                  return (
                    <div
                      key={pl._id}
                      className="card"
                      style={{
                        padding: '1.5rem',
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '1.25rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <img
                          src={
                            pl.images && pl.images.length > 0
                              ? pl.images[0].startsWith('http')
                                ? pl.images[0]
                                : `http://localhost:5000${pl.images[0]}`
                              : 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80'
                          }
                          alt={pl.name}
                          style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '12px',
                            objectFit: 'cover',
                          }}
                        />
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                              {pl.name}
                            </h3>
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                                padding: '0.2rem 0.55rem',
                                borderRadius: '9999px',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                backgroundColor: statusColors.bg,
                                color: statusColors.text,
                                border: `1px solid ${statusColors.border}`,
                              }}
                            >
                              <StatusIcon size={12} /> {statusColors.label}
                            </span>
                          </div>

                          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                            {pl.category} • {pl.address}, {pl.city}
                          </div>

                          <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '0.25rem' }}>
                            {pl.accessibilityFeatures?.length || 0} accessibility checkpoints submitted
                          </div>

                          {pl.status === 'rejected' && pl.rejectionReason && (
                            <div style={{ fontSize: '0.82rem', color: '#b91c1c', marginTop: '0.4rem', fontWeight: 500 }}>
                              Rejection note: {pl.rejectionReason}
                            </div>
                          )}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.65rem' }}>
                        <Link to={`/places/${pl._id}`} className="btn btn-outline btn-sm">
                          View Place
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
