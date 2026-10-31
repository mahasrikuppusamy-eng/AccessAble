import React from 'react';
import {
  FaWheelchair,
  FaAccessibleIcon,
  FaParking,
  FaRestroom,
  FaBraille,
  FaSignLanguage,
  FaAssistiveListeningSystems,
} from 'react-icons/fa';
import {
  MdElevator,
  MdVolumeUp,
  MdVisibility,
  MdDoorFront,
  MdCheckCircle,
  MdCancel,
} from 'react-icons/md';

export const FEATURE_CONFIG = {
  'Wheelchair Accessible': {
    icon: FaWheelchair,
    color: '#2563eb',
    bgColor: '#eff6ff',
    desc: 'Barrier-free flat pathways, wide corridors, and standard wheelchair turn radius.',
  },
  'Wheelchair Ramps': {
    icon: FaAccessibleIcon,
    color: '#059669',
    bgColor: '#ecfdf5',
    desc: 'ADA-compliant gentle slope ramps with secure dual handrails.',
  },
  'Accessible Parking': {
    icon: FaParking,
    color: '#4f46e5',
    bgColor: '#eef2ff',
    desc: 'Extra-wide designated parking spots with direct covered ramp access.',
  },
  'Accessible Restrooms': {
    icon: FaRestroom,
    color: '#7c3aed',
    bgColor: '#f5f3ff',
    desc: 'Spacious barrier-free stalls with sturdy grab bars and lowered basins.',
  },
  'Elevator Availability': {
    icon: MdElevator,
    color: '#0891b2',
    bgColor: '#ecfeff',
    desc: 'Spacious passenger elevators with tactile buttons and audio announcements.',
  },
  'Braille Signage': {
    icon: FaBraille,
    color: '#d97706',
    bgColor: '#fffbeb',
    desc: 'Raised tactile lettering and Grade 2 Braille on all doors and maps.',
  },
  'Audio Assistance': {
    icon: MdVolumeUp,
    color: '#2563eb',
    bgColor: '#eff6ff',
    desc: 'Audible guides, talking navigation beacons, and acoustic support.',
  },
  'Visual Assistance': {
    icon: MdVisibility,
    color: '#9333ea',
    bgColor: '#faf5ff',
    desc: 'High-contrast directional signage, bright uniform lighting, tactile pathways.',
  },
  'Sign Language Support': {
    icon: FaSignLanguage,
    color: '#059669',
    bgColor: '#ecfdf5',
    desc: 'Staff trained in American Sign Language (ASL) or on-demand video relay.',
  },
  'Accessible Entrance': {
    icon: MdDoorFront,
    color: '#2563eb',
    bgColor: '#eff6ff',
    desc: 'Zero-step entrance with automatic sliding doors or push-button access.',
  },
  'Hearing Assistance': {
    icon: FaAssistiveListeningSystems,
    color: '#dc2626',
    bgColor: '#fef2f2',
    desc: 'Induction hearing loop systems and assistive audio listening devices.',
  },
};

export const AccessibilityBadge = ({ feature, verified = true, compact = false }) => {
  const config = FEATURE_CONFIG[feature] || {
    icon: MdCheckCircle,
    color: '#475569',
    bgColor: '#f1f5f9',
    desc: feature,
  };

  const IconComponent = config.icon;

  if (compact) {
    return (
      <span
        title={`${feature}: ${config.desc}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.35rem',
          padding: '0.25rem 0.55rem',
          backgroundColor: verified ? config.bgColor : '#f8fafc',
          color: verified ? config.color : '#94a3b8',
          borderRadius: '6px',
          fontSize: '0.75rem',
          fontWeight: 600,
          border: `1px solid ${verified ? config.color + '33' : '#e2e8f0'}`,
        }}
      >
        <IconComponent size={13} />
        <span>{feature}</span>
      </span>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        padding: '0.85rem 1rem',
        borderRadius: '12px',
        backgroundColor: verified ? '#ffffff' : '#f8fafc',
        border: `1px solid ${verified ? config.color + '44' : '#e2e8f0'}`,
        boxShadow: verified ? '0 2px 6px rgba(0,0,0,0.03)' : 'none',
      }}
    >
      <div
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          backgroundColor: verified ? config.bgColor : '#e2e8f0',
          color: verified ? config.color : '#94a3b8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <IconComponent size={18} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <h4 style={{ fontSize: '0.92rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
            {feature}
          </h4>
          {verified ? (
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                color: '#059669',
                backgroundColor: '#ecfdf5',
                padding: '0.1rem 0.4rem',
                borderRadius: '4px',
              }}
            >
              Verified
            </span>
          ) : (
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 600,
                color: '#94a3b8',
                backgroundColor: '#f1f5f9',
                padding: '0.1rem 0.4rem',
                borderRadius: '4px',
              }}
            >
              Not Available
            </span>
          )}
        </div>
        <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0.2rem 0 0 0', lineHeight: 1.4 }}>
          {config.desc}
        </p>
      </div>
    </div>
  );
};

export default AccessibilityBadge;
