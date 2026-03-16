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
          base:    '#0F0F14',
          surface: '#16161E',
          card:    '#1C1C27',
          hover:   '#222232',
        },
        txt: {
          untyped: '#3D3D55',
          muted:   '#5A5A7A',
          sub:     '#8888AA',
          base:    '#C8C8E0',
          bright:  '#E8E8F8',
        },
        accent: {
          correct: '#4ADE80',
          error:   '#F87171',
          cursor:  '#7C6AF7',
          gold:    '#FBBF24',
        },
        brand: '#7C6AF7',
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