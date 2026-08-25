/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        salon: {
          dark: '#0B0B0E',
          card: '#141419',
          border: '#26262F',
          gold: '#D4AF37',
          'gold-light': '#F3E5AB',
          'gold-dark': '#AA8C2C',
          cream: '#F9F6F0',
          muted: '#99958F',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 10px rgba(212, 175, 55, 0.2)' },
          '100%': { boxShadow: '0 0 25px rgba(212, 175, 55, 0.6)' },
        }
      }
    },
  },
  plugins: [],
}
