/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        primary : "#2D85FF",
        secondary : "#ef863e"
      }
    },
  },
  plugins: [],
}

