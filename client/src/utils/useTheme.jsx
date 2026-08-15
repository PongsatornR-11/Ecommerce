import { useState, useEffect } from 'react';

const THEME_CHANGE_EVENT = 'app-theme-change';

export const useTheme = () => {
  const [theme, setThemeState] = useState(
    () => localStorage.getItem('theme') || 'system'
  );

  const setTheme = (newTheme) => {
    localStorage.setItem('theme', newTheme);
    setThemeState(newTheme);
    // Dispatch event to sync other instances of useTheme reactively
    window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail: newTheme }));
  };

  useEffect(() => {
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = (currentTheme) => {
      const activeTheme = currentTheme || theme;
      if (activeTheme === 'system') {
        if (mediaQuery.matches) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      } else if (activeTheme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    // Apply the theme initially
    applyTheme();

    // Handler to sync theme state from other instances
    const handleSync = (e) => {
      const newTheme = e.detail;
      setThemeState(newTheme);
      applyTheme(newTheme);
    };

    window.addEventListener(THEME_CHANGE_EVENT, handleSync);

    // Handler for system color scheme changes
    const handleSystemChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);

    return () => {
      window.removeEventListener(THEME_CHANGE_EVENT, handleSync);
      mediaQuery.removeEventListener('change', handleSystemChange);
    };
  }, [theme]);

  return [theme, setTheme];
};
