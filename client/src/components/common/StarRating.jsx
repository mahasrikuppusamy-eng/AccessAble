import React, { useState } from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const StarRating = ({
  rating = 0,
  reviewCount,
  interactive = false,
  onChange,
  size = 16,
  showValue = true,
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  if (interactive) {
    return (
      <div
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
        role="radiogroup"
        aria-label="Star Rating Input"
      >
        {[1, 2, 3, 4, 5].map((starValue) => {
          const filled = (hoverRating || rating) >= starValue;
          return (
            <button
              type="button"
              key={starValue}
              onClick={() => onChange && onChange(starValue)}
              onMouseEnter={() => setHoverRating(starValue)}
              onMouseLeave={() => setHoverRating(0)}
              aria-label={`${starValue} Stars`}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '2px',
                color: filled ? '#f59e0b' : '#cbd5e1',
                fontSize: `${size}px`,
                display: 'flex',
                transition: 'transform 0.15s ease',
              }}
              onFocus={() => setHoverRating(starValue)}
              onBlur={() => setHoverRating(0)}
            >
              <FaStar size={size} />
            </button>
          );
        })}
        {showValue && (
          <span style={{ marginLeft: '0.4rem', fontWeight: 700, fontSize: '0.9rem', color: '#334155' }}>
            {hoverRating || rating || 0} / 5
          </span>
        )}
      </div>
    );
  }

  // Display mode
  const safeRating = Math.max(0, Math.min(5, Number(rating) || 0));
  const fullStars = Math.floor(safeRating);
  const hasHalfStar = safeRating - fullStars >= 0.4;
  const emptyStars = Math.max(0, 5 - fullStars - (hasHalfStar ? 1 : 0));

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.25rem',
      }}
      aria-label={`Rating: ${safeRating} out of 5 stars`}
    >
      <div style={{ display: 'flex', color: '#f59e0b', gap: '1px' }}>
        {[...Array(fullStars)].map((_, i) => (
          <FaStar key={`full-${i}`} size={size} />
        ))}
        {hasHalfStar && <FaStarHalfAlt size={size} />}
        {[...Array(emptyStars)].map((_, i) => (
          <FaRegStar key={`empty-${i}`} size={size} color="#cbd5e1" />
        ))}
      </div>
      {showValue && (
        <span
          style={{
            marginLeft: '0.35rem',
            fontWeight: 700,
            fontSize: '0.875rem',
            color: '#1e293b',
          }}
        >
          {safeRating.toFixed(1)}
        </span>
      )}
      {reviewCount !== undefined && (
        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
          ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
        </span>
      )}
    </div>
  );
};

export default StarRating;
