/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        black: "#1A1A1A",
        white: "#FCFCFC",
        tintColor: "#79b880",
        darkTintColor: "#39733e",
        blue: "#66aec4",
        red: "#fc6565",
        grey: "#242424",
        darkGreen: "#008229",
      },
    }
  },
  plugins: [],
};
