/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFF5F0',
          100: '#FFE8DC',
          200: '#FFD1B9',
          300: '#FFBA96',
          400: '#FFA373',
          500: '#FF8C50',
          600: '#FF7533',
          700: '#F05D1A',
          800: '#C94A0F',
          900: '#A03708',
        },
        secondary: {
          50: '#FFF3F8',
          100: '#FFE0ED',
          200: '#FFC1DB',
          300: '#FFA2C9',
          400: '#FF83B7',
          500: '#FF64A5',
          600: '#FF4593',
          700: '#E62E7A',
          800: '#C02261',
          900: '#9A1848',
        },
        accent: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        display: ['"Poppins"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(255, 140, 80, 0.3)',
        'glow-lg': '0 0 30px rgba(255, 140, 80, 0.4)',
      },
    },
  },
  plugins: [],
};
