import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MdFilterList,
  MdCheckCircle,
  MdOutlineClear,
  MdSearch,
} from 'react-icons/md';
import { FaShieldAlt, FaSlidersH, FaArrowRight } from 'react-icons/fa';
import api from '../services/api';
import PlaceCard from '../components/common/PlaceCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { FEATURE_CONFIG } from '../components/common/AccessibilityBadges';

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

const FilterPage = () => {
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [minRating, setMinRating] = useState(0);
  const [city, setCity] = useState('');
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const fetchFilteredPlaces = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedFeatures.length > 0) params.append('features', selectedFeatures.join(','));
      if (selectedCategory && selectedCategory !== 'All') params.append('category', selectedCategory);
      if (minRating > 0) params.append('minRating', minRating.toString());
      if (city.trim()) params.append('city', city.trim());
      params.append('limit', '20');

      const response = await api.get(`/places?${params.toString()}`);
      if (response.data.success) {
        setPlaces(response.data.places);
        setTotalCount(response.data.total);
      }
    } catch (err) {
      console.error('Filter query error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredPlaces();
  }, [selectedFeatures, selectedCategory, minRating, city]);

  const toggleFeature = (feature) => {
    setSelectedFeatures((prev) =>
      prev.includes(feature) ? prev.filter((f) => f !== feature) : [...prev, feature]
    );
  };

  const selectAllFeatures = () => {
    setSelectedFeatures([...ALL_11_FEATURES]);
  };

  const clearAllFilters = () => {
    setSelectedFeatures([]);
    setSelectedCategory('All');
    setMinRating(0);
    setCity('');
  };

  return (
    <div className="filter-page section" style={{ backgroundColor: '#f8fafc', minHeight: '85vh' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 2.5rem auto' }}>
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
              marginBottom: '0.75rem',
            }}
          >
            <FaShieldAlt size={14} /> Multi-Criteria Accessibility Matrix
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>
            Accessibility Feature Filter
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#64748b', lineHeight: 1.6 }}>
            Select the exact combination of physical, sensory, and communicative accessibility
            accommodations you require. Our engine matches locations fulfilling all selected criteria.
          </p>
        </div>

        {/* 11 Accessibility Checkpoints Grid */}
        <div
          className="card"
          style={{
            padding: '2rem',
            marginBottom: '2rem',
            backgroundColor: '#ffffff',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
              gap: '1rem',
              borderBottom: '1px solid #f1f5f9',
              paddingBottom: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MdFilterList size={22} color="#2563eb" />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                11 Universal Accessibility Checkpoints
              </h2>
            </div>

            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <button
                type="button"
                onClick={selectAllFeatures}
                className="btn btn-outline-primary btn-sm"
              >
                Select All 11
              </button>
              {selectedFeatures.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedFeatures([])}
                  className="btn btn-outline btn-sm"
                  style={{ color: '#dc2626' }}
                >
                  <MdOutlineClear /> Deselect All
                </button>
              )}
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '1rem',
            }}
          >
            {ALL_11_FEATURES.map((feature) => {
              const config = FEATURE_CONFIG[feature];
              const IconComp = config?.icon || MdCheckCircle;
              const isSelected = selectedFeatures.includes(feature);

              return (
                <div
                  key={feature}
                  onClick={() => toggleFeature(feature)}
                  style={{
                    padding: '1rem',
                    borderRadius: '12px',
                    border: '2px solid',
                    borderColor: isSelected ? '#2563eb' : '#e2e8f0',
                    backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 4px 12px rgba(37, 99, 235, 0.12)' : 'none',
                  }}
                  role="checkbox"
                  aria-checked={isSelected}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === ' ' || e.key === 'Enter') {
                      e.preventDefault();
                      toggleFeature(feature);
                    }
                  }}
                >
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      backgroundColor: isSelected ? '#2563eb' : config?.bgColor || '#f1f5f9',
                      color: isSelected ? '#ffffff' : config?.color || '#475569',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <IconComp size={18} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem', color: isSelected ? '#1d4ed8' : '#1e293b' }}>
                        {feature}
                      </span>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        style={{ width: '16px', height: '16px', accentColor: '#2563eb' }}
                      />
                    </div>
                    <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0.25rem 0 0 0', lineHeight: 1.35 }}>
                      {config?.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Secondary Parameters Bar (Category, Min Rating, City) */}
        <div
          className="card"
          style={{
            padding: '1.25rem 1.75rem',
            marginBottom: '2.5rem',
            backgroundColor: '#ffffff',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '1.25rem',
          }}
        >
          {/* Category */}
          <div style={{ flex: '1 1 200px' }}>
            <label className="form-label" style={{ fontSize: '0.85rem', marginBottom: '0.35rem' }}>
              Category
            </label>
            <select
              className="form-control"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ padding: '0.55rem 0.85rem' }}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? 'All Categories' : c}
                </option>
              ))}
            </select>
          </div>

          {/* Minimum Rating */}
          <div style={{ flex: '1 1 200px' }}>
            <label className="form-label" style={{ fontSize: '0.85rem', marginBottom: '0.35rem' }}>
              Minimum Rating
            </label>
            <select
              className="form-control"
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              style={{ padding: '0.55rem 0.85rem' }}
            >
              <option value="0">Any Rating</option>
              <option value="3">3+ Stars</option>
              <option value="4">4+ Stars</option>
              <option value="4.5">4.5+ Stars (Top Rated)</option>
            </select>
          </div>

          {/* City / Location */}
          <div style={{ flex: '1 1 200px' }}>
            <label className="form-label" style={{ fontSize: '0.85rem', marginBottom: '0.35rem' }}>
              City / Metro Area
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. New York, Brooklyn"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              style={{ padding: '0.55rem 0.85rem' }}
            />
          </div>

          {/* Reset button */}
          <div style={{ alignSelf: 'flex-end', paddingBottom: '2px' }}>
            <button
              type="button"
              onClick={clearAllFilters}
              className="btn btn-outline btn-sm"
              style={{ padding: '0.65rem 1rem' }}
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Results Showcase Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Matching Barrier-Free Locations ({totalCount})
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.88rem', margin: '0.2rem 0 0 0' }}>
              {selectedFeatures.length === 0
                ? 'Showing all accessible places.'
                : `Filtered by ${selectedFeatures.length} accessibility checkpoints.`}
            </p>
          </div>

          <Link to="/places" className="btn btn-outline-primary btn-sm">
            Explore All View &rarr;
          </Link>
        </div>

        {/* Results Content */}
        {loading ? (
          <LoadingSpinner message="Filtering places matching your accessibility criteria..." />
        ) : places.length === 0 ? (
          <div
            className="card"
            style={{
              padding: '3.5rem 1.5rem',
              textAlign: 'center',
            }}
          >
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              No Exact Matches Found
            </h3>
            <p style={{ color: '#64748b', maxWidth: '450px', margin: '0 auto 1.5rem auto' }}>
              No places currently fulfill all {selectedFeatures.length} selected accessibility
              criteria simultaneously in this category or city.
            </p>
            <button onClick={clearAllFilters} className="btn btn-primary">
              Clear Criteria & View All
            </button>
          </div>
        ) : (
          <div className="places-grid">
            {places.map((place) => (
              <PlaceCard key={place._id} place={place} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterPage;
