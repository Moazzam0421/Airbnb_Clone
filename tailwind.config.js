/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],  // DaisyUI plugin
  daisyui: {
    themes: ["light", "dark"],  // You can add custom themes here
  },
}



