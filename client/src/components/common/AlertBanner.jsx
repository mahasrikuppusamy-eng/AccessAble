import React from 'react';
import {
  MdCheckCircle,
  MdError,
  MdWarning,
  MdInfo,
  MdClose,
} from 'react-icons/md';

const AlertBanner = ({ type = 'info', message, onClose }) => {
  if (!message) return null;

  const styles = {
    success: {
      bg: '#ecfdf5',
      border: '#a7f3d0',
      color: '#065f46',
      icon: MdCheckCircle,
    },
    error: {
      bg: '#fef2f2',
      border: '#fecaca',
      color: '#991b1b',
      icon: MdError,
    },
    warning: {
      bg: '#fffbeb',
      border: '#fde68a',
      color: '#92400e',
      icon: MdWarning,
    },
    info: {
      bg: '#eff6ff',
      border: '#bfdbfe',
      color: '#1e40af',
      icon: MdInfo,
    },
  }[type] || {
    bg: '#eff6ff',
    border: '#bfdbfe',
    color: '#1e40af',
    icon: MdInfo,
  };

  const IconComponent = styles.icon;

  return (
    <div
      role="alert"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.85rem 1.25rem',
        borderRadius: '12px',
        backgroundColor: styles.bg,
        border: `1px solid ${styles.border}`,
        color: styles.color,
        marginBottom: '1.25rem',
        fontSize: '0.92rem',
        fontWeight: 500,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        <IconComponent size={20} style={{ flexShrink: 0 }} />
        <span>{message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          aria-label="Dismiss alert"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'inherit',
            display: 'flex',
            padding: '2px',
            opacity: 0.8,
          }}
        >
          <MdClose size={18} />
        </button>
      )}
    </div>
  );
};

export default AlertBanner;
