/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: '#0B2545',
          navyLight: '#134074',
          blue: '#1D4ED8',
          blueLight: '#3B82F6',
          bg: '#F8FAFC',
          card: '#FFFFFF',
          border: '#E2E8F0',
          textMain: '#0F172A',
          textMuted: '#64748B',
          accent: '#0284C7',
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
        }
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'elevated': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
