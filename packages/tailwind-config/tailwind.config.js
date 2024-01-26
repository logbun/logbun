/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    '../../packages/ui/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    debugScreens: {
      position: ['bottom', 'right'],
    },
    extend: {
      flex: { 2: '2 1 0%' },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/forms'), require('tailwindcss-debug-screens')],
};
