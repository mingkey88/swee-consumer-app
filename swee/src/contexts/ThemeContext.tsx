'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (darkMode: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkModeState] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize dark mode from localStorage and system preference
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedDarkMode !== null) {
      setDarkModeState(savedDarkMode === 'true');
    } else {
      setDarkModeState(prefersDark);
    }
    setIsInitialized(true);
  }, []);

  // Apply dark mode to document
  useEffect(() => {
    if (!isInitialized) return;
    
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode, isInitialized]);

  const toggleDarkMode = () => {
    setDarkModeState(!darkMode);
  };

  const setDarkMode = (newDarkMode: boolean) => {
    setDarkModeState(newDarkMode);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
