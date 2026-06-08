/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#E67E22",
        "primary-dark": "#CA6F1E",
        background: "#FFFBF5",
        surface: "#FFFFFF",
        "surface-warm": "#FFF3E0",
        "text-main": "#1A1A1A",
        "text-muted": "#888888",
        "border-soft": "#EDE0D0",
        "green-fresh": "#27AE60",
      },
    },
  },
  plugins: [],
}
