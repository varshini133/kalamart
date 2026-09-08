/**
 * KalaConnect Design System Tokens
 * Theme: Warm, trustworthy, culturally rich, modern, premium and human.
 * Inspired by traditional Indian craftsmanship (Kutch terracotta, natural madder, warm turmeric, earthy sands).
 */

export const DESIGN_TOKENS = {
  colors: {
    // Primary - Deep Terracotta / Earthy Madder
    primary: {
      DEFAULT: '#8A2510',
      container: '#4A1105',
      onPrimary: '#FFFFFF',
      onContainer: '#FFDCD3',
      light: '#F8E9E4'
    },
    // Secondary - Warm Turmeric Brass / Amber Gold
    secondary: {
      DEFAULT: '#B45309',
      container: '#78350F',
      onSecondary: '#FFFFFF',
      onContainer: '#FEF3C7',
      light: '#FFFBEB'
    },
    // Background - Warm Handcrafted Alabaster Paper
    background: {
      DEFAULT: '#FBF8F3',
      dark: '#1C1917'
    },
    // Surface - Crisp Warm Alabaster Card Surface
    surface: {
      DEFAULT: '#FBF8F3',
      lowest: '#FFFFFF',
      low: '#F6F1E9',
      container: '#EFE8DD',
      high: '#E7DFD3',
      highest: '#DFD4C2'
    },
    // Text Colors - Espresso Charcoal & Warm Slate
    text: {
      primary: '#1C1917',
      secondary: '#44403C',
      muted: '#78716C',
      inverted: '#FFFFFF'
    },
    // Success - Forest Jade
    success: {
      DEFAULT: '#15803D',
      container: '#DCFCE7',
      text: '#14532D'
    },
    // Warning - Rich Marigold Amber
    warning: {
      DEFAULT: '#B45309',
      container: '#FEF3C7',
      text: '#78350F'
    },
    // Error - Earthy Terracotta Crimson
    error: {
      DEFAULT: '#B91C1C',
      container: '#FEE2E2',
      text: '#7F1D1D'
    },
    // Border - Warm Sand & Stone
    border: {
      subtle: '#F0EAE1',
      DEFAULT: '#E5DFD5',
      strong: '#D4CABE'
    }
  },
  typography: {
    hero: 'font-serif text-3xl sm:text-4xl font-bold tracking-tight text-primary leading-tight',
    pageTitle: 'font-serif text-2xl font-bold text-primary tracking-tight',
    sectionHeading: 'font-sans text-lg sm:text-xl font-bold text-primary',
    cardTitle: 'font-sans text-base font-bold text-on-surface leading-snug',
    body: 'font-sans text-sm text-on-surface leading-relaxed',
    caption: 'font-sans text-xs text-on-surface-variant',
    buttonText: 'font-sans text-sm font-semibold tracking-wide'
  }
} as const;
