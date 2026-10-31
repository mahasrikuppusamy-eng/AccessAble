import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaSearch } from 'react-icons/fa';
import api from '../services/api';
import PlaceCard from '../components/common/PlaceCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AlertBanner from '../components/common/AlertBanner';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      try {
        const response = await api.get('/favorites');
        if (response.data.success) {
          setFavorites(response.data.favorites || []);
        }
      } catch (err) {
        console.error('Failed to load favorites:', err);
        setAlert({ type: 'error', message: 'Could not fetch your saved places.' });
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleFavoriteToggle = (placeId, isFav) => {
    if (!isFav) {
      setFavorites((prev) => prev.filter((f) => f.place?._id !== placeId));
      setAlert({ type: 'info', message: 'Place removed from your favorites.' });
    }
  };

  return (
    <div className="favorites-page section" style={{ backgroundColor: '#f8fafc', minHeight: '85vh' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem 0.9rem',
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              borderRadius: '9999px',
              fontSize: '0.85rem',
              fontWeight: 700,
              marginBottom: '0.75rem',
            }}
          >
            <FaHeart size={13} /> Saved Locations
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
            My Favorite Places
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.05rem', margin: 0 }}>
            Quickly plan your trips with your saved wheelchair accessible and barrier-free destinations.
          </p>
        </div>

        {alert && (
          <AlertBanner
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        {loading ? (
          <LoadingSpinner message="Loading your saved accessible places..." />
        ) : favorites.length === 0 ? (
          <div
            className="card"
            style={{
              padding: '4rem 1.5rem',
              textAlign: 'center',
              maxWidth: '560px',
              margin: '0 auto',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#fee2e2',
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto',
              }}
            >
              <FaHeart size={30} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.6rem' }}>
              Your Favorites List is Empty
            </h2>
            <p style={{ color: '#64748b', lineHeight: 1.6, marginBottom: '2rem' }}>
              While browsing accessible places, tap the heart button on any location card to
              save it here for instant reference.
            </p>
            <Link to="/places" className="btn btn-primary" style={{ padding: '0.8rem 1.8rem' }}>
              <FaSearch size={14} /> Explore Accessible Places
            </Link>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: '1.25rem', color: '#64748b', fontWeight: 600 }}>
              {favorites.length} {favorites.length === 1 ? 'saved place' : 'saved places'}
            </div>
            <div className="places-grid">
              {favorites.map((fav) => {
                if (!fav.place) return null;
                return (
                  <PlaceCard
                    key={fav._id}
                    place={fav.place}
                    isInitiallyFavorite={true}
                    onFavoriteToggle={handleFavoriteToggle}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
