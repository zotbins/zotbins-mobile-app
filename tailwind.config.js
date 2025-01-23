/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}", // Entry file
    "./screens/**/*.{js,jsx,ts,tsx}", // Include all screens
    "./components/**/*.{js,jsx,ts,tsx}", // Include all components
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        black: "#1A1A1A",
        white: "#FCFCFC",
        tintColor: "#79b880",
        blue: "#66aec4",
        red: "#fc6565",
        grey: "#242424",
        teal: "#a5d4c2",
        tealLite: "#e9f5f0",
        tealMed: "#73ba9f",
      },
    }
  },
  plugins: [],
};
