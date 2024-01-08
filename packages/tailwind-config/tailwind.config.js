/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: 'class',
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
      flex: {
        2: '2 1 0%',
      },
      // boxShadow: {
      //   default: '0 12px 16px 0 rgba(0,0,0,0.03),0 1px 2px 0 rgba(0,0,0,0.04)',
      // },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('tailwindcss-debug-screens')],
};
