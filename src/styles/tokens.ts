/**
 * Centralized Design Tokens
 * Single source of truth for spacing, typography, colors, radius, shadows, transitions, icons, container widths.
 */

export const spacing = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  14: '56px',
  16: '64px',
  20: '80px',
  24: '96px',
  32: '128px',
} as const;

export const containerWidths = {
  xs: '320px',
  sm: '414px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1440px',
  content: '896px',
  narrow: '640px',
  wide: '1280px',
} as const;

export const fontSize = {
  '2xs': { size: '0.625rem', lineHeight: '0.875rem' },
  xs: { size: '0.75rem', lineHeight: '1rem' },
  sm: { size: '0.875rem', lineHeight: '1.25rem' },
  base: { size: '1rem', lineHeight: '1.5rem' },
  lg: { size: '1.125rem', lineHeight: '1.75rem' },
  xl: { size: '1.25rem', lineHeight: '1.75rem' },
  '2xl': { size: '1.5rem', lineHeight: '2rem' },
  '3xl': { size: '1.875rem', lineHeight: '2.25rem' },
  '4xl': { size: '2.25rem', lineHeight: '2.5rem' },
  '5xl': { size: '3rem', lineHeight: '1' },
  '6xl': { size: '3.75rem', lineHeight: '1' },
} as const;

export const fontWeight = {
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
} as const;

export const colors = {
  primary: {
    50: '#F0F7FF',
    100: '#DBEBFF',
    200: '#BFDCFF',
    300: '#93C6FF',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#1E6FBF',
    700: '#1C5BA0',
    800: '#1B4D82',
    900: '#1A4269',
  DEFAULT: '#1E6FBF',
    foreground: '#FFFFFF',
  },
  secondary: {
    50: '#FFF7ED',
    100: '#FFEDD5',
    200: '#FED7AA',
    300: '#FDBA74',
    400: '#FB923C',
    500: '#F97316',
    600: '#EA580C',
    700: '#C2410C',
    800: '#9A3412',
    900: '#7C2D12',
    DEFAULT: '#F97316',
    foreground: '#FFFFFF',
  },
  neutral: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },
  success: {
    DEFAULT: '#2D9D5A',
    foreground: '#FFFFFF',
    50: '#ECFDF5',
    500: '#2D9D5A',
    600: '#23804A',
  },
  warning: {
    DEFAULT: '#F59E0B',
    foreground: '#3A2A06',
    50: '#FFFBEB',
    500: '#F59E0B',
    600: '#D97706',
  },
  error: {
    DEFAULT: '#DC2626',
    foreground: '#FFFFFF',
    50: '#FEF2F2',
    500: '#DC2626',
    600: '#B91C1C',
  },
  info: {
    DEFAULT: '#0EA5E9',
    foreground: '#FFFFFF',
    50: '#F0F9FF',
    500: '#0EA5E9',
    600: '#0284C7',
  },
} as const;

export const borderRadius = {
  none: '0px',
  sm: '0.375rem',
  DEFAULT: '0.5rem',
  md: '0.625rem',
  lg: '0.75rem',
  xl: '1rem',
  '2xl': '1.25rem',
  '3xl': '1.5rem',
  full: '9999px',
} as const;

export const shadowScale = {
  none: 'none',
  xs: '0 1px 2px 0 rgba(15, 23, 42, 0.05)',
  soft: '0 2px 8px -2px rgba(15, 23, 42, 0.08), 0 1px 2px -1px rgba(15, 23, 42, 0.04)',
  card: '0 4px 16px -4px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.04)',
  elevated: '0 8px 32px -8px rgba(15, 23, 42, 0.12), 0 4px 8px -4px rgba(15, 23, 42, 0.06)',
  floating: '0 16px 48px -12px rgba(15, 23, 42, 0.16)',
} as const;

export const transitions = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  DEFAULT: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  properties: {
    color: 'color 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    background: 'background-color 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: 'opacity 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    transform: 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    all: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

export const zIndices = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  header: 30,
  sidebar: 40,
  overlay: 50,
  drawer: 60,
  modal: 70,
  popover: 80,
  toast: 90,
  tooltip: 100,
} as const;

export const breakpoints = {
  xs: '320px',
  sm: '414px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1440px',
} as const;

export const designTokens = {
  spacing,
  containerWidths,
  fontSize,
  fontWeight,
  colors,
  borderRadius,
  shadowScale,
  transitions,
  zIndices,
  breakpoints,
};

export default designTokens;
