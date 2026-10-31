import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FaHeart,
  FaRegHeart,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaGlobe,
  FaClock,
  FaShieldAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaEdit,
  FaTrash,
  FaShareAlt,
  FaStar,
} from 'react-icons/fa';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/common/StarRating';
import { AccessibilityBadge, FEATURE_CONFIG } from '../components/common/AccessibilityBadges';
import LeafletMap from '../components/common/LeafletMap';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ReportModal from '../components/common/ReportModal';
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

const PlaceDetailsPage = () => {
  const { id } = useParams();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [place, setPlace] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Review Form State
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState('');
  const [highlightsInput, setHighlightsInput] = useState([]);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);

  // Notification & Modals
  const [alert, setAlert] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Fetch Place and Reviews
  useEffect(() => {
    const fetchPlaceDetails = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/places/${id}`);
        if (response.data.success) {
          setPlace(response.data.place);
          setReviews(response.data.reviews || []);
        }
      } catch (err) {
        console.error('Failed to load place:', err);
        setAlert({ type: 'error', message: 'Unable to load place details.' });
      } finally {
        setLoading(false);
      }
    };

    fetchPlaceDetails();
  }, [id]);

  // Check if place is favorited by current user
  useEffect(() => {
    if (!isAuthenticated || !id) return;
    const checkFav = async () => {
      try {
        const response = await api.get(`/favorites/check/${id}`);
        if (response.data.success) {
          setIsFavorite(response.data.isFavorite);
        }
      } catch (err) {
        // Silently catch
      }
    };
    checkFav();
  }, [id, isAuthenticated]);

  // Toggle favorite
  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setFavLoading(true);
    try {
      if (isFavorite) {
        await api.delete(`/favorites/${id}`);
        setIsFavorite(false);
        setAlert({ type: 'info', message: 'Removed from saved favorites.' });
      } else {
        await api.post(`/favorites/${id}`);
        setIsFavorite(true);
        setAlert({ type: 'success', message: 'Saved to your favorites!' });
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Could not update favorites.' });
    } finally {
      setFavLoading(false);
    }
  };

  // Submit Review (Create or Update)
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!commentInput.trim()) {
      setAlert({ type: 'warning', message: 'Please write a review comment.' });
      return;
    }

    setSubmittingReview(true);
    try {
      if (editingReviewId) {
        // Update review
        const response = await api.put(`/reviews/${editingReviewId}`, {
          rating: ratingInput,
          comment: commentInput,
          accessibilityHighlights: highlightsInput,
        });

        if (response.data.success) {
          setReviews((prev) =>
            prev.map((r) => (r._id === editingReviewId ? response.data.review : r))
          );
          setAlert({ type: 'success', message: 'Review updated successfully!' });
          setEditingReviewId(null);
          setCommentInput('');
          setHighlightsInput([]);
        }
      } else {
        // Create review
        const response = await api.post(`/reviews/${id}`, {
          rating: ratingInput,
          comment: commentInput,
          accessibilityHighlights: highlightsInput,
          experienceDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        });

        if (response.data.success) {
          setReviews([response.data.review, ...reviews]);
          setAlert({ type: 'success', message: 'Thank you for your accessibility review!' });
          setCommentInput('');
          setHighlightsInput([]);

          // Refetch updated place to reflect new averageRating
          const updatedPlace = await api.get(`/places/${id}`);
          if (updatedPlace.data.success) {
            setPlace(updatedPlace.data.place);
          }
        }
      }
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.response?.data?.message || 'Failed to submit review.',
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  // Edit existing review
  const handleStartEditReview = (rev) => {
    setEditingReviewId(rev._id);
    setRatingInput(rev.rating);
    setCommentInput(rev.comment);
    setHighlightsInput(rev.accessibilityHighlights || []);
    // Scroll to review form
    document.getElementById('review-form-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Delete review
  const handleDeleteReview = async (revId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      const response = await api.delete(`/reviews/${revId}`);
      if (response.data.success) {
        setReviews((prev) => prev.filter((r) => r._id !== revId));
        setAlert({ type: 'info', message: 'Review deleted.' });
        // Refetch place stats
        const updatedPlace = await api.get(`/places/${id}`);
        if (updatedPlace.data.success) {
          setPlace(updatedPlace.data.place);
        }
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Could not delete review.' });
    }
  };

  const toggleHighlightChoice = (feature) => {
    setHighlightsInput((prev) =>
      prev.includes(feature) ? prev.filter((f) => f !== feature) : [...prev, feature]
    );
  };

  if (loading) {
    return <LoadingSpinner message="Loading place information..." />;
  }

  if (!place) {
    return (
      <div className="container section" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <h2>Place Not Found</h2>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
          The requested place may have been removed or does not exist.
        </p>
        <Link to="/places" className="btn btn-primary">
          Back to Explore
        </Link>
      </div>
    );
  }

  const scorePercent = place.accessibilityFeatures
    ? Math.round((place.accessibilityFeatures.length / ALL_11_FEATURES.length) * 100)
    : 0;

  const images = place.images && place.images.length > 0 ? place.images : [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
  ];

  const currentImageSrc = images[selectedImageIndex]?.startsWith('http')
    ? images[selectedImageIndex]
    : `http://localhost:5000${images[selectedImageIndex]}`;

  // Check if current user already reviewed this place
  const userHasReviewed = user && reviews.some((r) => r.user?._id === user._id || r.user === user._id);

  return (
    <div className="place-details-page section" style={{ backgroundColor: '#f8fafc', paddingTop: '2.5rem' }}>
      <div className="container">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: '#64748b' }}>
          <Link to="/" style={{ color: '#64748b' }}>Home</Link>
          <span style={{ margin: '0 0.5rem' }}>/</span>
          <Link to="/places" style={{ color: '#64748b' }}>Explore</Link>
          <span style={{ margin: '0 0.5rem' }}>/</span>
          <span style={{ color: '#0f172a', fontWeight: 600 }}>{place.name}</span>
        </nav>

        {alert && (
          <AlertBanner
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        {/* Header Title Bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '1.25rem',
            marginBottom: '1.75rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
              <span className="badge badge-primary" style={{ fontSize: '0.85rem' }}>
                {place.category}
              </span>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.25rem 0.65rem',
                  backgroundColor: '#ecfdf5',
                  color: '#047857',
                  borderRadius: '9999px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  border: '1px solid #a7f3d0',
                }}
              >
                <FaShieldAlt size={13} />
                <span>{scorePercent}% Verified Barrier-Free</span>
              </div>
            </div>

            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
              {place.name}
            </h1>

            <p style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '1rem', marginTop: '0.4rem' }}>
              <FaMapMarkerAlt color="#ef4444" size={16} />
              <span>{place.address}, {place.city} {place.state} {place.zipCode}</span>
            </p>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={handleToggleFavorite}
              disabled={favLoading}
              className={`btn ${isFavorite ? 'btn-danger' : 'btn-outline'}`}
              style={{ borderRadius: '12px', padding: '0.7rem 1.25rem' }}
              aria-label={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
            >
              {isFavorite ? <FaHeart size={16} /> : <FaRegHeart size={16} />}
              <span>{isFavorite ? 'Saved in Favorites' : 'Save to Favorites'}</span>
            </button>

            <button
              onClick={() => setIsReportModalOpen(true)}
              className="btn btn-outline"
              style={{ borderRadius: '12px', padding: '0.7rem 1.25rem' }}
              title="Report incorrect accessibility information"
            >
              <FaExclamationTriangle size={15} color="#d97706" />
              <span>Report Issue</span>
            </button>
          </div>
        </div>

        {/* Gallery & Showcase Grid */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div
            style={{
              width: '100%',
              height: '420px',
              borderRadius: '20px',
              overflow: 'hidden',
              backgroundColor: '#e2e8f0',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            }}
          >
            <img
              src={currentImageSrc}
              alt={place.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Thumbnail Strip if multiple images */}
          {images.length > 1 && (
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  style={{
                    border: selectedImageIndex === idx ? '3px solid #2563eb' : '2px solid transparent',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    width: '90px',
                    height: '65px',
                    padding: 0,
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={img.startsWith('http') ? img : `http://localhost:5000${img}`}
                    alt={`Thumbnail ${idx + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main Two-Column Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '2.5rem',
            alignItems: 'start',
          }}
          className="details-grid-container"
        >
          {/* Left Column: Details, Features, Reviews */}
          <div>
            {/* Description Card */}
            <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem' }}>
                About This Location
              </h2>
              <p style={{ fontSize: '1.05rem', color: '#334155', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                {place.description}
              </p>

              {place.accessibilityNotes && (
                <div
                  style={{
                    padding: '1.25rem',
                    backgroundColor: '#eff6ff',
                    borderLeft: '4px solid #2563eb',
                    borderRadius: '8px',
                  }}
                >
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e40af', marginBottom: '0.4rem' }}>
                    Auditor & Community Accessibility Notes:
                  </h4>
                  <p style={{ fontSize: '0.92rem', color: '#1e3a8a', margin: 0, lineHeight: 1.5 }}>
                    {place.accessibilityNotes}
                  </p>
                </div>
              )}
            </div>

            {/* Complete Accessibility Checkpoints Matrix */}
            <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>
                    Accessibility Features Checklist
                  </h2>
                  <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0.2rem 0 0 0' }}>
                    {place.accessibilityFeatures?.length || 0} of {ALL_11_FEATURES.length} features audited and confirmed available.
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '1rem',
                }}
              >
                {ALL_11_FEATURES.map((feature) => {
                  const isVerified = place.accessibilityFeatures?.includes(feature);
                  return (
                    <AccessibilityBadge
                      key={feature}
                      feature={feature}
                      verified={isVerified}
                    />
                  );
                })}
              </div>
            </div>

            {/* Interactive Location Map */}
            <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                Map & Exact Entrance
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                Located at {place.address}, {place.city}.
              </p>

              {place.location?.lat && place.location?.lng ? (
                <LeafletMap
                  places={[place]}
                  center={[place.location.lat, place.location.lng]}
                  zoom={15}
                  height="340px"
                />
              ) : (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
                  Coordinates not specified for map view.
                </div>
              )}
            </div>

            {/* Reviews Section */}
            <section id="reviews-section" className="card" style={{ padding: '2rem' }}>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '2rem',
                  gap: '1rem',
                  borderBottom: '1px solid #e2e8f0',
                  paddingBottom: '1.5rem',
                }}
              >
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>
                    Community Reviews & Experiences
                  </h2>
                  <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0.2rem 0 0 0' }}>
                    Ratings based on real accessibility and mobility visits.
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
                    {place.averageRating ? place.averageRating.toFixed(1) : '5.0'}
                  </div>
                  <div>
                    <StarRating rating={place.averageRating || 5} size={18} showValue={false} />
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Review Submission Form */}
              <div
                id="review-form-section"
                style={{
                  backgroundColor: '#f8fafc',
                  padding: '1.5rem',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  marginBottom: '2.5rem',
                }}
              >
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', color: '#0f172a' }}>
                  {editingReviewId ? 'Edit Your Accessibility Review' : 'Share Your Accessibility Experience'}
                </h3>

                {!isAuthenticated ? (
                  <div style={{ textAlign: 'center', padding: '1rem' }}>
                    <p style={{ color: '#64748b', marginBottom: '1rem', fontSize: '0.95rem' }}>
                      Please sign in to write an accessibility review and rate this place.
                    </p>
                    <Link to="/login" className="btn btn-primary btn-sm">
                      Sign In to Review
                    </Link>
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit}>
                    {/* Star Rating Selector */}
                    <div className="form-group">
                      <label className="form-label">Overall Accessibility Rating *</label>
                      <StarRating
                        interactive
                        rating={ratingInput}
                        onChange={(r) => setRatingInput(r)}
                        size={26}
                      />
                    </div>

                    {/* Review Comment */}
                    <div className="form-group">
                      <label htmlFor="reviewComment" className="form-label">
                        Your Feedback & Details *
                      </label>
                      <textarea
                        id="reviewComment"
                        className="form-control"
                        rows="3"
                        placeholder="Describe ramp angles, bathroom accessibility, elevator widths, noise levels, or staff helpfulness..."
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        required
                      />
                    </div>

                    {/* Features Personally Tested */}
                    <div className="form-group">
                      <label className="form-label">Features you personally tested or observed:</label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {place.accessibilityFeatures?.map((f) => {
                          const isPicked = highlightsInput.includes(f);
                          return (
                            <button
                              type="button"
                              key={f}
                              onClick={() => toggleHighlightChoice(f)}
                              style={{
                                padding: '0.3rem 0.7rem',
                                borderRadius: '9999px',
                                border: '1px solid',
                                borderColor: isPicked ? '#2563eb' : '#cbd5e1',
                                backgroundColor: isPicked ? '#eff6ff' : '#ffffff',
                                color: isPicked ? '#1d4ed8' : '#475569',
                                fontSize: '0.8rem',
                                fontWeight: isPicked ? 700 : 500,
                                cursor: 'pointer',
                              }}
                            >
                              {isPicked ? '✓ ' : '+ '} {f}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem' }}>
                      {editingReviewId && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingReviewId(null);
                            setCommentInput('');
                            setHighlightsInput([]);
                          }}
                          className="btn btn-outline btn-sm"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        type="submit"
                        disabled={submittingReview}
                        className="btn btn-primary btn-sm"
                      >
                        {submittingReview
                          ? 'Submitting...'
                          : editingReviewId
                          ? 'Update Review'
                          : 'Post Review'}
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Reviews List */}
              {reviews.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                  No reviews posted yet. Be the first to share your accessibility feedback!
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {reviews.map((rev) => {
                    const isOwner = user && (rev.user?._id === user._id || rev.user === user._id);
                    const canModerate = isOwner || isAdmin;

                    return (
                      <div
                        key={rev._id}
                        style={{
                          padding: '1.5rem',
                          backgroundColor: '#ffffff',
                          borderRadius: '14px',
                          border: '1px solid #e2e8f0',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '0.85rem',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <img
                              src={
                                rev.user?.profileImage ||
                                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
                              }
                              alt={rev.user?.name || 'Reviewer'}
                              style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                              }}
                            />
                            <div>
                              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>
                                {rev.user?.name || 'Verified Explorer'}
                              </div>
                              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                                {rev.experienceDate || new Date(rev.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>

                          {/* Moderate buttons */}
                          {canModerate && (
                            <div style={{ display: 'flex', gap: '0.4rem' }}>
                              {isOwner && (
                                <button
                                  onClick={() => handleStartEditReview(rev)}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#2563eb',
                                    cursor: 'pointer',
                                    padding: '4px',
                                  }}
                                  title="Edit review"
                                  aria-label="Edit review"
                                >
                                  <FaEdit size={16} />
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteReview(rev._id)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: '#dc2626',
                                  cursor: 'pointer',
                                  padding: '4px',
                                }}
                                title="Delete review"
                                aria-label="Delete review"
                              >
                                <FaTrash size={15} />
                              </button>
                            </div>
                          )}
                        </div>

                        <div style={{ marginBottom: '0.75rem' }}>
                          <StarRating rating={rev.rating} size={15} showValue={false} />
                        </div>

                        <p style={{ fontSize: '0.95rem', color: '#334155', lineHeight: 1.6, margin: '0 0 0.85rem 0' }}>
                          {rev.comment}
                        </p>

                        {/* Tested feature highlights */}
                        {rev.accessibilityHighlights && rev.accessibilityHighlights.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                            {rev.accessibilityHighlights.map((feat) => (
                              <span
                                key={feat}
                                style={{
                                  fontSize: '0.75rem',
                                  backgroundColor: '#f1f5f9',
                                  color: '#475569',
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
                    );
                  })}
                </div>
              )}
            </section>
          </div>

          {/* Right Column: Contact, Hours & Quick Actions */}
          <div>
            {/* Quick Info Card */}
            <div className="card" style={{ padding: '1.75rem', marginBottom: '1.5rem', position: 'sticky', top: '95px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem', color: '#0f172a' }}>
                Contact & Operating Hours
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.92rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                  <FaClock size={16} color="#2563eb" style={{ marginTop: '3px', flexShrink: 0 }} />
                  <div>
                    <span style={{ fontWeight: 700, display: 'block', color: '#0f172a' }}>Hours</span>
                    <span style={{ color: '#475569' }}>{place.openingHours || 'Mon-Sun: 9:00 AM - 9:00 PM'}</span>
                  </div>
                </div>

                {place.contact?.phone && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                    <FaPhoneAlt size={16} color="#2563eb" style={{ marginTop: '3px', flexShrink: 0 }} />
                    <div>
                      <span style={{ fontWeight: 700, display: 'block', color: '#0f172a' }}>Phone</span>
                      <a href={`tel:${place.contact.phone}`} style={{ color: '#2563eb' }}>
                        {place.contact.phone}
                      </a>
                    </div>
                  </div>
                )}

                {place.contact?.email && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                    <FaEnvelope size={16} color="#2563eb" style={{ marginTop: '3px', flexShrink: 0 }} />
                    <div>
                      <span style={{ fontWeight: 700, display: 'block', color: '#0f172a' }}>Email</span>
                      <a href={`mailto:${place.contact.email}`} style={{ color: '#2563eb', wordBreak: 'break-all' }}>
                        {place.contact.email}
                      </a>
                    </div>
                  </div>
                )}

                {place.contact?.website && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                    <FaGlobe size={16} color="#2563eb" style={{ marginTop: '3px', flexShrink: 0 }} />
                    <div>
                      <span style={{ fontWeight: 700, display: 'block', color: '#0f172a' }}>Website</span>
                      <a
                        href={place.contact.website.startsWith('http') ? place.contact.website : `https://${place.contact.website}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: '#2563eb', wordBreak: 'break-all' }}
                      >
                        Visit Official Site &rarr;
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Get Directions Link to Google Maps */}
              <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid #f1f5f9' }}>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place.name} ${place.address} ${place.city}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <FaMapMarkerAlt /> Open in Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      <ReportModal
        place={place}
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSuccess={() => setAlert({ type: 'success', message: 'Report submitted! Thank you for helping keep AccessAble accurate.' })}
      />

      <style>{`
        @media (max-width: 900px) {
          .details-grid-container {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PlaceDetailsPage;
