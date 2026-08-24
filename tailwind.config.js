/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Deep green — primary brand
        brand: {
          50: '#f0f7f1',
          100: '#dcebe0',
          200: '#bbd7c2',
          300: '#8fbb9d',
          400: '#5e9874',
          500: '#3d7b56',
          600: '#2c6244',
          700: '#244f38',
          800: '#1f3f2e',
          900: '#1a3427',
        },
        // Soil brown — secondary
        soil: {
          50: '#faf6f0',
          100: '#f3e9d9',
          200: '#e6d2b4',
          300: '#d4b486',
          400: '#c2965e',
          500: '#a97c44',
          600: '#8c6437',
          700: '#6f4f2e',
          800: '#544028',
          900: '#3d3020',
        },
        // Muted yellow — secondary accent
        mustard: {
          50: '#fdfaf0',
          100: '#faf0d6',
          200: '#f4df9e',
          300: '#edc75d',
          400: '#e3b23a',
          500: '#cf9a2b',
          600: '#a87a23',
          700: '#845f20',
          800: '#6a4d20',
          900: '#59401f',
        },
        // Blue — weather & information accent
        sky: {
          50: '#eef6fb',
          100: '#d4e9f5',
          200: '#aed3eb',
          300: '#7bb6db',
          400: '#4a96c6',
          500: '#2e7aab',
          600: '#246290',
          700: '#215175',
          800: '#224561',
          900: '#213a54',
        },
        // Warm neutral base
        cream: {
          50: '#fcfbf8',
          100: '#f8f6ef',
          200: '#f1ece1',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Segoe UI', 'sans-serif'],
        serif: ['Lora', 'Georgia', 'serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(31, 63, 46, 0.06), 0 1px 2px rgba(31, 63, 46, 0.04)',
        cardhover: '0 4px 12px rgba(31, 63, 46, 0.08), 0 2px 4px rgba(31, 63, 46, 0.06)',
      },
    },
  },
  plugins: [],
};
