import React, { useState, useEffect } from 'react';
import { Theme } from './theme.types';
import { ThemeContext } from './ThemeContext';

const THEME_STORAGE_KEY = 'auctionmart-theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    // 1. Check local storage
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    
    // 2. Default to light
    return 'light';
  });

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
  };

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove both classes to prevent conflicts
    root.classList.remove('light', 'dark');
    
    // Add the current theme class
    if (theme === 'dark') {
      root.classList.add('dark');
    }
    
    // Add a transition class to body for smooth color transitions
    document.body.classList.add('transition-colors', 'duration-300');
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
