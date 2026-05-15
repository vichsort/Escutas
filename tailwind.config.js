/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1DB954',
        backgroundLight: '#f3f4f6', 
        backgroundDark: '#121212',
        surfaceLight: '#ffffff',
        surfaceDark: '#1e1e1e',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      keyframes: {
        'organic-spin': {
          '0%': { transform: 'rotate(0deg)' },
          '40%': { transform: 'rotate(180deg)' },
          '100%': { transform: 'rotate(360deg)' }
        }
      },
      animation: {
        'organic-spin': 'organic-spin 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite',
      }
    },
  },
  plugins: [],
}