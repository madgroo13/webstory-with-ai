/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-card': 'rgba(20, 20, 20, 0.85)',
        'bg-input': 'rgba(255, 255, 255, 0.1)',
        'text-main': '#e0e0e0',
        'text-muted': '#a0a0a0',
        'accent': '#4ade80',
        'danger': '#ef4444',
        'warning': '#facc15',
        'info': '#3b82f6',
        'border-color': 'rgba(255,255,255,0.15)',
      }
    },
  },
  plugins: [],
}