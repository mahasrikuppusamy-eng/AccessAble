import React, { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext();

export const AccessibilityProvider = ({ children }) => {
  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem('accessable_fontSize') || 'normal';
  });

  const [highContrast, setHighContrast] = useState(() => {
    return localStorage.getItem('accessable_highContrast') === 'true';
  });

  const [dyslexicFont, setDyslexicFont] = useState(() => {
    return localStorage.getItem('accessable_dyslexicFont') === 'true';
  });

  const [highlightLinks, setHighlightLinks] = useState(() => {
    return localStorage.getItem('accessable_highlightLinks') === 'true';
  });

  const [reducedMotion, setReducedMotion] = useState(() => {
    return localStorage.getItem('accessable_reducedMotion') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('accessable_fontSize', fontSize);
    const root = document.documentElement;
    root.classList.remove('font-normal', 'font-large', 'font-xlarge');
    root.classList.add(`font-${fontSize}`);
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('accessable_highContrast', highContrast);
    if (highContrast) {
      document.body.classList.add('high-contrast-mode');
    } else {
      document.body.classList.remove('high-contrast-mode');
    }
  }, [highContrast]);

  useEffect(() => {
    localStorage.setItem('accessable_dyslexicFont', dyslexicFont);
    if (dyslexicFont) {
      document.body.classList.add('dyslexic-font-mode');
    } else {
      document.body.classList.remove('dyslexic-font-mode');
    }
  }, [dyslexicFont]);

  useEffect(() => {
    localStorage.setItem('accessable_highlightLinks', highlightLinks);
    if (highlightLinks) {
      document.body.classList.add('highlight-links-mode');
    } else {
      document.body.classList.remove('highlight-links-mode');
    }
  }, [highlightLinks]);

  useEffect(() => {
    localStorage.setItem('accessable_reducedMotion', reducedMotion);
    if (reducedMotion) {
      document.body.classList.add('reduced-motion-mode');
    } else {
      document.body.classList.remove('reduced-motion-mode');
    }
  }, [reducedMotion]);

  const resetAccessibilitySettings = () => {
    setFontSize('normal');
    setHighContrast(false);
    setDyslexicFont(false);
    setHighlightLinks(false);
    setReducedMotion(false);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        fontSize,
        setFontSize,
        highContrast,
        setHighContrast,
        dyslexicFont,
        setDyslexicFont,
        highlightLinks,
        setHighlightLinks,
        reducedMotion,
        setReducedMotion,
        resetAccessibilitySettings,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
