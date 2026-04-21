export const colors = {
  bg: '#070B14', s1: '#0D1320', s2: '#111827', s3: '#1A2236', s4: '#222D42',
  bd: 'rgba(255,255,255,0.06)', bd2: 'rgba(255,255,255,0.10)', bd3: 'rgba(255,255,255,0.03)',
  t1: '#F0F4FF', t2: 'rgba(240,244,255,0.60)', t3: 'rgba(240,244,255,0.35)', t4: 'rgba(240,244,255,0.15)',
  cyan: '#00E5FF', cyanBg: 'rgba(0,229,255,0.12)', cyanBg2: 'rgba(0,229,255,0.06)',
  green: '#00FF87', greenBg: 'rgba(0,255,135,0.10)', greenBg2: 'rgba(0,255,135,0.06)',
  red: '#FF3B5C', redBg: 'rgba(255,59,92,0.12)', redBg2: 'rgba(255,59,92,0.06)',
  amber: '#FFB800', amberBg: 'rgba(255,184,0,0.12)',
  purple: '#7C3AED', purpleBg: 'rgba(124,58,237,0.15)',
  white: '#FFFFFF', black: '#000000', map: '#0A1628',
} as const;

export const fontFamily = {
  display: 'Syne-Bold',
  sans: 'DMSans-Regular', sansMd: 'DMSans-Medium', sansBd: 'DMSans-Bold',
  mono: 'JetBrainsMono-Regular', monoMd: 'JetBrainsMono-Medium',
} as const;

export const fontSize = {
  xs: 10, sm: 12, base: 14, md: 16, lg: 18, xl: 20,
  '2xl': 24, '3xl': 28, '4xl': 32, '5xl': 40, '6xl': 48, '7xl': 56,
} as const;

export const spacing = {
  0: 0, 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24,
  7: 28, 8: 32, 10: 40, 12: 48, 14: 56, 16: 64,
} as const;

export const radius = {
  xs: 6, sm: 8, md: 12, lg: 16, xl: 20, '2xl': 24, '3xl': 28, full: 9999,
} as const;

export const shadows = {
  sm:    { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 6, elevation: 2 },
  md:    { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 12, elevation: 5 },
  lg:    { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 20, elevation: 10 },
  cyan:  { shadowColor: '#00E5FF', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.35, shadowRadius: 20, elevation: 8 },
  red:   { shadowColor: '#FF3B5C', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.40, shadowRadius: 20, elevation: 8 },
  green: { shadowColor: '#00FF87', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.30, shadowRadius: 16, elevation: 6 },
} as const;

export const dimensions = {
  buttonHeight: 54, buttonHeightSm: 40, inputHeight: 52,
  tabBarHeight: 72, headerHeight: 56,
  iconSm: 16, iconMd: 20, iconLg: 24, iconXl: 32,
  avatarSm: 32, avatarMd: 44, avatarLg: 56, touchMin: 44,
} as const;

export const duration = { fast: 150, normal: 250, slow: 400, xslow: 600 } as const;
