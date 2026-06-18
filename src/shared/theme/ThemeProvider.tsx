import React, { useState, useEffect } from 'react';
import { Theme } from './theme.types';
import { ThemeContext } from './ThemeContext';

const THEME_STORAGE_KEY = 'auctionmart-theme';

const getSystemTheme = () =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system') {
      return savedTheme;
    }
    
    return 'system';
  });

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
  };

  useEffect(() => {
    const applyTheme = () => {
      const root = window.document.documentElement;
      const resolvedTheme = theme === 'system' ? getSystemTheme() : theme;
    
      root.classList.remove('light', 'dark');
    
      if (resolvedTheme === 'dark') {
        root.classList.add('dark');
      }
    
      document.body.classList.add('transition-colors', 'duration-300');
    };

    applyTheme();

    if (theme !== 'system') return;

    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
    systemTheme.addEventListener('change', applyTheme);

    return () => {
      systemTheme.removeEventListener('change', applyTheme);
    };
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
