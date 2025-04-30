/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{tsx,ts,jsx,js}', './src/styles/**/*.{css}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary-color)', // #595F39 (Dark green)
        secondary: 'var(--secondary-color)', // #C4C5BA (Neutral gray green)
        accent: 'var(--accent-color)', // #F2B552 (Yellow)
        background: 'var(--background-color)', // #E4E4DE (Light gray)
        text: 'var(--text-color)', // #1B1B1B (Dark text)
      },
    },
  },
  plugins: [],
};