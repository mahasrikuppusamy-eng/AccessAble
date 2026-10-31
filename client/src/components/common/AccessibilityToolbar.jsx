import React, { useState } from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';
import {
  MdAccessibility,
  MdFormatSize,
  MdContrast,
  MdLink,
  MdClose,
  MdRefresh,
} from 'react-icons/md';
import { FaFont } from 'react-icons/fa';

const AccessibilityToolbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    fontSize,
    setFontSize,
    highContrast,
    setHighContrast,
    dyslexicFont,
    setDyslexicFont,
    highlightLinks,
    setHighlightLinks,
    resetAccessibilitySettings,
  } = useAccessibility();

  return (
    <>
      {/* Floating Accessibility Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open Accessibility Preferences Menu"
        aria-expanded={isOpen}
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '24px',
          zIndex: 999,
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          backgroundColor: '#2563eb',
          color: '#ffffff',
          border: '3px solid #ffffff',
          boxShadow: '0 4px 20px rgba(37, 99, 235, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <MdAccessibility size={28} />
      </button>

      {/* Accessibility Preferences Panel */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Accessibility Settings"
          style={{
            position: 'fixed',
            bottom: '86px',
            left: '24px',
            zIndex: 999,
            width: '320px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.18)',
            border: '1px solid #e2e8f0',
            padding: '1.25rem',
            animation: 'modalEnter 0.2s ease',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem',
              borderBottom: '1px solid #f1f5f9',
              paddingBottom: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MdAccessibility size={22} color="#2563eb" />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>
                Accessibility Controls
              </h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close Accessibility Menu"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#64748b',
                display: 'flex',
              }}
            >
              <MdClose size={20} />
            </button>
          </div>

          {/* Font Size Adjuster */}
          <div style={{ marginBottom: '1.2rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#334155',
                marginBottom: '0.5rem',
              }}
            >
              <MdFormatSize size={18} />
              <span>Text Size</span>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '0.35rem',
              }}
            >
              {['normal', 'large', 'xlarge'].map((size) => (
                <button
                  key={size}
                  onClick={() => setFontSize(size)}
                  style={{
                    padding: '0.45rem',
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: fontSize === size ? '#2563eb' : '#cbd5e1',
                    backgroundColor: fontSize === size ? '#eff6ff' : '#ffffff',
                    color: fontSize === size ? '#1d4ed8' : '#475569',
                    fontWeight: fontSize === size ? 700 : 500,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                  }}
                >
                  {size === 'xlarge' ? 'X-Large' : size}
                </button>
              ))}
            </div>
          </div>

          {/* High Contrast Toggle */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.9rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#334155',
              }}
            >
              <MdContrast size={18} />
              <span>High Contrast</span>
            </div>
            <input
              type="checkbox"
              id="highContrastToggle"
              checked={highContrast}
              onChange={(e) => setHighContrast(e.target.checked)}
              aria-label="Toggle High Contrast Mode"
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
          </div>

          {/* Dyslexia Friendly Font Toggle */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.9rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#334155',
              }}
            >
              <FaFont size={16} />
              <span>Dyslexia Font</span>
            </div>
            <input
              type="checkbox"
              id="dyslexiaFontToggle"
              checked={dyslexicFont}
              onChange={(e) => setDyslexicFont(e.target.checked)}
              aria-label="Toggle Dyslexia Friendly Typography"
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
          </div>

          {/* Highlight Links Toggle */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.2rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#334155',
              }}
            >
              <MdLink size={18} />
              <span>Underline Links</span>
            </div>
            <input
              type="checkbox"
              id="highlightLinksToggle"
              checked={highlightLinks}
              onChange={(e) => setHighlightLinks(e.target.checked)}
              aria-label="Toggle Link Highlights"
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
          </div>

          {/* Reset Settings */}
          <button
            onClick={resetAccessibilitySettings}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              padding: '0.55rem',
              backgroundColor: '#f1f5f9',
              color: '#475569',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <MdRefresh size={16} />
            Reset to Default
          </button>
        </div>
      )}
    </>
  );
};

export default AccessibilityToolbar;
