/** @type {import('tailwindcss').Config} */
export default {
  content: ['./**/*.{html,ts}', '!./node_modules/**', '!./dist/**'],
  theme: {
    extend: {
      colors: {
        'abyss': '#01050e',
        'trench': '#02101f',
        'deepsea': '#04223b',
        'reef': '#0a3552',
        'foam': '#e8f6ff',
        'mist': '#93b8cc',
        'glow': '#31d8ff',
        'glowlite': '#8ceaff',
        'glowdim': '#31d8ff1a',
        'coral': '#ff8a5c',
        'kelp': '#3ddc97',
      },
      fontFamily: {
        display: ['Rajdhani', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        body: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
