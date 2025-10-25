/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'canvas-bg': '#f8f9fa',
        'canvas-border': '#e9ecef',
        'canvas-text': '#495057',
        'canvas-accent': '#007bff',
      },
    },
  },
  plugins: [],
}
