/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ["'DM Serif Display'", 'Georgia', 'serif'],
        sans: ["'DM Sans'", 'system-ui', 'sans-serif'],
        mono: ["'Source Code Pro'", 'monospace'],
      },
      colors: {
        paper: '#f4f1ed',
        'paper-light': '#faf8f5',
        teal: {
          DEFAULT: '#3d8c87',
          mid: '#4fa39d',
          soft: '#d0e9e7',
          pale: '#e8f3f2',
          dark: '#2a6b67',
        },
        sage: {
          DEFAULT: '#7aac6e',
          light: '#edf5eb',
        },
        ink: {
          DEFAULT: '#1c1917',
          secondary: '#5a5550',
          tertiary: '#8a827a',
        },
        sand: '#c8b99a',
        'sand-soft': '#f0ece5',
        cream: '#faf8f5',
        border: '#e5e1dc',
        'border-subtle': '#eeeae5',
        panel: '#faf8f5',
      },
      borderRadius: {
        sm: '10px',
        md: '18px',
        lg: '28px',
        pill: '40px',
      },
      boxShadow: {
        soft: '0 2px 24px rgba(30,40,38,0.07)',
        'soft-lg': '0 8px 48px rgba(30,40,38,0.10)',
        card: '0 2px 8px rgba(28,25,23,0.04)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.25s ease-out forwards',
        pulse: 'pulse 2s infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}