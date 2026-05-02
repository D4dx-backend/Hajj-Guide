/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf8ee',
          100: '#faefd4',
          200: '#f4dca3',
          300: '#ecc368',
          400: '#e5a938',
          500: '#dc8f20',
          600: '#c27016',
          700: '#a15315',
          800: '#834218',
          900: '#6c3718',
          950: '#3e1c09',
        },
        gold: {
          400: '#d4a843',
          500: '#c49a38',
          600: '#b08928',
        },
      },
      fontFamily: {
        arabic: ['Amiri', 'serif'],
      },
    },
  },
  plugins: [],
};
