/**
 * FileForge AI - Sakuga Design System Tokens
 * Shared between Next.js Web and React Native Expo Mobile
 */

export const SakugaTheme = {
  colors: {
    // Canvas & Dark Creative Studio Backgrounds
    background: '#0a0a0f',
    backgroundElevated: '#12121c',
    backgroundSubtle: '#181824',
    card: '#12121c',
    cardBorder: 'rgba(255, 255, 255, 0.12)',
    cardBorderActive: 'rgba(139, 92, 246, 0.5)',

    // Sakuga Brand Primary (Violet / Lavender)
    primary: '#8b5cf6',
    primaryLight: '#a78bfa',
    primaryDark: '#6d28d9',
    primaryGlow: 'rgba(139, 92, 246, 0.35)',

    // Sakuga Accent (Hot Pink / Magenta)
    accent: '#ec4899',
    accentLight: '#f472b6',
    accentDark: '#be185d',
    accentGlow: 'rgba(236, 72, 153, 0.35)',

    // Semantic States
    success: '#10b981',
    successGlow: 'rgba(16, 185, 129, 0.35)',
    warning: '#f59e0b',
    warningGlow: 'rgba(245, 158, 11, 0.35)',
    danger: '#ef4444',
    dangerGlow: 'rgba(239, 68, 68, 0.35)',
    info: '#3b82f6',

    // Text & Surfaces
    textPrimary: '#f0eee9',
    textSecondary: '#9ca3af',
    textMuted: '#6b7280',
    textInverse: '#0a0a0f',

    // Overlays
    backdrop: 'rgba(10, 10, 15, 0.85)',
    whiteAlpha10: 'rgba(255, 255, 255, 0.10)',
    whiteAlpha05: 'rgba(255, 255, 255, 0.05)',
  },

  typography: {
    fontFamilySans: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontFamilyMono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    fontWeights: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800'
    }
  },

  radii: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 9999
  },

  // Anime-inspired Physics & Spring Dynamics
  animation: {
    squashScale: 0.94,
    burstScale: 1.05,
    springPhysics: {
      stiffness: 350,
      damping: 24,
      mass: 0.8
    },
    durationFastMs: 150,
    durationNormalMs: 250,
    durationSlowMs: 400
  }
} as const;
