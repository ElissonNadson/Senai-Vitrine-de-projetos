/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './index.html'],
  darkMode: 'class', // 🌙 Habilita modo escuro com classe 'dark'
  theme: {
    extend: {
      colors: {
        'senai-blue': '#003087',
        'senai-red': '#E30613',
        'bg-layouts': '#f7f5f5',
        'button-primary': '#242342'
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'zoom-in': {
          '0%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        }
      },
      animation: {
        'in': 'fade-in 0.2s ease-out, zoom-in 0.2s ease-out',
        shimmer: 'shimmer 2s infinite linear'
      }
    }
  },
  plugins: []
}
