/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'dark-blue': '#0050A0',          // Dark Blue
        'turquoise': '#40E0D0',           // Turquoise
        'dark-gray-70': 'rgba(64,64,64,0.7)', // Dark Gray 70%
      },
      fontFamily: {
        philosopher: ['Philosopher', 'sans-serif'],
         din: ['D-DIN Pro', 'sans-serif'],
      },
    },
  },
  plugins: [require('tailwind-scrollbar'),],
};


 