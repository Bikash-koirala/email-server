/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        Dark1: "#1D2028",
        Dark2: "#2C323B",
        Dark3: "#22262F",
        DarkButton: "#21262D",
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
