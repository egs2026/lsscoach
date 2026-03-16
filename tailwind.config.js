/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'egs-teal': '#2C5F5D',
        'egs-teal-dark': '#1B4948',
        'egs-gold': '#F39C12',
        'egs-gold-warm': '#E67E22',
      }
    },
  },
  plugins: [],
}
