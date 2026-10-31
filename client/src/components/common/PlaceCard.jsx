import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaMapMarkerAlt, FaShieldAlt } from 'react-icons/fa';
import StarRating from './StarRating';
import { AccessibilityBadge } from './AccessibilityBadges';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const PlaceCard = ({ place, isInitiallyFavorite = false, onFavoriteToggle }) => {
  const [isFavorite, setIsFavorite] = useState(isInitiallyFavorite);
  const [favLoading, setFavLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setFavLoading(true);
    try {
      if (isFavorite) {
        await api.delete(`/favorites/${place._id}`);
        setIsFavorite(false);
        if (onFavoriteToggle) onFavoriteToggle(place._id, false);
      } else {
        await api.post(`/favorites/${place._id}`);
        setIsFavorite(true);
        if (onFavoriteToggle) onFavoriteToggle(place._id, true);
      }
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    } finally {
      setFavLoading(false);
    }
  };

  const imageSrc =
    place.images && place.images.length > 0
      ? place.images[0].startsWith('http')
        ? place.images[0]
        : `http://localhost:5000${place.images[0]}`
      : 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80';

  // Calculate accessibility score percentage (total of 11 features)
  const scorePercent = place.accessibilityFeatures
    ? Math.round((place.accessibilityFeatures.length / 11) * 100)
    : 0;

  return (
    <article className="place-card">
      <div className="place-card-image-wrap">
        <Link to={`/places/${place._id}`} aria-label={`View details for ${place.name}`}>
          <img
            src={imageSrc}
            alt={place.name}
            className="place-card-image"
            loading="lazy"
          />
        </Link>
        <span className="place-card-category-tag">{place.category}</span>
        
        <button
          type="button"
          onClick={handleFavoriteClick}
          disabled={favLoading}
          className={`place-card-fav-btn ${isFavorite ? 'active' : ''}`}
          aria-label={isFavorite ? `Remove ${place.name} from saved favorites` : `Save ${place.name} to favorites`}
          title={isFavorite ? 'Saved in favorites' : 'Save to favorites'}
        >
          {isFavorite ? <FaHeart size={18} /> : <FaRegHeart size={18} />}
        </button>

        <div className="place-card-score-badge" title={`${scorePercent}% of accessibility features verified`}>
          <FaShieldAlt size={12} />
          <span>{scorePercent}% Verified</span>
        </div>
      </div>

      <div className="place-card-content">
        <Link to={`/places/${place._id}`}>
          <h3 className="place-card-title">{place.name}</h3>
        </Link>

        <p className="place-card-address">
          <FaMapMarkerAlt size={14} color="#94a3b8" />
          <span>{place.address}, {place.city}</span>
        </p>

        {/* Feature Badges Preview */}
        <div className="place-card-features">
          {place.accessibilityFeatures &&
            place.accessibilityFeatures.slice(0, 3).map((feature) => (
              <AccessibilityBadge key={feature} feature={feature} compact />
            ))}
          {place.accessibilityFeatures && place.accessibilityFeatures.length > 3 && (
            <span
              style={{
                fontSize: '0.75rem',
                color: '#64748b',
                alignSelf: 'center',
                fontWeight: 600,
              }}
            >
              +{place.accessibilityFeatures.length - 3} more
            </span>
          )}
        </div>

        <div className="place-card-footer">
          <StarRating
            rating={place.averageRating || 0}
            reviewCount={place.reviewCount || 0}
          />
          <Link
            to={`/places/${place._id}`}
            className="btn btn-outline-primary btn-sm"
            style={{ fontWeight: 600 }}
          >
            Details
          </Link>
        </div>
      </div>
    </article>
  );
};

export default PlaceCard;
