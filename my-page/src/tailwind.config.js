import flowbite from 'flowbite/plugin'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      fontFamily: {
        // inter: ['Inter', 'sans-serif'],
        orbiter: ['"TASA Orbiter Display"', 'sans-serif'],
      },
      colors: {
        darkText: '#1C1515',    // para títulos o texto fuerte
        highlight: '#EA4711',   // para palabras destacadas como "Productivity"
        grayText: '#766D6D',    // texto secundario
      },
    },
  },
  darkMode: 'class',
  plugins: [flowbite],
}
