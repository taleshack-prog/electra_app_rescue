import React, { createContext, useContext } from 'react';
import { colors, fontFamily, fontSize, spacing, radius, shadows, dimensions, duration } from './tokens';

const theme = { colors, fontFamily, fontSize, spacing, radius, shadows, dimensions, duration } as const;
export type Theme = typeof theme;

const ThemeContext = createContext<Theme>(theme);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
);

export const useTheme = (): Theme => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};

export default theme;
