import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [isSystemTheme, setIsSystemTheme] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')?.matches ? 'dark' : 'light';
    
    if (savedTheme) {
      setTheme(savedTheme);
      setIsSystemTheme(savedTheme === 'system');
    } else {
      setTheme(systemTheme);
    }
  }, []);

  useEffect(() => {
    const root = window.document?.documentElement;
    
    // Remove existing theme classes
    root.classList?.remove('light', 'dark');
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')?.matches ? 'dark' : 'light';
      root.classList?.add(systemTheme);
    } else {
      root.classList?.add(theme);
    }

    // Update CSS custom properties based on theme
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)')?.matches)) {
      root.style?.setProperty('--theme-mode', 'dark');
    } else {
      root.style?.setProperty('--theme-mode', 'light');
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    setIsSystemTheme(false);
    localStorage.setItem('theme', newTheme);
  };

  const setSystemTheme = () => {
    setTheme('system');
    setIsSystemTheme(true);
    localStorage.setItem('theme', 'system');
  };

  const getCurrentTheme = () => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)')?.matches ? 'dark' : 'light';
    }
    return theme;
  };

  const value = {
    theme,
    currentTheme: getCurrentTheme(),
    isSystemTheme,
    toggleTheme,
    setTheme: (newTheme) => {
      setTheme(newTheme);
      setIsSystemTheme(newTheme === 'system');
      localStorage.setItem('theme', newTheme);
    },
    setSystemTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;