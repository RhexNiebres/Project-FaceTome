/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        '1':'#3e3e42',
        '2':'#2d2d30',
        '3':'#252526',
        '4':'#1e1e1e',

      }
    },
  },
  plugins: [],
}