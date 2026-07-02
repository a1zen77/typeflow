/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        bg: {
          base:    'var(--bg-base)',
          surface: 'var(--bg-surface)',
          card:    'var(--bg-card)',
          hover:   'var(--bg-hover)',
        },
        txt: {
          untyped: 'var(--txt-untyped)',
          muted:   'var(--txt-muted)',
          sub:     'var(--txt-sub)',
          base:    'var(--txt-base)',
          bright:  'var(--txt-bright)',
        },
        accent: {
          correct: 'var(--accent-correct)',
          error:   'var(--accent-error)',
          cursor:  'var(--accent-cursor)',
          gold:    'var(--accent-gold)',
        },
        btn: {
          text: 'var(--btn-text)',
        },
        brand: 'var(--brand)',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulse_soft: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.6' },
        }
      },
      animation: {
        blink:        'blink 1s step-end infinite',
        'fade-up':    'fadeUp 0.35s ease forwards',
        'pulse-soft': 'pulse_soft 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}