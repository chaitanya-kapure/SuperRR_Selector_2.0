/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Rajasthan Royals Design System v2 ──────────────────────
        'rr-pink':        '#E91E63',
        'rr-pink-bright': '#FF1768',
        'rr-pink-dark':   '#C2185B',
        'rr-pink-light':  '#F48FB1',
        // Navies
        'rr-navy':        '#0B1020',
        'rr-navy-deep':   '#080D1B',
        'rr-navy-card':   '#111A30',
        'rr-navy-mid':    '#151E35',
        'rr-navy-light':  '#1A2540',
        'rr-navy-hover':  '#1E2D4A',
        // Purple accent
        'rr-purple':      '#241338',
        'rr-purple-light':'#2E1848',
        // Gold
        'rr-gold':        '#D4AF37',
        'rr-gold-light':  '#E8C94C',
        // Text
        'rr-white':       '#FFFFFF',
        'rr-muted':       '#A7B2C7',
        'rr-muted-dim':   '#6B7A99',
        // Border
        'rr-border':      'rgba(255,255,255,0.07)',
        'rr-border-pink': 'rgba(233,30,99,0.25)',
        'rr-border-gold': 'rgba(212,175,55,0.25)',
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow':  'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(233,30,99,0.18) 0%, transparent 70%)',
        'pink-glow':  'radial-gradient(ellipse at center, rgba(233,30,99,0.20) 0%, transparent 70%)',
        'purple-glow':'radial-gradient(ellipse at center, rgba(36,19,56,0.95) 0%, transparent 100%)',
      },
      boxShadow: {
        'rr-pink':     '0 0 24px rgba(233,30,99,0.30)',
        'rr-pink-sm':  '0 0 12px rgba(233,30,99,0.20)',
        'rr-gold':     '0 0 20px rgba(212,175,55,0.25)',
        'card':        '0 4px 24px rgba(0,0,0,0.40)',
        'card-hover':  '0 8px 40px rgba(0,0,0,0.60)',
        'inner-pink':  'inset 0 1px 0 rgba(233,30,99,0.15)',
      },
      animation: {
        'fade-in':    'fadeIn 0.4s ease-out',
        'slide-up':   'slideUp 0.35s ease-out',
        'pulse-dot':  'pulseDot 2s cubic-bezier(0.4,0,0.6,1) infinite',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(14px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        pulseDot:{ '0%,100%': { opacity: '1' }, '50%': { opacity: '0.35' } },
      },
    },
  },
  plugins: [],
}
