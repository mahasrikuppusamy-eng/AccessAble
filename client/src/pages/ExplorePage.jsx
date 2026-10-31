import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  FaSearch,
  FaFilter,
  FaMapMarkedAlt,
  FaThLarge,
  FaMapMarkerAlt,
  FaTimes,
  FaSortAmountDown,
  FaAngleLeft,
  FaAngleRight,
} from 'react-icons/fa';
import api from '../services/api';
import PlaceCard from '../components/common/PlaceCard';
import LeafletMap from '../components/common/LeafletMap';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ALL_ACCESSIBILITY_FEATURES = [
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

const CATEGORIES = [
  'All',
  'Hospital',
  'Restaurant',
  'Hotel',
  'Park',
  'Shopping Mall',
  'Cultural / Museum',
  'Transit / Station',
  'Educational Institution',
  'Library',
  'Sports & Entertainment',
  'Other',
];

const ExplorePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedFeatures, setSelectedFeatures] = useState(() => {
    const feat = searchParams.get('features');
    return feat ? feat.split(',').map((f) => f.trim()) : [];
  });
  const [cityQuery, setCityQuery] = useState(searchParams.get('city') || '');
  const [sortOption, setSortOption] = useState(searchParams.get('sort') || 'rating_desc');
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);

  const [places, setPlaces] = useState([]);
  const [totalPlaces, setTotalPlaces] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'split'
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  // Sync state to URL search parameters
  const updateQueryParams = (newPage = 1) => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('search', searchQuery.trim());
    if (selectedCategory && selectedCategory !== 'All') params.set('category', selectedCategory);
    if (selectedFeatures.length > 0) params.set('features', selectedFeatures.join(','));
    if (cityQuery.trim()) params.set('city', cityQuery.trim());
    if (sortOption) params.set('sort', sortOption);
    params.set('page', newPage.toString());

    setSearchParams(params);
    setCurrentPage(newPage);
  };

  // Fetch places from API
  useEffect(() => {
    const fetchPlaces = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (searchParams.get('search')) query.append('search', searchParams.get('search'));
        if (searchParams.get('category')) query.append('category', searchParams.get('category'));
        if (searchParams.get('features')) query.append('features', searchParams.get('features'));
        if (searchParams.get('city')) query.append('city', searchParams.get('city'));
        if (searchParams.get('sort')) query.append('sort', searchParams.get('sort'));
        query.append('page', searchParams.get('page') || '1');
        query.append('limit', '9');

        const response = await api.get(`/places?${query.toString()}`);
        if (response.data.success) {
          setPlaces(response.data.places);
          setTotalPlaces(response.data.total);
          setTotalPages(response.data.totalPages);
        }
      } catch (err) {
        console.error('Failed to fetch places:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [searchParams]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateQueryParams(1);
  };

  const handleFeatureToggle = (feature) => {
    const updated = selectedFeatures.includes(feature)
      ? selectedFeatures.filter((f) => f !== feature)
      : [...selectedFeatures, feature];
    setSelectedFeatures(updated);
  };

  const applyFilters = () => {
    updateQueryParams(1);
    setShowFilterDrawer(false);
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedFeatures([]);
    setCityQuery('');
    setSortOption('rating_desc');
    setSearchParams(new URLSearchParams());
    setCurrentPage(1);
  };

  const activeFiltersCount =
    (selectedCategory !== 'All' ? 1 : 0) +
    selectedFeatures.length +
    (cityQuery.trim() ? 1 : 0);

  return (
    <div className="explore-page section" style={{ backgroundColor: '#f8fafc', minHeight: '80vh' }}>
      <div className="container">
        {/* Header Title & Subtitle */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
            Discover Accessible Places
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.05rem', margin: 0 }}>
            Browse vetted places with confirmed wheelchair ramps, elevators, restrooms, and sensory guides.
          </p>
        </div>

        {/* Search & Top Action Bar */}
        <div
          style={{
            backgroundColor: '#ffffff',
            padding: '1.25rem',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
            marginBottom: '1.75rem',
          }}
        >
          <form
            onSubmit={handleSearchSubmit}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem',
              alignItems: 'center',
            }}
          >
            {/* Search Input */}
            <div
              style={{
                flex: '2 1 240px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.65rem 0.85rem',
                backgroundColor: '#f8fafc',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
              }}
            >
              <FaSearch color="#64748b" />
              <input
                type="text"
                placeholder="Search by place name, street or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  width: '100%',
                  fontSize: '0.92rem',
                }}
                aria-label="Search places"
              />
            </div>

            {/* City Input */}
            <div
              style={{
                flex: '1 1 150px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 0.85rem',
                backgroundColor: '#f8fafc',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
              }}
            >
              <FaMapMarkerAlt color="#64748b" />
              <input
                type="text"
                placeholder="City (e.g. New York)"
                value={cityQuery}
                onChange={(e) => setCityQuery(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  width: '100%',
                  fontSize: '0.92rem',
                }}
                aria-label="Filter by city"
              />
            </div>

            {/* Category Dropdown */}
            <div style={{ flex: '1 1 150px' }}>
              <select
                className="form-control"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{ padding: '0.65rem 0.85rem', borderRadius: '10px' }}
                aria-label="Category selector"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'All' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div style={{ flex: '1 1 150px' }}>
              <select
                className="form-control"
                value={sortOption}
                onChange={(e) => {
                  setSortOption(e.target.value);
                  setTimeout(() => updateQueryParams(1), 0);
                }}
                style={{ padding: '0.65rem 0.85rem', borderRadius: '10px' }}
                aria-label="Sort places"
              >
                <option value="rating_desc">Highest Rated</option>
                <option value="reviews">Most Reviewed</option>
                <option value="newest">Newest Listed</option>
                <option value="name_asc">Name: A to Z</option>
              </select>
            </div>

            {/* Search Submit Button */}
            <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '0.7rem 1.4rem' }}>
              <FaSearch size={14} /> Search
            </button>

            {/* Filter Toggle Button for mobile/feature matrix */}
            <button
              type="button"
              onClick={() => setShowFilterDrawer(!showFilterDrawer)}
              className="btn btn-outline btn-sm"
              style={{
                padding: '0.7rem 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <FaFilter size={13} color="#2563eb" />
              <span>Features ({selectedFeatures.length})</span>
            </button>
          </form>

          {/* Collapsible Accessibility Features Selection Box */}
          {showFilterDrawer && (
            <div
              style={{
                marginTop: '1.25rem',
                paddingTop: '1.25rem',
                borderTop: '1px solid #e2e8f0',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                  Filter by Specific Accessibility Features:
                </h4>
                {selectedFeatures.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedFeatures([])}
                    style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: '0.82rem', cursor: 'pointer', fontWeight: 600 }}
                  >
                    Clear Selected Features
                  </button>
                )}
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '0.6rem',
                  marginBottom: '1rem',
                }}
              >
                {ALL_ACCESSIBILITY_FEATURES.map((feature) => {
                  const isChecked = selectedFeatures.includes(feature);
                  return (
                    <label
                      key={feature}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.85rem',
                        color: isChecked ? '#1d4ed8' : '#334155',
                        fontWeight: isChecked ? 600 : 500,
                        backgroundColor: isChecked ? '#eff6ff' : '#f8fafc',
                        padding: '0.45rem 0.65rem',
                        borderRadius: '8px',
                        border: `1px solid ${isChecked ? '#93c5fd' : '#e2e8f0'}`,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleFeatureToggle(feature)}
                        style={{ width: '16px', height: '16px', accentColor: '#2563eb' }}
                      />
                      <span>{feature}</span>
                    </label>
                  );
                })}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem' }}>
                <button
                  type="button"
                  onClick={() => setShowFilterDrawer(false)}
                  className="btn btn-outline btn-sm"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={applyFilters}
                  className="btn btn-primary btn-sm"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Active Filters Bar & View Switcher */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.92rem', fontWeight: 600, color: '#475569' }}>
              Showing {places.length} of {totalPlaces} accessible places
            </span>

            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={resetAllFilters}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#dc2626',
                  backgroundColor: '#fee2e2',
                  border: 'none',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                }}
              >
                <FaTimes size={12} /> Clear all filters
              </button>
            )}
          </div>

          {/* View Mode Toggle: Grid or Map Split */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '10px',
              overflow: 'hidden',
              padding: '2px',
            }}
          >
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.4rem 0.75rem',
                border: 'none',
                backgroundColor: viewMode === 'grid' ? '#eff6ff' : 'transparent',
                color: viewMode === 'grid' ? '#1d4ed8' : '#64748b',
                fontWeight: viewMode === 'grid' ? 700 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                borderRadius: '8px',
              }}
            >
              <FaThLarge size={14} /> Grid
            </button>
            <button
              type="button"
              onClick={() => setViewMode('split')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.4rem 0.75rem',
                border: 'none',
                backgroundColor: viewMode === 'split' ? '#eff6ff' : 'transparent',
                color: viewMode === 'split' ? '#1d4ed8' : '#64748b',
                fontWeight: viewMode === 'split' ? 700 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                borderRadius: '8px',
              }}
            >
              <FaMapMarkedAlt size={14} /> Map & List
            </button>
          </div>
        </div>

        {/* Content Layout */}
        {loading ? (
          <LoadingSpinner message="Searching verified barrier-free locations..." />
        ) : places.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '4rem 1.5rem',
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto',
              }}
            >
              <FaSearch size={28} />
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              No Accessible Places Found
            </h3>
            <p style={{ color: '#64748b', maxWidth: '480px', margin: '0 auto 1.5rem auto' }}>
              We could not find any locations matching your exact search criteria.
              Try clearing some accessibility filters or broadening your search keywords.
            </p>
            <button onClick={resetAllFilters} className="btn btn-primary">
              Clear All Filters
            </button>
          </div>
        ) : viewMode === 'split' ? (
          /* Split View: Map on Right/Top, Cards on Left */
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(320px, 1fr) minmax(320px, 1fr)',
              gap: '1.75rem',
              alignItems: 'start',
            }}
            className="split-view-container"
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {places.map((place) => (
                <PlaceCard key={place._id} place={place} />
              ))}
            </div>

            <div style={{ position: 'sticky', top: '90px' }}>
              <div style={{ marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.88rem', color: '#475569' }}>
                📍 Interactive Discovery Map (Click pins for details)
              </div>
              <LeafletMap places={places} height="580px" />
            </div>
          </div>
        ) : (
          /* Grid View */
          <div className="places-grid">
            {places.map((place) => (
              <PlaceCard key={place._id} place={place} />
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.5rem',
              marginTop: '3.5rem',
            }}
          >
            <button
              onClick={() => updateQueryParams(currentPage - 1)}
              disabled={currentPage <= 1}
              className="btn btn-outline btn-sm"
              aria-label="Previous Page"
              style={{ opacity: currentPage <= 1 ? 0.5 : 1 }}
            >
              <FaAngleLeft /> Prev
            </button>

            {[...Array(totalPages)].map((_, i) => {
              const pageNumber = i + 1;
              const isActive = pageNumber === currentPage;
              return (
                <button
                  key={pageNumber}
                  onClick={() => updateQueryParams(pageNumber)}
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: isActive ? '#2563eb' : '#cbd5e1',
                    backgroundColor: isActive ? '#2563eb' : '#ffffff',
                    color: isActive ? '#ffffff' : '#334155',
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer',
                  }}
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              onClick={() => updateQueryParams(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="btn btn-outline btn-sm"
              aria-label="Next Page"
              style={{ opacity: currentPage >= totalPages ? 0.5 : 1 }}
            >
              Next <FaAngleRight />
            </button>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .split-view-container {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ExplorePage;
