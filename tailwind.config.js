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
        darkestGreen: "#004C18",
        primaryGreen: "#48bb78",
        lightBackground: "#F4FFF2",
        mediumGreen: "#00762B",
        brightGreen: "#00BF1A",
        lightestGreen: "#E8FFEB",
        brightGreen2: "#89FF99",
        highlightGreen: "#BDFFC6",
      },
    },
  },
  plugins: [],
};
