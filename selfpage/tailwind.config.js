/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg': '#060810',
        'bg-2': '#0d1520',
        'bg-3': '#131f30',
        'accent': '#00d4ff',
        'accent-2': '#7b61ff',
        'success': '#00ff88',
        'warning': '#ffb800',
        'text': '#e8f0f8',
        'muted': '#6b7f94',
      },
      fontFamily: {
        'orbitron': ['Orbitron', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}