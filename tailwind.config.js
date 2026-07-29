/** @type {import('tailwindcss').Config} */
export default {
  content: ['./**/*.{html,ts}', '!./node_modules/**'],
  theme: {
    extend: {
      colors: {
        'accent': '#06B6D4',
        'accent-light': '#22D3EE',
        'accent-dim': '#06B6D41A',
        'surface': '#0F1923',
        'ocean': '#020813',
      },
      fontFamily: {
        display: ['"Press Start 2P"', 'system-ui', 'monospace'],
        body: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
