/**
 * Keep Financial Literacy — Design System v2.0
 * ─────────────────────────────────────────────
 * Inspired by: Duolingo · Groww · Khan Academy · Headspace
 * Fonts: Plus Jakarta Sans (headings) + Inter (body)
 * Theme: Navy-dark background + Emerald growth green
 */

// ─── Brand Primitives ─────────────────────────────────────────────────────────

export const BrandColors = {
  emerald:   '#00C853',   // primary growth green (Groww-inspired)
  sapphire:  '#1E88E5',   // trust blue (Khan Academy-inspired)
  gold:      '#FFC400',   // reward gold (Duolingo coin colour)
  rose:      '#FF3D71',   // clear danger/error
  streak:    '#FF9100',   // streak flame orange (Duolingo streak)
  purple:    '#8E24AA',   // mastery / legendary tier
};

// ─── Full Colour Palette ──────────────────────────────────────────────────────

export const Colors = {
  // ── Backgrounds (navy-dark, not cold black) ──
  bg:           '#0B0E14',  // deep navy-black (warmer than pure #000)
  surface:      '#151B26',  // slate surface — elevated cards
  surfaceUp:    '#1F2839',  // second-level elevation (modals, popovers)
  surfaceCard:  '#1A2236',  // featured card background
  surfaceLight: '#F2F4F8',  // light surfaces (used inside HTML slides)
  surfaceAccent:'#1E2A40',  // accent-tinted surface

  // ── Borders ──
  border:       'rgba(255, 255, 255, 0.08)',   // default subtle border
  borderTop:    'rgba(255, 255, 255, 0.14)',   // lighter top = 3D depth effect
  borderBottom: 'rgba(0, 0, 0, 0.45)',         // darker bottom = 3D press shadow
  borderLight:  '#D6D8DA',
  borderStrong: '#334155',
  borderUp:     'rgba(255, 255, 255, 0.12)',
  borderBright: '#FFFFFF',
  borderAccent: 'rgba(30, 136, 229, 0.35)',

  // ── Text ──
  text:          '#F2F4F8',                   // primary: near-white with slight warmth
  textSecondary: '#9AA5B8',                   // secondary: readable muted blue-grey
  textMuted:     'rgba(242, 244, 248, 0.55)', // muted
  textFaint:     'rgba(242, 244, 248, 0.35)', // very faint
  textAccent:    '#1E88E5',                   // sapphire blue
  textSuccess:   '#00C853',                   // emerald green
  textDanger:    '#FF3D71',                   // rose red
  textWarning:   '#FFC400',                   // vivid gold

  // ── Brand Accents ──
  emerald:   '#00C853',   // primary CTA / success / growth
  emeraldDim: '#009624',  // 3D shadow for emerald buttons
  sapphire:  '#1E88E5',   // secondary interactive / trust
  sapphireDim:'#1565C0',  // 3D shadow for sapphire buttons
  gold:      '#FFC400',   // rewards, warnings, coins
  goldDim:   '#C79A00',   // 3D shadow for gold
  rose:      '#FF3D71',   // danger, wrong answers
  roseDim:   '#B71C1C',   // 3D shadow for rose
  streak:    '#FF9100',   // 🔥 streak flame
  streakDim: '#C66900',   // streak shadow
  purple:    '#8E24AA',   // mastery / legendary

  // ── Feedback States ──
  correctBg:    'rgba(0, 200, 83, 0.12)',
  correctBorder:'#00C853',
  correctGlow:  'rgba(0, 200, 83, 0.25)',
  wrongBg:      'rgba(255, 61, 113, 0.12)',
  wrongBorder:  '#FF3D71',
  wrongGlow:    'rgba(255, 61, 113, 0.20)',

  // ── Utility ──
  white:   '#FFFFFF',
  black:   '#000000',
  gray900: '#0B0E14',
  gray800: '#151B26',
  gray700: '#1F2839',
  gray600: '#334155',
  gray400: '#627086',
  gray200: '#9AA5B8',
  gray100: '#F2F4F8',

  // ── Functional aliases (kept for backward compat) ──
  success:   '#00C853',
  accent:    '#1E88E5',
  warning:   '#FFC400',
  danger:    '#FF3D71',
  highlight: '#1E88E5',
  blue:      '#1E88E5',
  green:     '#00C853',
  red:       '#FF3D71',
  indigo:    '#1E88E5',
  indigoD:   '#1565C0',
  amber:     '#FFC400',
  sky:       '#1E88E5',

  // ── Slide Card Variants ──
  slideText:  '#151B26',
  slideQuiz:  '#0B0E14',
  slideVideo: '#0B0E14',
  slideImage: '#151B26',
};

// ─── Border Radius ────────────────────────────────────────────────────────────

export const Radius = {
  sm:   8,
  md:   12,
  lg:   16,   // Duolingo standard card radius
  xl:   20,
  xxl:  28,
  card: 20,
  full: 9999,
};

// ─── Spacing (4px / 8px grid — Headspace standard) ───────────────────────────

export const Space = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  20,
  xl:  28,
  xxl: 40,
};

// ─── Typography ───────────────────────────────────────────────────────────────

export const Typography = {
  fontFamilies: {
    heading:  "'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    body:     "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    mono:     "'DM Mono', 'Courier New', monospace",
  },
  textStyles: {
    displayNum: {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: 48,
      fontWeight: '800' as const,
      lineHeight: 56,
      letterSpacing: -1,
    },
    headingLarge: {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: 28,
      fontWeight: '700' as const,
      lineHeight: 34,
      letterSpacing: -0.3,
    },
    headingMedium: {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: 22,
      fontWeight: '700' as const,
      lineHeight: 28,
      letterSpacing: -0.2,
    },
    subheadingSans: {
      fontFamily: "'Inter', sans-serif",
      fontSize: 17,
      fontWeight: '600' as const,
      lineHeight: 22,
    },
    labelUppercase: {
      fontFamily: "'Inter', sans-serif",
      fontSize: 11,
      fontWeight: '600' as const,
      letterSpacing: 1.4,
      textTransform: 'uppercase' as const,
    },
    bodyStandard: {
      fontFamily: "'Inter', sans-serif",
      fontSize: 15,
      lineHeight: 24,   // 1.6 line-height — edtech standard
      fontWeight: '400' as const,
    },
    bodyMuted: {
      fontFamily: "'Inter', sans-serif",
      fontSize: 13,
      lineHeight: 20,
      fontWeight: '400' as const,
      opacity: 0.6,
    },
  },
};

// ─── Font Tokens ──────────────────────────────────────────────────────────────

export const Font = {
  // Weight tokens
  regular:   '400' as const,
  medium:    '500' as const,
  semibold:  '600' as const,
  bold:      '700' as const,
  extrabold: '800' as const,
  black:     '900' as const,

  // Size scale (up from v1.0 to match edtech standards)
  xs:   11,   // labels, chips, counters
  sm:   13,   // meta, captions, hints
  base: 15,   // body text (was 15 — kept)
  md:   17,   // subheadings (was 18)
  lg:   20,   // card titles, quiz questions (was 22 — tightened)
  xl:   24,   // screen headings (was 28)
  xxl:  30,   // hero section (was 32)
  hero: 48,   // display numbers (was 50)
};

// ─── Layout Containers ────────────────────────────────────────────────────────

export const LayoutContainers = {
  scrollContainer: {
    height: '100vh',
    width: '100%',
    overflowY: 'auto' as const,
    scrollSnapType: 'y mandatory',
    scrollBehavior: 'smooth' as const,
  },
  screenWrapper: {
    height: '100vh',
    width: '100%',
    scrollSnapAlign: 'start',
    display: 'flex' as const,
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    padding: 20,
  },
  screenCard: {
    widthVariants: ['270px', '280px', '300px'],
    heightVariants: ['560px', '580px', '600px'],
    borderRadius: '20px',
    padding: '22px 20px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.06) inset',
  },
};

// ─── UI Components ────────────────────────────────────────────────────────────

export const UIComponents = {
  buttons: {
    // Emerald 3D tactile button (Duolingo-style)
    btnPrimary: {
      background: '#00C853',
      borderBottom: '4px solid #009624',
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '700' as const,
      borderRadius: 16,
      paddingVertical: 16,
      border: '2px solid #009624',
    },
    // Sapphire secondary button
    btnSecondary: {
      background: '#1E88E5',
      borderBottom: '4px solid #1565C0',
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '700' as const,
      borderRadius: 16,
      paddingVertical: 16,
    },
    // Ghost/outline button
    btnGhost: {
      background: 'transparent',
      border: '1.5px solid rgba(255,255,255,0.2)',
      color: '#F2F4F8',
      fontSize: 15,
      fontWeight: '600' as const,
      borderRadius: 16,
      paddingVertical: 14,
    },
  },
  inputField: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1.5px solid rgba(255, 255, 255, 0.12)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#F2F4F8',
  },
  card: {
    base: {
      background: '#151B26',
      borderWidth: 1.5,
      borderColor: 'rgba(255,255,255,0.08)',
      borderRadius: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
    },
  },
};

// ─── Animation Registry ───────────────────────────────────────────────────────

export const AnimationRegistry = [
  `@keyframes drift { 0% { opacity:0; transform:translateY(14px); } 100% { opacity:1; transform:translateY(0); } }`,
  `@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }`,
  `@keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }`,
  `@keyframes gearSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`,
  `@keyframes strike { 0% { width:0%; } 100% { width:100%; } }`,
  `@keyframes popIn { 0% { opacity:0; transform:scale(0.85) translateY(8px); } 100% { opacity:1; transform:scale(1) translateY(0); } }`,
  `@keyframes glowPulse { 0%,100% { box-shadow: 0 0 8px rgba(0,200,83,0.3); } 50% { box-shadow: 0 0 20px rgba(0,200,83,0.6); } }`,
];

// ─── FunctionalTokens (kept for backward compat) ─────────────────────────────

export const FunctionalTokens = {
  '--bg-page':        '#0B0E14',
  '--surface-1':       '#151B26',
  '--surface-2':       '#F2F4F8',
  '--border-strong':   '#334155',
  '--border-light':    '#D6D8DA',
  '--text-primary':    '#F2F4F8',
  '--text-secondary':  '#9AA5B8',
  '--text-muted':      'rgba(242, 244, 248, 0.55)',
  '--text-accent':     '#1E88E5',
  '--text-danger':     '#FF3D71',
  '--text-success':    '#00C853',
  '--text-warning':    '#FFC400',
};
